import Image from "next/image";

export function Features() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* 배경 장식 요소 */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-white"></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 leading-relaxed">
              중고차사이트<br />
              유튜브채널을 보시면서<br />
              원하는 차량을 찾고 계신가요?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-loose">
              이제 더 이상 찾아 헤매지 마시고<br />
              트루카에 주문하세요<br />
              <span className="text-blue-600 font-semibold">20년 경력의 트루카</span>가<br />
              내가 찾는 그 차량을 찾아 드립니다
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-xl transition-transform hover:scale-105 duration-300">
              <div className="mb-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">일단, 주문해 보세요</h3>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  전문 상담사가 내게 맞는 차량을<br />
                  찾아드립니다.<br />
                  특별한 요구사항도 정확하게 파악하여<br />
                  최적의 차량을 제안해 드립니다.
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex gap-2 items-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                  <p className="font-semibold text-base">상담사의 전문성</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 shadow-xl transition-transform hover:scale-105 duration-300">
              <div className="mb-6">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                    <path d="M12 2v20"></path>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7"></path>
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">어떤 비용도 들지 않습니다</h3>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  인터넷에서 보신 주소를<br />
                  복사해 넣으시기만 해도 됩니다.<br />
                  상담부터 차량 검색까지<br />
                  무료로 제공해 드립니다.
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex gap-2 items-center text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                  <p className="font-semibold text-base">무료 상담 서비스</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 