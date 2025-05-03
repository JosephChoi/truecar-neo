'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminIndexPage() {
  const router = useRouter()
  
  useEffect(() => {
    // /admin으로 접속 시 로그인 페이지로 리다이렉션
    router.replace('/admin/login')
  }, [router])
  
  // 리다이렉션 중 표시할 로딩 화면
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
} 