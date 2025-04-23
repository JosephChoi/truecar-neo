"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full py-5 bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-blue-600">TrueCar</h1>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center justify-end flex-1 gap-12">
          <nav className="flex space-x-10 justify-end">
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-[1.1rem]">
              Blog
            </Link>
            <Link href="/story" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-[1.1rem]">
              STORY
            </Link>
            <Link href="/review" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-[1.1rem]">
              REVIEW
            </Link>
          </nav>
          
          <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700 rounded-full px-7 py-2 h-auto transition-colors text-base">
            <Link href="/order">
              맞춤 주문하기
            </Link>
          </Button>
        </div>
        
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
      
      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg z-40">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <Link href="/blog" className="py-3 text-gray-700 hover:text-blue-600 font-medium text-[1.1rem]" onClick={() => setIsMenuOpen(false)}>
              Blog
            </Link>
            <Link href="/story" className="py-3 text-gray-700 hover:text-blue-600 font-medium text-[1.1rem]" onClick={() => setIsMenuOpen(false)}>
              STORY
            </Link>
            <Link href="/review" className="py-3 text-gray-700 hover:text-blue-600 font-medium text-[1.1rem]" onClick={() => setIsMenuOpen(false)}>
              REVIEW
            </Link>
            <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700 rounded-full px-7 py-2 h-auto transition-colors text-base mt-2">
              <Link href="/order" onClick={() => setIsMenuOpen(false)}>
                맞춤 주문하기
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
} 