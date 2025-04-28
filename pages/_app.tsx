import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { testSupabaseConnection } from '@/lib/supabase';

export default function App({ Component, pageProps }: AppProps) {
  // 앱 초기 로드 시 Supabase 연결 테스트
  useEffect(() => {
    // 환경 변수 디버깅
    console.log('환경 변수 확인:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL 존재:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY 존재:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Supabase 연결 테스트
    testSupabaseConnection()
      .then(success => {
        if (success) {
          console.log('✅ Supabase 연결 성공');
        } else {
          console.error('❌ Supabase 연결 실패');
        }
      });
  }, []);

  return <Component {...pageProps} />;
} 