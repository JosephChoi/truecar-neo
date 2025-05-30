import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrderForm } from "@/components/sections/OrderForm";

export default function OrderPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-br from-blue-50 to-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="heading-mobile-friendly text-gray-900 mb-6">
                맞춤 중고차 주문하기
              </h1>
              <p className="subheading-mobile-friendly text-gray-700 leading-relaxed">
                지금 찾고 있는 중고차를 주문해 보세요.<br />
                트루카에서 허위매물 없는 최적의 차량을 찾아드립니다.
              </p>
            </div>
          </div>
        </section>
        
        <OrderForm />
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                <h2 className="subheading-mobile-friendly text-gray-900 mb-6">
                  트루카 주문 서비스 이용 안내
                </h2>
                <div className="space-y-5 text-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-full p-2 flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="text-mobile-friendly font-semibold text-gray-900 mb-2">무료 상담 신청</h3>
                      <p className="text-mobile-friendly leading-relaxed">희망하시는 차량 정보를 입력하시면 전문 상담사가 연락드립니다.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-full p-2 flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="text-mobile-friendly font-semibold text-gray-900 mb-2">맞춤 차량 검색</h3>
                      <p className="text-mobile-friendly leading-relaxed">고객님의 요구사항에 맞는 최적의 차량을 검색하고 추천해드립니다.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-full p-2 flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="text-mobile-friendly font-semibold text-gray-900 mb-2">차량 정보 제공</h3>
                      <p className="text-mobile-friendly leading-relaxed">차량의 상세 정보, 시세, 성능 관련 자료를 제공해드립니다.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-full p-2 flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h3 className="text-mobile-friendly font-semibold text-gray-900 mb-2">구매 결정 및 계약</h3>
                      <p className="text-mobile-friendly leading-relaxed">원하시는 차량으로 결정되면 안전한 계약을 진행해드립니다.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-full p-2 flex-shrink-0 mt-1">
                      <span className="text-blue-600 font-bold text-sm">5</span>
                    </div>
                    <div>
                      <h3 className="text-mobile-friendly font-semibold text-gray-900 mb-2">차량 인도</h3>
                      <p className="text-mobile-friendly leading-relaxed">계약이 완료된 차량은 원하시는 장소로 배송해드립니다.</p>
                    </div>
                  </div>
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