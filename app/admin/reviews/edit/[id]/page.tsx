"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ReviewForm from "@/components/admin/ReviewForm";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { FirebaseAuthService } from '@/lib/firebase-auth-utils';
import { AdminUserService, ReviewService } from '@/lib/firestore-utils';
import { FirebaseStorageService } from '@/lib/firebase-storage-utils';

// Next.js 15 App Router에 맞게 Props 타입 정의
interface EditReviewPageProps {
  params: {
    id: string;
  };
}

export default function EditReviewPage({ params }: EditReviewPageProps) {
  // 직접 params 사용 - use 함수 없이
  const reviewId = params.id;
  
  const router = useRouter();
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;
    
    // Firebase에서 리뷰 데이터 가져오기
    const fetchReview = async () => {
      try {
        setLoading(true);
        
        // 먼저 관리자 권한 확인
        const currentUser = FirebaseAuthService.getCurrentUser();
        
        if (!currentUser || !currentUser.email) {
          // 로그인되지 않은 경우 로그인 페이지로 리디렉션
          console.log('세션 없음: 로그인 페이지로 이동');
          router.replace('/admin/login');
          return;
        }
        
        // 관리자 권한 확인
        const isAdmin = await AdminUserService.isAdmin(currentUser.email);
          
        if (!isAdmin) {
          // 관리자가 아닌 경우 로그인 페이지로 리디렉션
          console.error('관리자 권한 없음');
          await FirebaseAuthService.signOut();
          router.replace('/admin/login?unauthorized=true');
          return;
        }
        
        const data = await ReviewService.getReviewById(reviewId);
        
        if (!data) {
          throw new Error('리뷰를 찾을 수 없습니다.');
        }
        
        // ReviewForm 컴포넌트에 맞게 데이터 형식을 변환합니다.
        setReview({
          title: data.title || "",
          content: data.content || "",
          author: data.author || "",
          date: data.date || (data.created_at && typeof data.created_at === 'object' && 'toDate' in data.created_at 
            ? data.created_at.toDate().toISOString().slice(0, 10) 
            : new Date().toISOString().split('T')[0]),
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
      
      // 새로운 이미지가 업로드된 경우 Firebase Storage에 저장
      if (data.imageUrl && data.imageUrl.startsWith('data:image/')) {
        try {
          imageUrl = await FirebaseStorageService.uploadBase64Image(
            data.imageUrl,
            `reviews/review-edit-${reviewId}-${Date.now()}.jpg`
          );
          console.log('이미지 업로드 성공:', imageUrl);
        } catch (imageError: any) {
          console.error('이미지 업로드 실패:', imageError);
          // 이미지 업로드 실패 시에도 리뷰는 저장하되 기존 이미지 URL 유지
        }
      }
      
      // 리뷰 데이터 구성
      const reviewData = {
        title: data.title,
        content: data.content,
        author: data.author,
        date: data.date,
        image_url: imageUrl,
        vehicle_type: data.orderDetail.vehicleType,
        budget: data.orderDetail.budget,
        mileage: data.orderDetail.mileage,
        preferred_color: data.orderDetail.preferredColor,
        repair_history: data.orderDetail.repairHistory,
        reference_site: data.orderDetail.referenceSite
      };
      
      console.log("리뷰 업데이트 데이터:", reviewData);
      
      // Firebase에 리뷰 업데이트
      await ReviewService.updateReview(reviewId, reviewData);
      
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