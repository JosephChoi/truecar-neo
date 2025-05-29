"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ReviewDetail from "@/components/sections/ReviewDetail";
import { notFound, useRouter } from "next/navigation";
import { ReviewService } from '@/lib/firestore-utils';

interface ReviewPageProps {
  params: {
    id: string;
  };
}

export default function ReviewDetailPage({ params }: ReviewPageProps) {
  // React.use로 params를 언래핑
  const unwrappedParams = use(params as any) as { id: string };
  const reviewId = unwrappedParams.id;
  const router = useRouter();
  
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;
    
    // reviewId 검증 - default ID라면 기본 데이터 표시
    if (reviewId.startsWith('default')) {
      console.log('기본 리뷰 ID 감지:', reviewId);
      const mockReviewId = reviewId.toLowerCase();
      
      // 기본 리뷰 데이터 설정
      if (mockReviewId === 'default1') {
        setReview({
          id: 'default1',
          title: '안전한 중고차 거래, 큰 만족입니다',
          content: '처음으로 중고차를 구매했는데, 트루카를 통해 안전하게 거래할 수 있어서 좋았습니다. 차량 상태도 설명 그대로였고, 사후 관리도 철저해요.\n\n특히 매니저님의 친절한 안내가 인상적이었습니다. 다른 중고차 사이트에서는 느낄 수 없었던 신뢰감을 주셔서 감사합니다. 다음에도 차량 구매 시 트루카를 이용할 생각입니다.',
          author: '김고객',
          date: '2025-04-10',
          created_at: '2025-04-10T14:30:00',
          image_url: 'https://cdn.imweb.me/thumbnail/20240407/bc0c4be6c9ec1.png',
          vehicle_type: 'SUV',
          budget: '3,000만원',
          mileage: '30,000km 이하',
          preferred_color: '검정색, 흰색',
          repair_history: '무사고',
          reference_site: '카즈',
          views: 120
        });
      } else if (mockReviewId === 'default2') {
        setReview({
          id: 'default2',
          title: '미니쿠퍼 드디어 구매 완료!',
          content: '오랫동안 원했던 미니쿠퍼를 트루카를 통해 구매했어요. 상담사분이 제 예산과 조건에 맞는 차량을 찾아주셔서 너무 감사했습니다.\n\n여러 중고차 사이트를 돌아다녔지만, 트루카에서 제공해준 정보가 가장 정확하고 믿을 수 있었어요. 특히 차량 상태 점검이 꼼꼼하게 이루어져서 안심하고 구매할 수 있었습니다.',
          author: '이미니',
          date: '2025-04-05',
          created_at: '2025-04-05T09:15:00',
          image_url: 'https://cdn.imweb.me/thumbnail/20240407/64e8e8a5e7a97.png',
          vehicle_type: '승용차',
          budget: '2,500만원',
          mileage: '20,000km 이하',
          preferred_color: '블루, 레드',
          repair_history: '경미한 수리이력 1회',
          reference_site: '엔카',
          views: 85
        });
      } else if (mockReviewId === 'default3') {
        setReview({
          id: 'default3',
          title: '신차 같은 중고차 추천해주셔서 감사합니다',
          content: '거의 신차 수준의 중고차를 구할 수 있어서 너무 만족스러웠습니다. 가격도 합리적이고 상태도 완벽했어요. 앞으로 주변에 많이 추천하겠습니다.\n\n특히 다른 중고차 사이트에서는 찾기 힘든 모델이었는데, 트루카에서 딱 제가 원하는 옵션과 상태의 차량을 찾아주셔서 정말 감사합니다. 가격 협상도 합리적으로 도와주셔서 만족스러운 거래였습니다.',
          author: '박만족',
          date: '2025-03-28',
          created_at: '2025-03-28T18:45:00',
          image_url: 'https://cdn.imweb.me/thumbnail/20240407/dac9242bf16b4.png',
          vehicle_type: '세단',
          budget: '3,500만원',
          mileage: '10,000km 이하',
          preferred_color: '그레이',
          repair_history: '무사고',
          reference_site: '현대 인증중고차',
          views: 95
        });
      } else {
        // 알 수 없는 기본 ID인 경우 리스트로 리디렉션
        router.push('/review');
        return;
      }
      
      // 로딩 완료
      setLoading(false);
      return;
    }
    
    if (!reviewId) {
      console.error('잘못된 리뷰 ID: 빈 문자열');
      setError(`유효하지 않은 리뷰 ID입니다`);
      setLoading(false);
      return;
    }
    
    console.log('리뷰 데이터 로드 시도, ID:', reviewId);
    
    const loadReviewData = async () => {
      try {
        // 1. 리뷰 데이터 조회
        const data = await ReviewService.getReviewById(reviewId);

        if (!data) {
          setError('리뷰를 찾을 수 없습니다.');
          setLoading(false);
          return;
        }

        setReview(data);

        // 2. 조회수 증가: 엣지 펑션 호출
        await ReviewService.incrementViews(reviewId);

        setLoading(false);
      } catch (err: any) {
        setError('리뷰 데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };
    
    loadReviewData();
  }, [reviewId, router]);

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