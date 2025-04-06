"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ReviewForm from "@/components/admin/ReviewForm";
import { useRouter } from "next/navigation";

export default function NewReviewPage() {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    // 실제 구현에서는 API 호출을 통해 데이터를 저장합니다.
    console.log("새로운 리뷰 작성:", data);
    
    // 저장 후 관리 페이지로 이동
    router.push("/admin/reviews");
  };

  const handleCancel = () => {
    router.push("/admin/reviews");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="py-8 bg-gradient-to-br from-blue-50 to-gray-50 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-1 rounded-full text-blue-700 bg-blue-100 text-sm font-medium mb-4">
                ADMIN
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                새 리뷰 작성
              </h1>
              <p className="text-lg text-gray-700">
                관리자 페이지에서 새로운 리뷰를 작성합니다
              </p>
            </div>
          </div>
        </div>
        
        <ReviewForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </main>
      <Footer />
    </div>
  );
} 