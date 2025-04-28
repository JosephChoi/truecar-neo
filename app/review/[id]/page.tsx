"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ReviewDetail from "@/components/sections/ReviewDetail";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface ReviewPageProps {
  params: {
    id: string;
  };
}

export default function ReviewDetailPage({ params }: ReviewPageProps) {
  // React.use로 params를 언래핑
  const unwrappedParams = use(params as any) as { id: string };
  const reviewId = unwrappedParams.id;
  
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;
    
    // 안전하게 데이터 로드
    const loadReviewData = async () => {
      try {
        // Supabase에서 리뷰 데이터 가져오기
        const { data, error: fetchError } = await supabase
          .from('reviews')
          .select('*')
          .eq('id', reviewId)
          .single();
        
        if (fetchError) {
          throw new Error('리뷰를 찾을 수 없습니다.');
        }
        
        if (data) {
          setReview(data);
          
          // 조회수 업데이트 
          const { error: updateError } = await supabase
            .from('reviews')
            .update({ 
              views: (data.views || 0) + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', reviewId);
          
          if (updateError) {
            console.error('조회수 업데이트 실패:', updateError);
          } else {
            // 조회수가 성공적으로 업데이트되면 로컬 상태도 업데이트
            setReview({
              ...data,
              views: (data.views || 0) + 1
            });
          }
        } else {
          setError("요청하신 리뷰를 찾을 수 없습니다.");
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error("리뷰 로드 중 오류:", err);
        setError(err.message || "리뷰 데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };
    
    loadReviewData();
  }, [reviewId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-10">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-500">리뷰를 불러오는 중...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-10">
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-red-700 mb-4">오류가 발생했습니다</h2>
                <p className="text-gray-700">{error}</p>
                <div className="mt-6">
                  <a 
                    href="/review" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    리뷰 목록으로 돌아가기
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!review) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-10 bg-gradient-to-br from-blue-50 to-gray-50 relative overflow-hidden">
          {/* 배경 장식 요소 */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-1 rounded-full text-blue-700 bg-blue-100 text-sm font-medium mb-4">
                REVIEW DETAIL
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                고객 후기 상세보기
              </h1>
              <p className="text-lg text-gray-700">
                트루카 고객님의 생생한 후기입니다
              </p>
            </div>
          </div>
        </section>
        
        <ReviewDetail
          id={review.id}
          title={review.title}
          content={review.content}
          author={review.author || "익명"}
          date={review.date || new Date(review.created_at).toLocaleDateString()}
          views={review.views || 0}
          imageUrl={review.image_url || review.imageUrl}
          orderDetail={{
            vehicleType: review.vehicle_type || "",
            budget: review.budget || "",
            mileage: review.mileage || "",
            preferredColor: review.preferred_color || "",
            repairHistory: review.repair_history || "",
            referenceSite: review.reference_site || "",
          }}
          isAdmin={false}
        />
      </main>
      <Footer />
    </div>
  );
} 