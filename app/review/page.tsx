import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { reviewData } from "@/lib/review-data";
import Link from "next/link";
import Image from "next/image";

function ReviewCard({ review }: { review: any }) {
  // 미리보기용 내용 추출 (150자 제한)
  const previewContent = review.content.length > 150 
    ? review.content.substring(0, 150) + "..." 
    : review.content;

  return (
    <Link href={`/review/${review.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {review.orderDetail?.imageUrl && (
            <div className="relative h-48 md:h-auto">
              <img 
                src={review.orderDetail.imageUrl} 
                alt={review.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          
          <CardContent className={`p-6 ${review.orderDetail?.imageUrl ? 'md:col-span-2' : 'md:col-span-3'}`}>
            <h2 className="text-xl font-bold mb-2 text-gray-900">{review.title}</h2>
            
            <div className="flex items-center mb-4 text-sm text-gray-500">
              <span>{review.author}</span>
              <span className="mx-2">•</span>
              <span>{review.date}</span>
              <span className="mx-2">•</span>
              <span>조회 {review.views}</span>
            </div>
            
            <p className="text-gray-700 mb-4">{previewContent}</p>
            
            {review.orderDetail && (
              <div className="flex items-center mt-4 text-sm text-gray-500">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {review.orderDetail.vehicleType}
                </span>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

export default function ReviewPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-br from-blue-50 to-gray-50 relative overflow-hidden">
          {/* 배경 장식 요소 */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-1 rounded-full text-blue-700 bg-blue-100 text-sm font-medium mb-6">
                REVIEWS
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                고객 후기
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                트루카 서비스를 이용한 고객님들의 생생한 후기를 확인해보세요
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="space-y-6">
                {reviewData.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                이런 분들이 트루카를 추천합니다
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <circle cx="12" cy="8" r="5"></circle>
                      <path d="M20 21a8 8 0 0 0-16 0"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">중고차 초보 구매자</h3>
                  <p className="text-gray-700">
                    중고차 구매가 처음이라 어떻게 시작해야 할지 모르는 분들에게 완벽한 서비스입니다.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">바쁜 직장인</h3>
                  <p className="text-gray-700">
                    직접 중고차를 찾아다닐 시간이 없는 바쁜 직장인들에게 시간을 절약해주는 서비스입니다.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <path d="M2 12h20"></path>
                      <path d="M12 2v20"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">특별한 요구사항</h3>
                  <p className="text-gray-700">
                    특정 모델, 옵션, 조건의 중고차를 찾고 계신 분들에게 맞춤형 솔루션을 제공합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 