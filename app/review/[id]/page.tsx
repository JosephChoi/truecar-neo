import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ReviewDetail from "@/components/sections/ReviewDetail";
import { reviewData } from "@/lib/review-data";
import { notFound } from "next/navigation";

interface ReviewPageProps {
  params: {
    id: string;
  };
}

export default function ReviewDetailPage({ params }: ReviewPageProps) {
  // 실제 구현에서는 DB나 API에서 데이터를 가져오겠지만,
  // 여기서는 예시로 하드코딩된 데이터를 사용합니다.
  const review = reviewData.find(r => r.id === params.id);
  
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
          author={review.author}
          date={review.date}
          orderDetail={review.orderDetail}
          isAdmin={false} // 실제 구현에서는 세션을 통해 관리자 여부를 확인합니다
        />
      </main>
      <Footer />
    </div>
  );
} 