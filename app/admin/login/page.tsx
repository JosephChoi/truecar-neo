'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 컴포넌트 마운트 시 Supabase 연결 확인
  useEffect(() => {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Key available:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    console.log('로그인 시도:', { email });

    try {
      // API 호출 전 로깅
      console.log('Supabase 인증 요청 시작...');

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // API 응답 로깅
      console.log('Supabase 인증 응답:', { data, error });

      if (error) {
        throw error;
      }

      if (data?.user) {
        console.log('로그인 성공! 사용자 정보:', data.user);
        alert('로그인 성공!');
        
        // 페이지 이동 방법 (수정)
        window.location.href = '/admin/reviews';
      } else {
        console.warn('사용자 데이터 없음:', data);
        setError('인증은 성공했으나 사용자 정보가 없습니다.');
      }
    } catch (error: any) {
      console.error('로그인 오류 발생:', error);
      // 더 자세한 에러 메시지 표시
      setError(error.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            관리자 로그인
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>
          
          {/* 직접 이동 링크 추가 */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              로그인 후 직접 이동:
            </p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="/admin/reviews" className="text-sm font-medium text-black hover:text-gray-800">
                리뷰 관리
              </a>
              <a href="/admin/dashboard" className="text-sm font-medium text-black hover:text-gray-800">
                대시보드
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 