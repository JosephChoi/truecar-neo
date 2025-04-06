import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrderForm } from "@/components/sections/OrderForm";

export default function OrderPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                맞춤 중고차 주문하기
              </h1>
              <p className="text-xl text-gray-700">
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
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  트루카 주문 서비스 이용 안내
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>1. 무료 상담 신청</strong> - 희망하시는 차량 정보를 입력하시면 전문 상담사가 연락드립니다.
                  </p>
                  <p>
                    <strong>2. 맞춤 차량 검색</strong> - 고객님의 요구사항에 맞는 최적의 차량을 검색하고 추천해드립니다.
                  </p>
                  <p>
                    <strong>3. 차량 정보 제공</strong> - 차량의 상세 정보, 시세, 성능 관련 자료를 제공해드립니다.
                  </p>
                  <p>
                    <strong>4. 구매 결정 및 계약</strong> - 원하시는 차량으로 결정되면 안전한 계약을 진행해드립니다.
                  </p>
                  <p>
                    <strong>5. 차량 인도</strong> - 계약이 완료된 차량은 원하시는 장소로 배송해드립니다.
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