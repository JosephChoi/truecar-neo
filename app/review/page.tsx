"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ReviewService } from '@/lib/firestore-utils';

function ReviewCard({ review }: { review: any }) {
  // 이미지 URL 결정 (리뷰 직접 이미지 또는 주문 내역 이미지)
  const displayImageUrl = review.image_url || review.imageUrl || '/images/default-car.jpg';

  const formatViews = (views: number) => {
    return views.toLocaleString();
  };

  return (
    <Link href={`/review/${review.id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
          <Image
            src={displayImageUrl}
                alt={review.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              console.log('Image load error for:', displayImageUrl);
              const target = e.target as HTMLImageElement;
              target.src = '/images/default-car.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
        <div className="flex flex-col flex-grow">
          <CardContent className="p-4 sm:p-5 flex flex-col flex-grow">
            {review.vehicle_type && (
              <div className="mb-3">
                <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                  {review.vehicle_type}
                </span>
              </div>
            )}
            
            <h2 className="subheading-mobile-friendly font-bold mb-4 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">{review.title}</h2>
            
            <div className="flex items-center justify-between mt-auto text-sm text-gray-500">
              <div className="flex items-center">
                <span className="font-medium">{review.author || '익명'}</span>
                <span className="mx-2">•</span>
                <span>{review.date || new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              
              {/* 하단 조회수 */}
              <div className="flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                {formatViews(review.views || 0)}
              </div>
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // Firebase에서 리뷰 데이터 가져오기
        const result = await ReviewService.getAllReviews();
        const data = result.reviews;

        setReviews(data || []);
        setError(null);
      } catch (err: any) {
        // 예외 상세 출력
        console.error('리뷰 불러오기 예외:', err);
        setError('리뷰 데이터를 불러오는 중 오류가 발생했습니다.');
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
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
              <div className="inline-block px-4 py-2 rounded-full text-blue-700 bg-blue-100 text-sm font-medium mb-6">
                REVIEWS
              </div>
              <h1 className="heading-mobile-friendly text-gray-900 mb-6">
                고객 후기
              </h1>
              <p className="subheading-mobile-friendly text-gray-700 max-w-3xl mx-auto leading-relaxed">
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
              ) : error ? (
                <div className="text-center py-6 mb-8">
                  <p className="text-orange-500 mb-2">{error}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
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