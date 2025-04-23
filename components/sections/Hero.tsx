"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      console.log('Video element not found');
      return;
    }

    console.log('Video element found:', videoElement);

    // 필요한 속성 설정
    videoElement.playsInline = true;
    videoElement.muted = true;
    videoElement.autoplay = true;
    videoElement.loop = true;
    
    const handleCanPlay = () => {
      console.log('Video can play event fired');
      setVideoLoaded(true);
      
      videoElement.play()
        .then(() => console.log('Video started playing successfully'))
        .catch(error => {
          console.error('Autoplay prevented:', error);
          setVideoError('자동 재생이 차단되었습니다: ' + error.message);
        });
    };

    const handleError = (e: any) => {
      console.error('Video error event fired:', e);
      const videoElement = e.target as HTMLVideoElement;
      setVideoError(`비디오 오류: ${videoElement.error?.message || '알 수 없는 오류'}`);
    };

    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('error', handleError);
    
    const attemptPlay = () => {
      if (videoElement && videoElement.paused) {
        videoElement.play()
          .catch(e => console.error('Video play failed after user interaction:', e));
      }
    };
    
    document.addEventListener('click', attemptPlay);
    document.addEventListener('touchstart', attemptPlay);

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('error', handleError);
      }
      document.removeEventListener('click', attemptPlay);
      document.removeEventListener('touchstart', attemptPlay);
    };
  }, []);

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* 비디오 배경 */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{ opacity: 0.8 }}
        >
          <source src="/videos/truecar-background.mp4" type="video/mp4" />
        </video>
        
        {/* 비디오 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60"></div>
      </div>
      
      {/* 디버깅 정보 (개발 중에만 표시) */}
      {videoError && (
        <div className="absolute top-4 left-4 bg-red-600 text-white p-2 z-50 rounded text-sm">
          {videoError}
        </div>
      )}
      
      {/* 히어로 콘텐츠 */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 w-full">
          {/* 좌측 메인 콘텐츠 */}
          <div className="max-w-2xl space-y-4 flex flex-col justify-center">
            <div className="inline-flex px-3 py-1 rounded-full text-yellow-400 bg-yellow-900/30 text-sm font-medium backdrop-blur-sm w-fit">
              중고차를 사는 새로운 방법
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              트루카 <span className="text-yellow-400">주문형</span> 중고차
            </h1>
            <p className="text-lg md:text-xl text-white max-w-2xl">
              맞춤형 주문으로 허위매물 없는 거래<br />
              성능 보증을 통한 확실한 차량
            </p>
            
            {/* 핵심 서비스 특징 아이템 */}
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-yellow-400/20 rounded-full p-1 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                    <path d="m5 12 5 5L20 7"></path>
                  </svg>
                </div>
                <p className="text-base md:text-lg text-gray-200">
                  <span className="font-medium text-white">20년 경력의 전문가</span>가 내게 딱 맞는 차량을 찾아드립니다
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-yellow-400/20 rounded-full p-1 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                    <path d="m5 12 5 5L20 7"></path>
                  </svg>
                </div>
                <p className="text-base md:text-lg text-gray-200">
                  딜러를 통하지 않는 <span className="font-medium text-white">본사 직접 거래</span>로 최저가 구매
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-yellow-400/20 rounded-full p-1 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                    <path d="m5 12 5 5L20 7"></path>
                  </svg>
                </div>
                <p className="text-base md:text-lg text-gray-200">
                  <span className="font-medium text-white">전문적인 점검과 성능 보증</span>으로 안심 구매
                </p>
              </div>
            </div>
            
            {/* CTA 버튼 */}
            <div className="flex flex-wrap pt-6 mt-2">
              <Button asChild size="lg" className="text-base px-8 py-5 h-auto rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors shadow-lg hover:shadow-xl text-black font-semibold">
                <Link href="/order">
                  맞춤 중고차 주문하기
                </Link>
              </Button>
            </div>
          </div>
          
          {/* 우측 신뢰도 지표 카드 (모바일에서는 숨김) */}
          <div className="hidden md:flex items-center justify-center">
            <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-2xl max-w-md transform hover:scale-105 transition-all">
              <h3 className="text-white text-xl font-bold mb-5">
                트루카의 차별점
              </h3>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="font-medium text-white text-2xl mb-1">20년+</div>
                  <p className="text-gray-300 text-sm">업계 경력</p>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="font-medium text-white text-2xl mb-1">4000+</div>
                  <p className="text-gray-300 text-sm">거래 완료</p>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="font-medium text-white text-2xl mb-1">0건</div>
                  <p className="text-gray-300 text-sm">클레임</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 스크롤 다운 인디케이터 */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <p className="text-white text-xs mb-1 opacity-70">스크롤을 내려 더 알아보세요</p>
        <div className="w-5 h-8 border-2 border-white/50 rounded-full flex justify-center p-1">
          <div className="w-1 h-1.5 bg-white/70 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
} 