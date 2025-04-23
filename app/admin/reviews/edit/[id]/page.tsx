"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ReviewForm from "@/components/admin/ReviewForm";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { getReviewById, updateReview, initializeReviews } from "@/lib/storage-utils";

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

  // 안전하게 클라이언트 사이드에서 데이터 로드
  const safelyLoadReview = () => {
    try {
      // localStorage 초기화
      initializeReviews();
      
      // ID 유효성 검증 - 숫자인지 확인
      if (isNaN(Number(reviewId))) {
        setError("유효하지 않은 리뷰 ID입니다.");
        setLoading(false);
        return;
      }
      
      // 로컬스토리지에서 리뷰 데이터 가져오기
      const foundReview = getReviewById(reviewId);
      
      if (foundReview) {
        // ReviewForm 컴포넌트에 맞게 데이터 형식을 변환합니다.
        setReview({
          title: foundReview.title || "",
          content: foundReview.content || "",
          author: foundReview.author || "",
          date: foundReview.date || new Date().toISOString().split('T')[0],
          imageUrl: foundReview.imageUrl || "",
          orderDetail: foundReview.orderDetail || {
            vehicleType: "",
            budget: "",
            mileage: "",
            preferredColor: "",
            repairHistory: "",
            referenceSite: ""
          }
        });
      } else {
        setError("리뷰를 찾을 수 없습니다.");
      }
      
      setLoading(false);
    } catch (err) {
      console.error("리뷰 로드 중 오류:", err);
      setError("리뷰 데이터를 불러오는 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;
    
    // 브라우저 환경에서 실행될 때만 로컬스토리지 접근
    safelyLoadReview();
  }, [reviewId]);

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 이미지 URL 길이 체크
      if (data.imageUrl && data.imageUrl.length > 1024 * 1024) { // 1MB 이상
        setError("이미지 크기가 너무 큽니다. 다른 이미지를 사용하거나 품질을 더 낮추어 시도해보세요.");
        setIsSubmitting(false);
        return;
      }
      
      // 리뷰 데이터 형식 변환
      const reviewToUpdate = {
        title: data.title,
        content: data.content,
        author: data.author,
        date: data.date,
        imageUrl: data.imageUrl,
        orderDetail: {
          vehicleType: data.orderDetail.vehicleType || "",
          budget: data.orderDetail.budget || "",
          mileage: data.orderDetail.mileage || "",
          preferredColor: data.orderDetail.preferredColor || "",
          repairHistory: data.orderDetail.repairHistory || "",
          referenceSite: data.orderDetail.referenceSite || ""
        }
      };
      
      console.log("리뷰 업데이트 데이터:", reviewToUpdate);
      
      // 로컬 스토리지에서 리뷰 업데이트
      const result = updateReview(reviewId, reviewToUpdate);
      
      if (!result) {
        throw new Error("리뷰 수정에 실패했습니다.");
      }
      
      // 저장 후 관리 페이지로 이동
      router.push("/admin/reviews");
    } catch (error) {
      console.error("리뷰 수정 중 오류:", error);
      setError(typeof error === 'object' && error !== null && 'message' in error 
        ? (error as Error).message 
        : "리뷰 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
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