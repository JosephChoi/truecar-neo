"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { getAllReviews, initializeReviews } from "@/lib/storage-utils";

function ReviewCard({ review }: { review: any }) {
  // 이미지 URL 결정 (리뷰 직접 이미지 또는 주문 내역 이미지)
  const imageUrl = review.imageUrl || (review.orderDetail?.imageUrl);

  return (
    <Link href={`/review/${review.id}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
        <div className="flex flex-col h-full">
          {/* 이미지 영역 */}
          <div className="relative aspect-[4/3] overflow-hidden w-full">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={review.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
              </div>
            )}
          </div>
          
          {/* 콘텐츠 영역 */}
          <CardContent className="p-4 flex flex-col flex-grow">
            {review.orderDetail && (
              <div className="mb-2">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {review.orderDetail.vehicleType}
                </span>
              </div>
            )}
            
            <h2 className="text-lg font-bold mb-3 line-clamp-2 text-gray-900">{review.title}</h2>
            
            <div className="flex items-center mt-auto text-xs text-gray-500">
              <span>{review.author}</span>
              <span className="mx-2">•</span>
              <span>{review.date}</span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage 초기화 (최초 접근 시 기본 데이터 설정)
    initializeReviews();
    
    // 리뷰 데이터 로드
    const loadedReviews = getAllReviews();
    setReviews(loadedReviews);
    setLoading(false);
  }, []);

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
            <div className="max-w-6xl mx-auto">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">리뷰를 불러오는 중...</p>
                </div>
              ) : reviews.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">등록된 리뷰가 없습니다.</p>
                </div>
              )}
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