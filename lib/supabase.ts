import { createClient } from '@supabase/supabase-js'

// 환경 변수 확인 및 디버깅 (빌드 시 에러 방지를 위한 기본값 제공)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key-placeholder';

// 환경 변수 경고 메시지 (클라이언트 사이드에서만)
if (typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('⚠️ Supabase 환경 변수가 설정되지 않았습니다!', { 
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '설정됨' : '없음', 
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '설정됨' : '없음' 
    });
    console.warn('⚠️ Supabase 연결에 필요한 환경 변수가 없습니다. .env.local 파일을 확인하세요.');
    
    // 개발 환경에서 추가 도움말 메시지
    if (process.env.NODE_ENV === 'development') {
      console.info('🔍 개발 환경에서는 .env.local 파일에 다음 변수가 필요합니다:');
      console.info('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
      console.info('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
    }
  } else {
    // 환경 변수 존재 확인
    console.log('✅ Supabase 환경 변수 확인 완료');
  }
}

// 개발 시에만 URL 값 확인
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // URL의 첫 10자와 마지막 5자만 표시 (보안)
  const safeUrlDisplay = process.env.NEXT_PUBLIC_SUPABASE_URL 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 10)}...${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(process.env.NEXT_PUBLIC_SUPABASE_URL.length - 5)}`
    : '없음';
  console.log('Supabase URL (일부): ', safeUrlDisplay);
  console.log('Supabase Key available:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// 싱글턴 패턴 적용
let supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'truecar-neo'
    },
  },
  db: {
    schema: 'public'
  }
});

export { supabase }

// 안전 체크 및 연결 테스트 함수
export const testSupabaseConnection = async () => {
  try {
    console.log('Supabase 연결 테스트 시작...');
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('환경 변수가 설정되지 않았습니다. 실제 연결은 작동하지 않을 수 있습니다.');
      return false;
    }
    
    const { data, error } = await supabase
      .from('reviews')
      .select('count', { count: 'exact', head: true });
      
    if (error) {
      throw error;
    }
    
    console.log('Supabase 연결 성공! 테스트 완료');
    return true;
  } catch (err) {
    console.error('Supabase 연결 테스트 실패:', err);
    return false;
  }
}

// 페이지 로드 시 자동으로 연결 테스트 (개발 환경에서만)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Supabase 연결 자동 테스트 실행...');
  testSupabaseConnection()
    .then(success => {
      if (success) {
        console.log('✅ Supabase 데이터베이스에 성공적으로 연결되었습니다.');
      } else {
        console.error('❌ Supabase 데이터베이스 연결에 실패했습니다. 환경 변수를 확인하세요.');
      }
    });
} 