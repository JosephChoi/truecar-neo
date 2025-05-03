"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// 고객 후기 이미지 카드 데이터 구조
interface ReviewImage {
  id: string;
  imageUrl: string;
  title: string;
  aspectRatio: string;
  largeImage: boolean;
  isDefault: boolean; // 기본 이미지인지 여부
}

interface ReviewImageCardProps {
  id: string;
  imageUrl: string;
  title: string;
  isHovered: boolean;
  isDefault: boolean; // 기본 이미지인지 여부
  onHover: (isHovered: boolean) => void;
}

function ReviewImageCard({ id, imageUrl, title, isHovered, isDefault, onHover }: ReviewImageCardProps) {
  // 기본 이미지면 직접 a 태그 사용, 실제 리뷰면 Link 컴포넌트 사용
  if (isDefault) {
    return (
      <a 
        href="/review"
        className="block relative overflow-hidden rounded-lg shadow-md h-full"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
      >
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 flex items-end ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="p-4 md:p-6 text-white">
            <h3 className="text-lg md:text-xl font-bold">{title}</h3>
            <p className="text-sm mt-2 flex items-center">
              더 많은 후기 보기
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </p>
          </div>
        </div>
      </a>
    );
  }
  
  // 실제 리뷰 링크
  return (
    <Link 
      href={`/review/${id}`}
      className="block relative overflow-hidden rounded-lg shadow-md h-full"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <img 
        src={imageUrl} 
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
        style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
      />
      
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 flex items-end ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="p-4 md:p-6 text-white">
          <h3 className="text-lg md:text-xl font-bold">{title}</h3>
          <p className="text-sm mt-2 flex items-center">
            자세히 보기
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </p>
        </div>
      </div>
    </Link>
  );
}

export function Reviews() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [reviewImages, setReviewImages] = useState<ReviewImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Supabase에서 리뷰 데이터 가져오기
    const fetchReviews = async () => {
      console.log('Supabase에서 리뷰 데이터 불러오기 시도...');
      
      // 환경 변수 디버깅 - 값까지 일부 확인 (보안을 위해 전체 값은 출력하지 않음)
      console.log('환경 변수 체크:');
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      console.log('NEXT_PUBLIC_SUPABASE_URL:', url ? `${url.substring(0, 10)}...` : '설정되지 않음');
      console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', key ? `${key.substring(0, 5)}...` : '설정되지 않음');
      
      try {
        // 기본 이미지 미리 정의
        const defaultImages: ReviewImage[] = [
          {
            id: "default1",
            imageUrl: "https://cdn.imweb.me/thumbnail/20240407/bc0c4be6c9ec1.png",
            title: "안전한 중고차 거래, 큰 만족입니다",
            aspectRatio: "aspect-auto",
            largeImage: true,
            isDefault: true // 기본 이미지임을 표시
          },
          {
            id: "default2",
            imageUrl: "https://cdn.imweb.me/thumbnail/20240407/64e8e8a5e7a97.png",
            title: "미니쿠퍼 드디어 구매 완료!",
            aspectRatio: "aspect-auto",
            largeImage: false,
            isDefault: true // 기본 이미지임을 표시
          },
          {
            id: "default3",
            imageUrl: "https://cdn.imweb.me/thumbnail/20240407/dac9242bf16b4.png",
            title: "신차 같은 중고차 추천해주셔서 감사합니다",
            aspectRatio: "aspect-auto", 
            largeImage: false,
            isDefault: true // 기본 이미지임을 표시
          },
          {
            id: "default4",
            imageUrl: "https://cdn.imweb.me/thumbnail/20240407/69e5fa8471c01.png",
            title: "코다 SUV 구매 완료! 감사합니다",
            aspectRatio: "aspect-auto",
            largeImage: false,
            isDefault: true // 기본 이미지임을 표시
          }
        ];
        
        // Supabase 연결 상태 확인
        if (!supabase) {
          console.error('Supabase 클라이언트가 초기화되지 않았습니다.');
          setReviewImages(defaultImages);
          setLoading(false);
          return;
        }
        
        // 환경 변수가 없을 경우 기본 이미지 사용
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.warn('Supabase 환경 변수가 설정되지 않아 기본 이미지를 사용합니다.');
          setReviewImages(defaultImages);
          setLoading(false);
          return;
        }

        // Supabase 클라이언트 정보 디버깅
        console.log('Supabase 클라이언트 초기화됨:', !!supabase);
        
        // 요청 시도 전 로그
        console.log('리뷰 데이터 쿼리 시작...');
        
        // 요청 시도 (catch 블록으로 오류를 더 잘 포착하기 위해 타임아웃 추가)
        const fetchWithTimeout = async () => {
          const timeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Supabase 쿼리 타임아웃')), 5000);
          });
          
          const response = await Promise.race([
            supabase.from('reviews').select('*').order('created_at', { ascending: false }),
            timeout
          ]);
          
          return response as any;
        };
        
        const { data, error } = await fetchWithTimeout();
        
        // 명시적 에러 로깅
        if (error) {
          console.error('Supabase 쿼리 에러:', error.message);
          console.error('에러 세부 정보:', {
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          throw new Error(`리뷰 데이터를 불러오지 못했습니다: ${error.message}`);
        }
        
        // 데이터 확인
        console.log('리뷰 데이터 응답:', data);
        console.log('리뷰 데이터 로드 성공:', data?.length || 0, '개 항목');
        
        // 이미지가 있는 리뷰만 필터링
        const reviewsWithImages = (data || [])
          .filter(review => review.image_url)
          .map(review => ({
            id: review.id,
            imageUrl: review.image_url || '',
            title: review.title,
            aspectRatio: "aspect-auto",
            largeImage: false,
            isDefault: false // 실제 리뷰는 기본 이미지가 아님
          }));
        
        // 실제 리뷰 이미지 + 필요한 만큼의 기본 이미지
        const finalImages = reviewsWithImages.length >= 4 
          ? reviewsWithImages.slice(0, 4) 
          : [...reviewsWithImages, ...defaultImages.slice(0, 4 - reviewsWithImages.length)];
        
        // 첫 번째 이미지는 largeImage로 설정
        if (finalImages.length > 0) {
          finalImages[0].largeImage = true;
        }
        
        setReviewImages(finalImages);
        setLoading(false);
      } catch (err: any) {
        console.error('리뷰 데이터 로드 실패:', err);
        console.error('오류 세부 정보:', err.stack || '스택 정보 없음');
        
        console.log('기본 이미지로 대체합니다.');
        // 에러 발생 시 기본 이미지로 대체
        const defaultImages: ReviewImage[] = [
          {
            id: "default1",
            imageUrl: "https://cdn.imweb.me/thumbnail/20240407/bc0c4be6c9ec1.png",
            title: "안전한 중고차 거래, 큰 만족입니다",
            aspectRatio: "aspect-auto",
            largeImage: true,
            isDefault: true // 기본 이미지임을 표시
          },
          {
            id: "default2",
            imageUrl: "https://cdn.imweb.me/thumbnail/20240407/64e8e8a5e7a97.png",
            title: "미니쿠퍼 드디어 구매 완료!",
            aspectRatio: "aspect-auto",
            largeImage: false,
            isDefault: true // 기본 이미지임을 표시
          },
          {
            id: "default3",
            imageUrl: "https://cdn.imweb.me/thumbnail/20240407/dac9242bf16b4.png",
            title: "신차 같은 중고차 추천해주셔서 감사합니다",
            aspectRatio: "aspect-auto",
            largeImage: false,
            isDefault: true // 기본 이미지임을 표시
          },
          {
            id: "default4",
            imageUrl: "https://cdn.imweb.me/thumbnail/20240407/69e5fa8471c01.png",
            title: "코다 SUV 구매 완료! 감사합니다",
            aspectRatio: "aspect-auto",
            largeImage: false,
            isDefault: true // 기본 이미지임을 표시
          }
        ];
        
        setReviewImages(defaultImages);
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-1 rounded-full text-blue-700 bg-blue-100 text-sm font-medium mb-4">
                TESTIMONIALS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Thanks For TrueCar
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                트루카 맞춤 중고차를 이용한 고객분들의 생생한 후기 입니다
              </p>
            </div>
            
            <div className="text-center py-12">
              <p className="text-gray-500">후기를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full text-blue-700 bg-blue-100 text-sm font-medium mb-4">
              TESTIMONIALS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Thanks For TrueCar
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              트루카 맞춤 중고차를 이용한 고객분들의 생생한 후기 입니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* 왼쪽 큰 이미지 */}
            <div className="h-[580px]">
              <ReviewImageCard
                id={reviewImages[0].id}
                imageUrl={reviewImages[0].imageUrl}
                title={reviewImages[0].title}
                isHovered={hoveredIndex === 0}
                isDefault={reviewImages[0].isDefault}
                onHover={(isHovered) => setHoveredIndex(isHovered ? 0 : null)}
              />
            </div>
            
            {/* 오른쪽 상단 이미지와 하단 이미지들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[580px]">
              <div className="h-[280px]">
                <ReviewImageCard
                  id={reviewImages[1].id}
                  imageUrl={reviewImages[1].imageUrl}
                  title={reviewImages[1].title}
                  isHovered={hoveredIndex === 1}
                  isDefault={reviewImages[1].isDefault}
                  onHover={(isHovered) => setHoveredIndex(isHovered ? 1 : null)}
                />
              </div>
              <div className="h-[280px]">
                <ReviewImageCard
                  id={reviewImages[2].id}
                  imageUrl={reviewImages[2].imageUrl}
                  title={reviewImages[2].title}
                  isHovered={hoveredIndex === 2}
                  isDefault={reviewImages[2].isDefault}
                  onHover={(isHovered) => setHoveredIndex(isHovered ? 2 : null)}
                />
              </div>
              <div className="md:col-span-2 h-[280px]">
                <ReviewImageCard
                  id={reviewImages[3].id}
                  imageUrl={reviewImages[3].imageUrl}
                  title={reviewImages[3].title}
                  isHovered={hoveredIndex === 3}
                  isDefault={reviewImages[3].isDefault}
                  onHover={(isHovered) => setHoveredIndex(isHovered ? 3 : null)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link 
              href="/review" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              모든 후기 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 