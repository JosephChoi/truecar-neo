'use client'

import { useState, useEffect } from 'react'
import { FirebaseAuthService } from '@/lib/firebase-auth-utils'
import { AdminUserService } from '@/lib/firestore-utils'
import { usePathname } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const pathname = usePathname() ?? ''

  useEffect(() => {
    console.log('[AdminLayout] === 인증 검사 시작 ===')
    console.log('[AdminLayout] 현재 경로:', pathname)
    
    // 로그인/회원가입/인덱스 페이지는 인증 없이 접근 가능
    const publicPages = ['/admin/login', '/admin/signup', '/admin']
    if (publicPages.includes(pathname)) {
      console.log('[AdminLayout] 공개 페이지 - 인증 검사 생략')
      setLoading(false)
      setAuthorized(true)
      return
    }
    
    console.log('[AdminLayout] 비공개 페이지 - 인증 검사 필요')
    
    // onAuthStateChanged를 사용하여 Firebase Auth 상태 변화 감지
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        console.log('[AdminLayout] Auth state changed:', user?.email)
        
        if (!user || !user.email) {
          console.log('[AdminLayout] 인증되지 않은 사용자 - 로그인 페이지로 리다이렉션')
          setAuthorized(false)
          setLoading(false)
          window.location.href = '/admin/login'
          return
        }
        
        console.log('[AdminLayout] 인증된 사용자 감지 - 관리자 권한 확인 시작')
        
        // 관리자 권한 확인
        const isAdmin = await AdminUserService.isAdmin(user.email)
        console.log('[AdminLayout] 관리자 권한 확인 결과:', isAdmin)
        
        if (!isAdmin) {
          console.log('[AdminLayout] 관리자 권한 없음 - 로그아웃 후 로그인 페이지로 이동')
          await FirebaseAuthService.signOut()
          window.location.href = '/admin/login?unauthorized=true'
          return
        }
        
        console.log('[AdminLayout] 인증 및 권한 확인 완료 - 페이지 접근 허용')
        setAuthorized(true)
        setLoading(false)
        
      } catch (error) {
        console.error('[AdminLayout] 인증 검사 오류:', error)
        setAuthorized(false)
        setLoading(false)
        window.location.href = '/admin/login?error=true'
      }
    })
    
    // 컴포넌트 언마운트 시 리스너 정리
    return () => {
      console.log('[AdminLayout] Auth state listener 정리')
      unsubscribe()
    }
  }, [pathname])

  // 로딩 중일 때 표시할 UI
  if (loading) {
    console.log('[AdminLayout] 로딩 중...')
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  // 인증되지 않았을 때
  if (!authorized) {
    console.log('[AdminLayout] 인증 실패 - 빈 화면 표시')
    return null // 리다이렉션 처리 중이므로 빈 화면 표시
  }

  console.log('[AdminLayout] 인증 완료 - 페이지 렌더링')
  return <>{children}</>
}