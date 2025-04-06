import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NaverBlogLinkCard } from "@/components/sections/NaverBlogEmbed";
import dynamic from 'next/dynamic';
import NaverBlogClientSection from "@/components/sections/NaverBlogClientSection";

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-br from-blue-50 to-gray-50 relative overflow-hidden">
          {/* 배경 장식 요소 */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-1 rounded-full text-blue-700 bg-blue-100 text-sm font-medium mb-6">
                BLOG
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                트루카 블로그
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                중고차에 관한 유용한 정보와 팁을 제공합니다
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">네이버 블로그에서 최신 소식을 확인하세요</h2>
              
              <div className="mb-12 pb-8">
                <NaverBlogClientSection blogId="truecar2017" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 