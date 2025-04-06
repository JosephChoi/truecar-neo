import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Story() {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* 배경 장식 요소 */}
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-1 rounded-full text-blue-700 bg-blue-100 text-sm font-medium mb-4">
                ABOUT US
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">TrueCar Story</h2>
              <p className="text-xl text-gray-700 mb-6">
                20년간 진행한 트루카의 이야기를 들려드립니다
              </p>
              <div className="space-y-4 text-gray-600">
                <div className="pl-4 border-l-2 border-blue-500">
                  <p className="text-lg">
                    한번 팔고 그만인 중고차는 허위매물 일 수 있지만
                    평생을 함께 할 고객으로 대하면 거짓이
                    있을 수 없습니다
                  </p>
                </div>
                <p>
                  20년간 단 한건의 불만접수가 없었던 TrueCar의 명성을 걸고
                  만족을 약속드립니다
                </p>
                <p>
                  한분한분과 지킨 약속의 결과가 TrueCar의 Story가 되었습니다
                </p>
                <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <p className="font-medium text-gray-900 text-lg">
                    고객의 마음은 속일 수 없기에...<br />
                    TrueCar가 그 마음을 지킵니다
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Button asChild variant="outline" className="rounded-full px-8 py-2 border-blue-500 text-blue-600 hover:bg-blue-50">
                  <Link href="/story">
                    TrueCar Story 더 알아보기
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl transform md:translate-y-4">
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-blue-500 to-indigo-600 relative">
                {/* 전문가 팀 이미지 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                  <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm w-full max-w-xs">
                    <h3 className="text-2xl font-bold mb-2">전문가 팀</h3>
                    <p className="text-white/90">20년 경력의 중고차 전문가들이 정직한 서비스를 제공합니다</p>
                  </div>
                </div>
                
                {/* 장식 요소 */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                  <div className="w-3 h-3 rounded-full bg-white opacity-60"></div>
                  <div className="w-3 h-3 rounded-full bg-white opacity-30"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 