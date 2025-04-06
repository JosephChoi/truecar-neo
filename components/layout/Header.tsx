"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full py-4 bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="relative h-10 w-32">
            {/* 로고 이미지 - 실제 이미지로 대체 필요 */}
            <div className="absolute inset-0 flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">TrueCar</h1>
            </div>
          </div>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Blog
          </Link>
          <Link href="/story" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            STORY
          </Link>
          <div className="relative group">
            <Link href="/review" className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center">
              REVIEW
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </Link>
            <div className="absolute left-0 mt-2 w-56 bg-white border rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link href="/review/custom-order" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                맞춤 주문 후기
              </Link>
              <Link href="/review/selling" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                내차 팔기 후기
              </Link>
            </div>
          </div>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 py-2 h-auto transition-colors">
            <Link href="/order">
              맞춤 주문하기
            </Link>
          </Button>
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg z-40">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="/blog" className="py-3 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
              Blog
            </Link>
            <Link href="/story" className="py-3 text-gray-700 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
              STORY
            </Link>
            <div className="py-3">
              <Link href="/review" className="text-gray-700 hover:text-blue-600 font-medium block mb-2" onClick={() => setIsMenuOpen(false)}>
                REVIEW
              </Link>
              <div className="pl-4 flex flex-col space-y-2">
                <Link href="/review/custom-order" className="py-2 text-sm text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                  맞춤 주문 후기
                </Link>
                <Link href="/review/selling" className="py-2 text-sm text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                  내차 팔기 후기
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 