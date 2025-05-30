import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-br from-blue-50 to-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="heading-mobile-friendly text-gray-900 mb-6">
                개인정보처리방침
              </h1>
              <p className="subheading-mobile-friendly text-gray-700 leading-relaxed">
                트루카는 고객님의 개인정보를 소중히 생각하며 안전하게 보호합니다
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">

                <h2 className="text-2xl font-bold text-gray-900 mb-4">제1조 개인정보의 처리목적</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  트루카(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-8 space-y-2">
                  <li>중고차 맞춤 상담 서비스 제공</li>
                  <li>고객 문의 및 상담 응답</li>
                  <li>차량 정보 제공 및 추천</li>
                  <li>서비스 개선을 위한 통계 분석</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">제2조 개인정보의 처리 및 보유기간</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-8 space-y-2">
                  <li><strong>상담 신청 정보:</strong> 상담 완료 후 3년간 보관 (소비자보호법에 따른 소비자 불만 또는 분쟁처리에 관한 기록)</li>
                  <li><strong>웹사이트 이용 기록:</strong> 3개월 (통신비밀보호법)</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">제3조 개인정보의 처리 항목</h2>
                <p className="text-gray-700 leading-relaxed mb-4">회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">중고차 상담 신청</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>필수항목: 이름, 연락처, 희망차량, 예산</li>
                    <li>선택항목: 선호색상, 주행거리, 수리이력, 참고사이트</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">제4조 개인정보의 제3자 제공</h2>
                <p className="text-gray-700 leading-relaxed mb-8">
                  회사는 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">제5조 개인정보처리의 위탁</h2>
                <p className="text-gray-700 leading-relaxed mb-8">
                  회사는 원활한 개인정보 업무처리를 위하여 개인정보 처리업무를 위탁하고 있지 않습니다. 향후 위탁이 필요한 경우 위탁받는 자와 위탁업무에 대해 고지하고 필요한 경우 사전 동의를 받겠습니다.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">제6조 정보주체의 권리·의무 및 행사방법</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>개인정보 처리현황 통지요구</li>
                  <li>개인정보 처리정지 요구</li>
                  <li>개인정보의 정정·삭제 요구</li>
                  <li>손해배상 청구</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-8">
                  위의 권리 행사는 개인정보보호법 시행규칙 별지 제8호 서식에 따라 작성하여 서면, 전자우편으로 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">제7조 개인정보의 파기</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-8 space-y-2">
                  <li><strong>파기절차:</strong> 불필요한 개인정보 및 개인정보파일은 개인정보보호책임자의 승인을 받아 파기합니다.</li>
                  <li><strong>파기방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">제8조 개인정보의 안전성 확보조치</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-8 space-y-2">
                  <li>개인정보 취급직원의 최소화 및 교육</li>
                  <li>개인정보에 대한 접근 제한</li>
                  <li>개인정보의 암호화</li>
                  <li>해킹 등에 대비한 기술적 대책</li>
                  <li>개인정보처리시스템 등의 접근기록 보관 및 위변조 방지</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">제9조 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-8 space-y-2">
                  <li><strong>쿠키의 사용목적:</strong> 이용자의 접속 빈도나 방문 시간 등의 분석, 이용자의 취향과 관심분야의 파악 및 자취 추적</li>
                  <li><strong>쿠키 설정 거부 방법:</strong> 웹브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">제10조 개인정보보호책임자</h2>
                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다.
                  </p>
                  <div className="text-blue-800 space-y-2">
                    <p><strong>개인정보보호책임자</strong></p>
                    <p>성명: 박배혁</p>
                    <p>이메일: turecar2023@naver.com</p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">제11조 개인정보 처리방침 변경</h2>
                <p className="text-gray-700 leading-relaxed mb-8">
                  이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                </p>

                <div className="bg-gray-100 p-6 rounded-lg">
                  <p className="text-gray-700 text-center">
                    <strong>본 방침은 2024년 1월 1일부터 시행됩니다.</strong>
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