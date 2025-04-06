export function Timeline() {
  const milestones = [
    {
      year: "2017년",
      title: "법인설립 OOOO",
      description: "트루카의 시작, 신뢰할 수 있는 중고차 서비스를 위한 첫걸음을 내딛었습니다."
    },
    {
      year: "2019년",
      title: "법인명 변경 OOOOO",
      description: "새로운 비전과 함께 회사의 정체성을 재정립하였습니다."
    },
    {
      year: "2020년",
      title: "박배혁 공동대표 취임",
      description: "고객 중심 서비스 철학을 가진 새로운 리더십으로 도약의 발판을 마련했습니다."
    },
    {
      year: "2021년",
      title: "비대면 판매 시작 (유튜브, 블로그 운영)",
      description: "코로나19 상황에서도 고객과 소통하며 새로운 판매 채널을 구축했습니다."
    },
    {
      year: "2023년",
      title: "주문, 맞춤형 중고차 구매 시스템 클로즈 베타 서비스",
      description: "고객 맞춤형 서비스를 위한 혁신적인 주문 시스템을 개발하고 테스트했습니다."
    },
    {
      year: "2024년",
      title: "홈페이지 오픈 및 주문서비스 오픈베타 서비스 시행",
      description: "모든 고객에게 쉽고 편리한 맞춤형 중고차 서비스를 제공하기 시작했습니다."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* 세로선 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-100"></div>
            
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* 원형 마커 */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full z-10 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 px-6 md:px-12 py-6">
                    <div className={`bg-gradient-to-br ${index % 2 === 0 ? 'from-blue-50 to-white md:mr-12' : 'from-indigo-50 to-white md:ml-12'} p-6 rounded-xl shadow-lg`}>
                      <div className="inline-block px-3 py-1 rounded-full text-blue-700 bg-blue-100 text-sm font-medium mb-3">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-700">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 