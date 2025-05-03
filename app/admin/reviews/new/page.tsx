"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ReviewForm from "@/components/admin/ReviewForm";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';

export default function NewReviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 관리자 권한 확인
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // 세션 확인
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // 로그인되지 않은 경우 로그인 페이지로 리디렉션
          console.log('세션 없음: 로그인 페이지로 이동');
          router.replace('/admin/login');
          return;
        }
        
        // 관리자 권한 확인
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', session.user.email)
          .single();
          
        if (adminError || !adminUser) {
          // 관리자가 아닌 경우 로그인 페이지로 리디렉션
          console.error('관리자 권한 없음:', adminError);
          await supabase.auth.signOut();
          router.replace('/admin/login?unauthorized=true');
          return;
        }
        
        // 관리자 확인됨
        setIsAdmin(true);
      } catch (err) {
        console.error('인증 확인 중 오류:', err);
        setError('인증 정보를 확인하는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [router]);

  const handleSubmit = async (data: any) => {
    if (!isAdmin) {
      alert('관리자 권한이 필요합니다.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 이미지 URL 처리
      let imageUrl = data.imageUrl;
      
      // 새로운 이미지가 업로드된 경우 스토리지에 저장
      if (data.imageUrl && data.imageUrl.startsWith('data:image/')) {
        try {
          const uploadResult = await uploadImage(data.imageUrl);
          imageUrl = uploadResult.url;
          console.log('이미지 업로드 성공:', imageUrl);
        } catch (imageError: any) {
          console.error('이미지 업로드 실패:', imageError);
        }
      }
      
      // 리뷰 데이터 구성
      const reviewData = {
        title: data.title,
        content: data.content,
        rating: 5, // 기본값 설정
        author: data.author,
        date: data.date,
        image_url: imageUrl,
        status: 'approved', // 관리자가 생성한 리뷰는 자동 승인
        vehicle_type: data.orderDetail.vehicleType,
        budget: data.orderDetail.budget,
        mileage: data.orderDetail.mileage,
        preferred_color: data.orderDetail.preferredColor,
        repair_history: data.orderDetail.repairHistory,
        reference_site: data.orderDetail.referenceSite,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Supabase에 리뷰 저장
      const { data: newReview, error: insertError } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single();
      
      if (insertError) {
        throw new Error(`리뷰 작성 오류: ${insertError.message}`);
      }
      
      // 저장 후 관리 페이지로 이동
      alert('리뷰가 성공적으로 저장되었습니다.');
      router.replace("/admin/reviews");
    } catch (error: any) {
      console.error("리뷰 저장 중 오류:", error);
      setError(error.message || "리뷰 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 이미지를 스토리지에 업로드하는 함수
  const uploadImage = async (dataUrl: string): Promise<{ url: string }> => {
    // Base64 데이터 URL을 Blob으로 변환
    const base64Data = dataUrl.split(',')[1];
    const blob = await (await fetch(`data:image/jpeg;base64,${base64Data}`)).blob();
    
    // 파일명 생성 (고유한 ID 사용)
    const fileName = `review-${Date.now()}.jpg`;
    
    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('review-images')
      .upload(`reviews/${fileName}`, blob, { 
        contentType: 'image/jpeg',
        cacheControl: '3600'
      });
    
    if (error) {
      throw new Error(`이미지 업로드 오류: ${error.message}`);
    }
    
    // 업로드된 이미지의 공개 URL 생성
    const { data: publicUrlData } = supabase
      .storage
      .from('review-images')
      .getPublicUrl(`reviews/${fileName}`);
    
    return { url: publicUrlData.publicUrl };
  };

  const handleCancel = () => {
    router.push("/admin/reviews");
  };

  // 로딩 중이거나 관리자가 아닌 경우 적절한 UI 표시
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="bg-white rounded-lg shadow p-8 max-w-md text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">접근 권한 없음</h2>
            <p className="text-gray-600 mb-6">
              이 페이지는 관리자만 접근할 수 있습니다. 관리자 계정으로 로그인해주세요.
            </p>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => router.push('/admin/login')}
            >
              로그인 페이지로 이동
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="py-8 bg-gradient-to-br from-blue-50 to-gray-50 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-1 rounded-full text-blue-700 bg-blue-100 text-sm font-medium mb-4">
                ADMIN
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                새 리뷰 작성
              </h1>
              <p className="text-lg text-gray-700">
                관리자 계정으로 새로운 리뷰를 작성합니다
              </p>
            </div>
          </div>
        </div>
        
        {/* 에러 메시지 표시 */}
        {error && (
          <div className="container mx-auto px-4 py-4 max-w-4xl">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <ReviewForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </main>
      <Footer />
    </div>
  );
} 