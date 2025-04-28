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
  const [isLoading, setIsLoading] = useState(false);

  // Supabase 연결 확인
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from('reviews').select('count');
        if (error) {
          throw new Error(`Supabase 연결 오류: ${error.message}`);
        }
        console.log('Supabase 연결 성공:', data);
      } catch (err: any) {
        console.error('Supabase 연결 오류:', err);
        setError(`데이터베이스 연결 중 오류가 발생했습니다: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      let imageUrl = null;
      
      // 이미지가 있는 경우 먼저 스토리지에 업로드
      if (data.imageUrl && data.imageUrl.startsWith('data:image/')) {
        try {
          const uploadResult = await uploadImageToStorage(data.imageUrl);
          imageUrl = uploadResult.url;
          console.log('이미지 업로드 성공:', imageUrl);
        } catch (imageError: any) {
          console.error('이미지 업로드 실패:', imageError);
          // 이미지 업로드 실패해도 계속 진행 (선택적으로 에러 처리 가능)
        }
      }
      
      // 리뷰 데이터 준비 - 테이블 구조에 맞게 데이터 포맷
      const reviewData = {
        title: data.title,
        content: data.content,
        rating: 5, // 기본값
        status: 'approved', // 관리자가 작성하므로 바로 승인 상태
        image_url: imageUrl, // 업로드된 이미지 URL
        author: data.author, // 작성자 필드
        date: data.date, // 작성일 필드
        vehicle_type: data.orderDetail.vehicleType, // 차종 필드
        budget: data.orderDetail.budget, // 예산 필드
        mileage: data.orderDetail.mileage, // 주행거리 필드
        preferred_color: data.orderDetail.preferredColor, // 선호색상 필드
        repair_history: data.orderDetail.repairHistory, // 수리여부 필드
        reference_site: data.orderDetail.referenceSite, // 참고 사이트 필드
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          system_version: "1.0",
          admin_created: true
        }
      };
      
      console.log('저장할 리뷰 데이터:', reviewData);
      
      // Supabase에 저장
      const { data: savedReview, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();
      
      if (error) {
        throw new Error(`데이터 저장 오류: ${error.message}`);
      }
      
      console.log('리뷰 저장 성공:', savedReview);
      
      // 성공적으로 저장 후 리뷰 목록 페이지로 이동
      alert('리뷰가 성공적으로 저장되었습니다.');
      router.replace('/admin/reviews');
    } catch (error: any) {
      console.error("리뷰 저장 실패:", error);
      const errorMsg = error.message || "리뷰를 저장하는 데 문제가 발생했습니다. 다시 시도해주세요.";
      setError(`리뷰 저장 실패: ${errorMsg}`);
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
                관리자 페이지에서 새로운 리뷰를 작성합니다
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
        
        {isLoading ? (
          <div className="container mx-auto px-4 py-10 max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
              <p className="text-gray-500">데이터베이스에 연결 중...</p>
            </div>
          </div>
        ) : (
          <ReviewForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        )}
      </main>
      <Footer />
    </div>
  );
} 