import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-gray-50 overflow-hidden relative">
      {/* 배경 장식 요소 */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              트루카 <span className="text-blue-600">주문형</span> 중고차
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 font-light">
              중고차를 사는 새로운 방법<br />
              트루카 주문형 중고차
            </p>
            <div className="space-y-4 md:space-y-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="m5 12 5 5L20 7"></path>
                  </svg>
                </div>
                <p className="text-lg text-gray-700">
                  맞춤형 주문으로 허위매물 없는 거래
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="m5 12 5 5L20 7"></path>
                  </svg>
                </div>
                <p className="text-lg text-gray-700">
                  딜러를 통하지 않는 본사 직접 거래로 최저가 거래
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="m5 12 5 5L20 7"></path>
                  </svg>
                </div>
                <p className="text-lg text-gray-700">
                  성능 보증을 통한 확실한 차량
                </p>
              </div>
            </div>
            
            <div className="mt-10">
              <Button asChild size="lg" className="text-lg px-10 py-6 h-auto rounded-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                <Link href="/order">
                  맞춤 중고차 상담하기
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            {/* 차량 이미지 */}
            <div className="relative w-full h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-lg text-white">고급 중고차 이미지</p>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-yellow-300 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 