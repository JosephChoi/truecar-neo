import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 모든 요청을 허용하는 간단한 미들웨어
export async function middleware(req: NextRequest) {
  // 요청 경로 로깅
  console.log('미들웨어 실행:', req.nextUrl.pathname);
  
  // 항상 요청 허용
  return NextResponse.next();
}

// 원래 코드는 문제 해결 후 다시 활성화할 수 있음
/*
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  console.log('미들웨어 실행:', pathname);

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // 로그인 페이지는 인증 예외
  if (pathname === '/admin/login') {
    console.log('로그인 페이지 접근: 인증 예외');
    return res
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log('세션 확인 결과:', { hasSession: !!session });

    // /admin 이하 경로는 인증 필요
    if (pathname.startsWith('/admin')) {
      if (!session) {
        console.log('인증 필요: 로그인 페이지로 리다이렉트');
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    }

    return res
  } catch (error) {
    console.error('미들웨어 에러:', error);
    // 오류 발생 시에도 페이지 접근은 허용
    return res;
  }
}
*/

export const config = {
  matcher: ['/admin/:path*'],
} 