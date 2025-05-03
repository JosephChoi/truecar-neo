import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Timeline } from "@/components/sections/Timeline";
import { SpecialistTeam } from "@/components/sections/SpecialistTeam";

export default function StoryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <SpecialistTeam />
        <section className="py-16 bg-gradient-to-br from-blue-50 to-gray-50 relative overflow-hidden">
          {/* 배경 장식 요소 */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-1 rounded-full text-blue-700 bg-blue-100 text-sm font-medium mb-6">
                OUR STORY
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                TrueCar - Story
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                맞춤형 중고차 서비스를 만들기까지 트루카만의 이력을 소개합니다
              </p>
            </div>
          </div>
        </section>
        
        <Timeline />
      </main>
      <Footer />
    </div>
  );
} 