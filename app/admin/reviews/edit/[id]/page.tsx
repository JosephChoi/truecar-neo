"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ReviewForm from "@/components/admin/ReviewForm";
import { useRouter } from "next/navigation";
import { reviewData } from "@/lib/review-data";
import { notFound } from "next/navigation";

interface EditReviewPageProps {
  params: {
    id: string;
  };
}

export default function EditReviewPage({ params }: EditReviewPageProps) {
  const router = useRouter();
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제 구현에서는 API 호출을 통해 데이터를 가져옵니다.
    const foundReview = reviewData.find(r => r.id === params.id);
    
    if (foundReview) {
      // ReviewForm 컴포넌트에 맞게 데이터 형식을 변환합니다.
      setReview({
        title: foundReview.title,
        content: foundReview.content,
        author: foundReview.author,
        date: foundReview.date,
        hasOrderDetail: !!foundReview.orderDetail,
        orderDetail: foundReview.orderDetail
      });
    }
    
    setLoading(false);
  }, [params.id]);

  const handleSubmit = (data: any) => {
    // 실제 구현에서는 API 호출을 통해 데이터를 업데이트합니다.
    console.log("리뷰 수정:", params.id, data);
    
    // 저장 후 관리 페이지로 이동
    router.push("/admin/reviews");
  };

  const handleCancel = () => {
    router.push("/admin/reviews");
  };

  if (!loading && !review) {
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
                리뷰 #{params.id}을 수정합니다
              </p>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="container mx-auto px-4 py-10 max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          </div>
        ) : (
          <ReviewForm
            initialData={review}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </main>
      <Footer />
    </div>
  );
} 