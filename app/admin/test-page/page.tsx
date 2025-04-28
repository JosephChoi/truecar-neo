'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
      setLoading(false);
    };
    
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">테스트 페이지</h1>
        
        {loading ? (
          <p className="text-gray-600 text-center">로딩 중...</p>
        ) : user ? (
          <div className="space-y-4">
            <p className="text-green-600 font-semibold text-center">인증 성공!</p>
            <p className="text-gray-700">
              이메일: {user.email}
            </p>
            <p className="text-gray-700">
              ID: {user.id}
            </p>
            <p className="text-gray-700">
              마지막 로그인: {new Date(user.last_sign_in_at).toLocaleString()}
            </p>
            
            <div className="pt-4 flex justify-center space-x-4">
              <Link href="/admin/dashboard" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                대시보드로 이동
              </Link>
              
              <button 
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = '/admin/login';
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-red-600 font-semibold text-center">인증 실패!</p>
            <p className="text-gray-700 text-center">
              로그인이 필요합니다.
            </p>
            <div className="pt-4 flex justify-center">
              <Link href="/admin/login" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                로그인 페이지로 이동
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 