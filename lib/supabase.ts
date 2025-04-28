import { createClient } from '@supabase/supabase-js'

// 환경 변수 확인 및 디버깅
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 환경 변수가 없을 경우 콘솔 경고
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다!', { 
    url: !!supabaseUrl, 
    key: !!supabaseAnonKey 
  });
}

// 클라이언트 생성 전 로깅
console.log('Supabase 클라이언트 초기화...', { 
  url: supabaseUrl?.substring(0, 15) + '...', 
  keyAvailable: !!supabaseAnonKey 
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 