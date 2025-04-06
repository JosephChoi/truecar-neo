"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from 'axios';

// 블로그 포스트 미리보기
interface BlogPreview {
  title: string;
  summary: string;
  date: string;
  link: string;
}

export default function NaverBlogClientSection({ blogId }: { blogId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // 블로그 대표 URL
  const blogUrl = `https://blog.naver.com/${blogId}`;

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        
        // 내부 API 엔드포인트로 요청
        const response = await axios.get(`/api/blog?blogId=${blogId}`);
        
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        
        const posts = response.data.posts;
        
        // 날짜 형식 변환
        const formattedPosts: BlogPreview[] = posts.map((post: any) => {
          const pubDate = new Date(post.date);
          return {
            ...post,
            date: pubDate.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })
          };
        });
        
        setBlogPosts(formattedPosts);
        setIsLoading(false);
      } catch (error) {
        console.error("블로그 데이터 가져오기 오류:", error);
        setError("블로그 데이터를 가져올 수 없습니다.");
        setIsLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, [blogId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-700 mb-4">{error}</p>
        <a
          href={blogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          네이버 블로그로 바로가기
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 블로그 방문 카드 - 상단에 배치 */}
      <div className="mb-8 flex justify-between items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3 animate-pulse">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.17 8.15C16.5 8.15 16.77 8.42 16.77 8.75V15.55C16.77 15.88 16.5 16.15 16.17 16.15H7.83C7.5 16.15 7.23 15.88 7.23 15.55V8.75C7.23 8.42 7.5 8.15 7.83 8.15H10.02V12.65L12 11.25L13.98 12.65V8.15H16.17Z" fill="white"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">트루카 네이버 블로그</h3>
            <p className="text-gray-600 text-xs">중고차 구매에 대한 유용한 정보와 최신 소식</p>
          </div>
        </div>
        
        <a
          href={blogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all duration-300 text-sm font-medium hover:px-5 hover:shadow-lg"
        >
          블로그 방문하기
        </a>
      </div>
      
      {blogPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {blogPosts.slice(0, 4).map((post, index) => (
            <a 
              key={index} 
              href={post.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl group transition-all duration-300 flex flex-col h-full transform hover:-translate-y-2"
            >
              <div className="h-36 bg-gradient-to-r from-blue-400 to-indigo-500 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-45 transition-transform duration-300">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 12h8"></path>
                      <path d="M12 8v8"></path>
                    </svg>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-5 flex-grow flex flex-col min-h-[180px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-gray-700 mb-4 text-sm flex-grow">
                  {post.summary}
                </p>
                <div className="text-blue-600 font-medium hover:underline inline-flex items-center text-sm mt-auto group-hover:translate-x-1 transition-transform duration-300">
                  자세히 보기
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:ml-2 transition-all duration-300">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <p className="text-gray-700">등록된 블로그 게시글이 없습니다.</p>
        </div>
      )}
    </div>
  );
} 