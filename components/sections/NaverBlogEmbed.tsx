"use client";

import { useEffect, useRef, useState } from "react";

interface NaverBlogEmbedProps {
  blogId: string;
  width?: string;
  height?: string;
  className?: string;
}

export function NaverBlogEmbed({ blogId, width = "100%", height = "800px", className }: NaverBlogEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // 네이버 블로그는 iframe에서 로드될 때 X-Frame-Options 제한이 있을 수 있음
    // 따라서 네이버에서 제공하는 공식 임베드 URL을 사용해야 함
    const handleIframeLoad = () => {
      if (iframeRef.current) {
        // 로드 이벤트 핸들링 (필요시)
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
      }
    };
  }, [blogId]);

  return (
    <div className={`w-full ${className}`}>
      <iframe
        ref={iframeRef}
        src={`https://blog.naver.com/${blogId}`}
        width={width}
        height={height}
        style={{ border: "none", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
        title="네이버 블로그"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

// 대체 컴포넌트: 네이버 블로그 링크 카드
export function NaverBlogLinkCard({ blogId }: { blogId: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2C5.582 2 2 5.582 2 10C2 14.418 5.582 18 10 18C14.418 18 18 14.418 18 10C18 5.582 14.418 2 10 2ZM13.447 6.882C13.639 6.882 13.796 7.039 13.796 7.232V12.786C13.796 12.978 13.639 13.136 13.447 13.136H6.553C6.361 13.136 6.204 12.978 6.204 12.786V7.232C6.204 7.039 6.361 6.882 6.553 6.882H8.398V10.728L10 9.562L11.602 10.728V6.882H13.447Z" fill="white"/>
          </svg>
        </div>
        <h3 className="font-bold text-xl">트루카 네이버 블로그</h3>
      </div>
      <p className="text-gray-700 mb-4">
        중고차 구매에 대한 유용한 정보와 트루카의 최신 소식을 확인하세요.
      </p>
      <a
        href={`https://blog.naver.com/${blogId}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
      >
        블로그 방문하기
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    </div>
  );
}

// X-Frame-Options 문제를 해결하기 위한 클라이언트 컴포넌트
// 네이버 블로그의 경우 직접 iframe으로 임베딩이 차단될 수 있음
export function NaverBlogIframe({ blogId }: { blogId: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  // 이 컴포넌트는 클라이언트 사이드에서만 렌더링됨
  useEffect(() => {
    try {
      // 블로그 로딩 시도
      setIsLoaded(true);
      
      // X-Frame-Options 오류를 감지하기 위한 로직
      const timer = setTimeout(() => {
        // iframe 로드 실패로 가정
        setIsError(true);
      }, 5000);

      return () => clearTimeout(timer);
    } catch (error) {
      setIsError(true);
    }
  }, [blogId]);

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-700 mb-4">
          네이버 블로그 콘텐츠를 로드할 수 없습니다. 보안 정책으로 인해 직접 임베딩이 제한됩니다.
        </p>
        <a
          href={`https://blog.naver.com/${blogId}`}
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
      <iframe
        src={`https://blog.naver.com/${blogId}`}
        width="100%"
        height="800px"
        style={{ border: "none", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
        title="네이버 블로그"
        allowFullScreen
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
      />
      {!isLoaded && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
} 