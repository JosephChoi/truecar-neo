"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ReviewForm from "@/components/admin/ReviewForm";
import { useRouter } from "next/navigation";
import { addReview, initializeReviews, getLocalStorageSize } from "@/lib/storage-utils";

export default function NewReviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [storageInfo, setStorageInfo] = useState<{size: number, available: boolean}>({ 
    size: 0, 
    available: true 
  });

  // 로컬스토리지 초기화
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined') {
      try {
        initializeReviews();
        
        // 로컬스토리지 사용량 확인
        const sizeInKB = getLocalStorageSize();
        const isStorageAvailable = sizeInKB < 4000; // 4MB 이하 여유 공간 확인
        
        setStorageInfo({
          size: Math.round(sizeInKB), 
          available: isStorageAvailable
        });
        
        setIsInitialized(true);
      } catch (error) {
        console.error("초기화 오류:", error);
        setError("로컬스토리지 초기화 중 오류가 발생했습니다.");
      }
    }
  }, []);

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // 로컬 스토리지에 리뷰 추가
    try {
      // 필요한 경우 초기화
      initializeReviews();
      
      // 리뷰 데이터 준비 (id 추가)
      const review = {
        ...data,
        id: Date.now().toString(),
      };
      
      // 리뷰 저장
      addReview(review);
      
      // 저장 후 리뷰 목록 페이지로 이동
      router.push('/admin/reviews');
    } catch (error) {
      console.error("리뷰 저장 실패:", error);
      setError("리뷰를 저장하는 데 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
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
        
        {/* 스토리지 상태 경고 */}
        {isInitialized && !storageInfo.available && (
          <div className="container mx-auto px-4 py-4 max-w-4xl">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>로컬스토리지 공간 부족 경고</strong> - 현재 사용량: {storageInfo.size}KB/5120KB
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    새 리뷰 저장이 실패할 수 있습니다. 관리 페이지에서 이전 리뷰를 일부 삭제하거나 이미지 크기를 최소화하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
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
        
        {!isInitialized ? (
          <div className="container mx-auto px-4 py-10 max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
              <p className="text-gray-500">데이터를 초기화하는 중...</p>
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