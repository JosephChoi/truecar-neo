'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FirebaseAuthService } from '@/lib/firebase-auth-utils'
import { AdminUserService } from '@/lib/firestore-utils'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 세션이 있는데 관리자가 아니면 로그아웃만 하고 폼을 보여줌
  useEffect(() => {
    let isMounted = true
    const check = async () => {
      const currentUser = FirebaseAuthService.getCurrentUser()
      if (currentUser && currentUser.email) {
        const isAdmin = await AdminUserService.isAdmin(currentUser.email)
        if (!isAdmin) {
          await FirebaseAuthService.signOut()
        } else {
          // 이미 관리자로 로그인되어 있으면 대시보드로 이동
          router.push('/admin/reviews')
          return
        }
      }
      if (isMounted) setChecking(false)
    }
    check()
    return () => { isMounted = false }
  }, [router])
  
  // URL 파라미터 처리
  useEffect(() => {
    let unauthorized = ''
    let error = ''
    try {
      unauthorized = (searchParams && typeof (searchParams as any).get === 'function')
        ? (searchParams as any).get('unauthorized') ?? ''
        : ''
      error = (searchParams && typeof (searchParams as any).get === 'function')
        ? (searchParams as any).get('error') ?? ''
        : ''
    } catch {}
    if (unauthorized === 'true') setError('관리자 권한이 없습니다.')
    if (error === 'true') setError('인증 과정에서 오류가 발생했습니다.')
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }
    
    try {
      setError(null)
      setLoading(true)
      
      console.log('[Login] === 로그인 시작 ===')
      console.log('[Login] 이메일:', email)
      console.log('[Login] Firebase auth 객체:', auth)
      console.log('[Login] 현재 사용자:', auth.currentUser)
      
      // 1. Firebase Auth로 로그인
      console.log('[Login] Step 1: Firebase 로그인 시도')
      const user = await FirebaseAuthService.signInWithEmail(email, password)
      console.log('[Login] Step 1 완료: Firebase 로그인 성공:', user)
      
      if (!user || !user.email) {
        throw new Error('로그인 실패: 사용자 정보가 없습니다.')
      }
      
      // 2. 잠시 대기하여 Firebase Auth 상태 안정화
      console.log('[Login] Step 2: Firebase Auth 상태 안정화 대기')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 3. 현재 사용자 확인
      console.log('[Login] Step 3: 현재 사용자 확인')
      const currentUser = FirebaseAuthService.getCurrentUser()
      console.log('[Login] 현재 사용자:', currentUser)
      
      if (!currentUser || !currentUser.email) {
        console.log('[Login] 오류: 현재 사용자가 없습니다. Auth 상태 변화 감지를 사용합니다.')
        
        // 4. onAuthStateChanged 사용하여 인증 상태 확인
        await new Promise<void>((resolve, reject) => {
          console.log('[Login] Step 4: onAuthStateChanged 사용')
          const timeout = setTimeout(() => {
            console.log('[Login] 타임아웃: 인증 상태 확인 시간 초과')
            reject(new Error('인증 상태 확인 시간 초과'))
          }, 15000) // 15초 타임아웃
          
          const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            try {
              console.log('[Login] Auth state changed:', authUser?.email)
              clearTimeout(timeout)
              unsubscribe()
              
              if (authUser && authUser.email) {
                console.log('[Login] Step 5: 관리자 권한 확인 시작')
                const isAdmin = await AdminUserService.isAdmin(authUser.email)
                console.log('[Login] Step 5 완료: 관리자 권한 결과:', isAdmin)
                
                if (!isAdmin) {
                  console.log('[Login] 오류: 관리자 권한이 없습니다.')
                  await FirebaseAuthService.signOut()
                  throw new Error('관리자 권한이 없습니다.')
                }
                
                console.log('[Login] Step 6: 로그인 성공 - 페이지 이동 준비')
                resolve()
              } else {
                console.log('[Login] 오류: 인증된 사용자가 없습니다.')
                reject(new Error('인증 상태 확인 실패'))
              }
            } catch (err) {
              console.log('[Login] Auth state change 오류:', err)
              clearTimeout(timeout)
              unsubscribe()
              reject(err)
            }
          })
        })
      } else {
        // 5. 직접 관리자 권한 확인
        console.log('[Login] Step 5 (직접): 관리자 권한 확인 시작')
        const isAdmin = await AdminUserService.isAdmin(currentUser.email)
        console.log('[Login] Step 5 (직접) 완료: 관리자 권한 결과:', isAdmin)
        
        if (!isAdmin) {
          console.log('[Login] 오류: 관리자 권한이 없습니다.')
          await FirebaseAuthService.signOut()
          throw new Error('관리자 권한이 없습니다.')
        }
      }
      
      // 6. 성공적으로 로그인되면 관리자 페이지로 이동
      console.log('[Login] Step 6: 페이지 이동 시작')
      console.log('[Login] === 로그인 완료 ===')
      
      // 상태 업데이트를 위한 짧은 대기
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Next.js router를 사용한 페이지 이동
      router.push('/admin/reviews')
      
      // 만약 router.push가 작동하지 않으면 강제 리다이렉션
      setTimeout(() => {
        if (window.location.pathname === '/admin/login') {
          console.log('[Login] router.push 실패 - 강제 리다이렉션 사용')
          window.location.href = '/admin/reviews'
        }
      }, 1000)
      
    } catch (err: any) {
      console.error('[Login] === 로그인 오류 ===')
      console.error('[Login] 오류 상세:', err)
      console.error('[Login] 오류 메시지:', err?.message)
      console.error('[Login] 오류 코드:', err?.code)
      setError(err?.message || '로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 디버깅용 함수들
  const checkFirebaseStatus = async () => {
    console.log('=== Firebase 상태 확인 ===')
    console.log('Auth 객체:', auth)
    console.log('현재 사용자:', auth.currentUser)
    console.log('현재 사용자 (서비스):', FirebaseAuthService.getCurrentUser())
    
    if (auth.currentUser) {
      console.log('이메일:', auth.currentUser.email)
      console.log('UID:', auth.currentUser.uid)
      console.log('이메일 인증 상태:', auth.currentUser.emailVerified)
    }
  }

  const checkAdminStatus = async () => {
    if (!email) {
      console.log('이메일을 입력해주세요.')
      return
    }
    
    console.log('=== 관리자 상태 확인 ===')
    console.log('확인할 이메일:', email)
    
    try {
      const admin = await AdminUserService.getAdminByEmail(email)
      console.log('관리자 정보:', admin)
      
      const isAdmin = await AdminUserService.isAdmin(email)
      console.log('관리자 권한:', isAdmin)
    } catch (error) {
      console.error('관리자 상태 확인 오류:', error)
    }
  }

  if (checking) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            관리자 로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            관리자 계정으로 로그인하여 리뷰를 관리하세요
          </p>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    로그인 실패
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center items-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  로그인 중...
                </div>
              ) : (
                '로그인'
              )}
            </button>
          </div>

          {/* 디버깅 버튼들 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">디버깅 도구</p>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={checkFirebaseStatus}
                className="flex-1 py-2 px-3 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Firebase 상태
              </button>
              <button
                type="button"
                onClick={checkAdminStatus}
                className="flex-1 py-2 px-3 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                관리자 확인
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 