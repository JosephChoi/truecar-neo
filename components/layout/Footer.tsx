import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">TrueCar</h3>
              <p className="text-mobile-friendly text-gray-300 leading-relaxed max-w-md">
                20년 경력의 중고차 전문가가 제공하는 맞춤형 중고차 서비스입니다. 
                허위매물 없는 정직한 거래로 고객 만족을 약속드립니다.
            </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:gap-6 gap-1">
              <div className="flex items-center space-x-2">
                <div className="bg-purple-600 p-1.5 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                    <path d="m3.3 7 8.7 5 8.7-5"></path>
                    <path d="M12 22V12"></path>
                </svg>
                </div>
                <span className="text-sm sm:text-base text-gray-300 font-medium">맞춤형 중고차</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                </svg>
                </div>
                <span className="text-sm sm:text-base text-gray-300 font-medium">20년+ 업계 경력</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="bg-green-600 p-1.5 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.07.74 5.6 1.97"></path>
                </svg>
                </div>
                <span className="text-sm sm:text-base text-gray-300 font-medium">0건 클레임</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-4">서비스</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/order" className="text-base hover:text-white transition-colors font-medium">
                  맞춤 중고차 주문
                </Link>
              </li>
              <li>
                <Link href="/review" className="text-base hover:text-white transition-colors font-medium">
                  고객 후기
                </Link>
              </li>
              <li>
                <Link href="/story" className="text-base hover:text-white transition-colors font-medium">
                  회사 소개
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-base hover:text-white transition-colors font-medium">
                  블로그
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-4">연락처</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0 text-blue-400">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="text-base leading-relaxed">인천광역시 서구 봉수대로 158 S동 104동</span>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0 text-green-400">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span className="text-base">010-2603-6885</span>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0 text-yellow-400">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span className="text-base">turecar2023@naver.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2024 TrueCar. All rights reserved. | 
            <Link href="/privacy" className="hover:text-white transition-colors ml-1">개인정보처리방침</Link>
          </p>
        </div>
      </div>
    </footer>
  );
} 