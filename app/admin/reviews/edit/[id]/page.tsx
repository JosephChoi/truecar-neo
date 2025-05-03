"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ReviewForm from "@/components/admin/ReviewForm";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface EditReviewPageProps {
  params: {
    id: string;
  };
}

export default function EditReviewPage({ params }: EditReviewPageProps) {
  // React.use로 params를 언래핑
  const unwrappedParams = use(params as any) as { id: string };
  const reviewId = unwrappedParams.id;
  
  const router = useRouter();
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;
    
    // Supabase에서 리뷰 데이터 가져오기
    const fetchReview = async () => {
      try {
        setLoading(true);
        
        // 먼저 관리자 권한 확인
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
        
        const { data, error: fetchError } = await supabase
          .from('reviews')
          .select('*')
          .eq('id', reviewId)
          .single();
        
        if (fetchError) {
          throw new Error('리뷰를 찾을 수 없습니다.');
        }
        
        if (data) {
          // ReviewForm 컴포넌트에 맞게 데이터 형식을 변환합니다.
          setReview({
            title: data.title || "",
            content: data.content || "",
            author: data.author || "",
            date: data.date || data.created_at?.slice(0, 10) || new Date().toISOString().split('T')[0],
            imageUrl: data.image_url || "",
            orderDetail: {
              vehicleType: data.vehicle_type || "",
              budget: data.budget || "",
              mileage: data.mileage || "",
              preferredColor: data.preferred_color || "",
              repairHistory: data.repair_history || "",
              referenceSite: data.reference_site || ""
            }
          });
        } else {
          setError("리뷰를 찾을 수 없습니다.");
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error("리뷰 로드 중 오류:", err);
        setError(err.message || "리뷰 데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };
    
    fetchReview();
  }, [reviewId]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 이미지 URL 처리
      let imageUrl = data.imageUrl;
      
      // 새로운 이미지가 업로드된 경우 스토리지에 저장
      if (data.imageUrl && data.imageUrl.startsWith('data:image/')) {
        try {
          const uploadResult = await uploadImageToStorage(data.imageUrl);
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
        author: data.author,
        date: data.date,
        image_url: imageUrl, // 수정: imageUrl -> image_url (Supabase 컬럼명)
        vehicle_type: data.orderDetail.vehicleType,
        budget: data.orderDetail.budget,
        mileage: data.orderDetail.mileage,
        preferred_color: data.orderDetail.preferredColor,
        repair_history: data.orderDetail.repairHistory,
        reference_site: data.orderDetail.referenceSite,
        updated_at: new Date().toISOString()
      };
      
      console.log("리뷰 업데이트 데이터:", reviewData);
      
      // Supabase에 리뷰 업데이트
      const { data: updatedReview, error: updateError } = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('id', reviewId)
        .select()
        .single();
      
      if (updateError) {
        throw new Error(`리뷰 수정 오류: ${updateError.message}`);
      }
      
      // 저장 후 관리 페이지로 이동
      alert('리뷰가 성공적으로 수정되었습니다.');
      router.replace("/admin/reviews");
    } catch (error: any) {
      console.error("리뷰 수정 중 오류:", error);
      setError(error.message || "리뷰 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이미지를 Supabase Storage에 업로드하는 함수
  const uploadImageToStorage = async (dataUrl: string): Promise<{ url: string }> => {
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

  // ID가 유효하지 않거나 리뷰를 찾을 수 없는 경우
  if (!loading && !review && !error) {
    notFound();
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
                리뷰 수정
              </h1>
              <p className="text-lg text-gray-700">
                리뷰 #{reviewId}을 수정합니다
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
        
        {loading ? (
          <div className="container mx-auto px-4 py-10 max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          </div>
        ) : review ? (
          <ReviewForm
            initialData={review}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="container mx-auto px-4 py-10 max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
              <p className="text-gray-500">리뷰를 찾을 수 없거나 접근할 수 없습니다.</p>
              <button 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => router.push('/admin/reviews')}
              >
                목록으로 돌아가기
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 