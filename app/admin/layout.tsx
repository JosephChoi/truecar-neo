'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const pathname = usePathname() ?? ''

  useEffect(() => {
    // 로그인/회원가입/인덱스 페이지는 인증 없이 접근 가능
    const publicPages = ['/admin/login', '/admin/signup', '/admin']
    if (publicPages.includes(pathname)) {
      // 공개 페이지는 인증 검사 없이 바로 표시
      setLoading(false)
      setAuthorized(true)
      return
    }
    
    // 비공개 페이지 (리뷰 관리 등)에만 인증 확인
    const checkAdmin = async () => {
      try {
        // 세션 확인
        const { data: { session } } = await supabase.auth.getSession()
        console.log('[AdminLayout] session:', session)
        
        // 세션이 없으면 로그인 페이지로 이동
        if (!session) {
          console.log('관리자 레이아웃: 로그인이 필요합니다')
          window.location.href = '/admin/login'
          return
        }
        
        // 관리자 권한 확인
        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', session.user.email ?? '')
          .single()
        console.log('[AdminLayout] adminUser:', adminUser, 'error:', error)
        
        if (error || !adminUser) {
          console.log('관리자 레이아웃: 관리자 권한이 없습니다')
          await supabase.auth.signOut()
          window.location.href = '/admin/login?unauthorized=true'
          return
        }
        
        // 관리자 확인 완료
        console.log('관리자 레이아웃: 관리자 확인 완료')
        setAuthorized(true)
      } catch (err) {
        console.error('관리자 레이아웃: 인증 확인 중 오류:', err)
        window.location.href = '/admin/login?error=true'
      } finally {
        setLoading(false)
      }
    }
    
    checkAdmin().finally(() => setLoading(false))
  }, [pathname])
  
  // 로딩 중이면 로딩 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  // 권한이 없으면 접근 거부 메시지
  if (!authorized) {
    return null // 인증 실패 시 아무것도 렌더링하지 않음(리다이렉트)
  }
  
  // 권한이 있으면 자식 컴포넌트 렌더링
  return children
}