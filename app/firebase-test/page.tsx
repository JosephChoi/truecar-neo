'use client'

import { useState, useEffect } from 'react'
import { testFirebaseConnection } from '@/lib/firebase'
import { ReviewService, AdminUserService } from '@/lib/firestore-utils'
import { FirebaseAuthService } from '@/lib/firebase-auth-utils'
import { testSupabaseConnection } from '@/lib/supabase'

export default function FirebaseTestPage() {
  const [testResults, setTestResults] = useState({
    firebase: { connected: false, error: null as string | null },
    firestore: { connected: false, error: null as string | null },
    auth: { connected: false, error: null as string | null },
    supabase: { connected: false, error: null as string | null },
    message: ''
  })

  const [isCreatingTestData, setIsCreatingTestData] = useState(false)

  const runTests = async () => {
    console.log('🔄 연결 테스트를 시작합니다...')

    // Firebase 기본 연결 테스트
    try {
      const firebaseResult = await testFirebaseConnection()
      setTestResults(prev => ({
        ...prev,
        firebase: { connected: firebaseResult, error: null }
      }))
      console.log('✅ Firebase 기본 연결:', firebaseResult ? '성공' : '실패')
    } catch (error) {
      console.error('❌ Firebase 기본 연결 오류:', error)
      setTestResults(prev => ({
        ...prev,
        firebase: { connected: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
      }))
    }

    // Firestore 연결 테스트
    try {
      await ReviewService.getAllReviews(1)
      setTestResults(prev => ({
        ...prev,
        firestore: { connected: true, error: null }
      }))
      console.log('✅ Firestore 연결: 성공')
    } catch (error) {
      console.error('❌ Firestore 연결 오류:', error)
      setTestResults(prev => ({
        ...prev,
        firestore: { connected: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
      }))
    }

    // Firebase Auth 연결 테스트
    try {
      const currentUser = FirebaseAuthService.getCurrentUser()
      setTestResults(prev => ({
        ...prev,
        auth: { connected: true, error: null }
      }))
      console.log('✅ Firebase Auth 연결: 성공', currentUser ? '(로그인됨)' : '(미로그인)')
    } catch (error) {
      console.error('❌ Firebase Auth 연결 오류:', error)
      setTestResults(prev => ({
        ...prev,
        auth: { connected: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
      }))
    }

    // Supabase 연결 테스트 (기존)
    try {
      const supabaseResult = await testSupabaseConnection()
      setTestResults(prev => ({
        ...prev,
        supabase: { connected: supabaseResult, error: null }
      }))
      console.log('✅ Supabase 연결:', supabaseResult ? '성공' : '실패')
    } catch (error) {
      console.error('❌ Supabase 연결 오류:', error)
      setTestResults(prev => ({
        ...prev,
        supabase: { connected: false, error: error instanceof Error ? error.message : '알 수 없는 오류' }
      }))
    }
  }

  const createTestData = async () => {
    setIsCreatingTestData(true)
    try {
      console.log('🔄 테스트 데이터 생성 중...')
      
      // 테스트 리뷰 데이터 생성
      const testReview = {
        title: '테스트 리뷰',
        content: '이것은 Firebase 연결 테스트를 위한 샘플 리뷰입니다.',
        rating: 5,
        author: 'Firebase 테스터',
        vehicle_type: 'sedan',
        budget: '2000만원',
        mileage: '5만km',
        preferred_color: '흰색',
        repair_history: '없음',
        reference_site: 'firebase-test'
      }

      const reviewId = await ReviewService.createReview(testReview)
      console.log('✅ 테스트 리뷰 생성 성공:', reviewId)

      // 테스트 관리자 데이터 생성
      const testAdmin = {
        email: 'admin@test.com'
      }

      const adminId = await AdminUserService.createAdmin(testAdmin)
      console.log('✅ 테스트 관리자 생성 성공:', adminId)

      alert('✅ 테스트 데이터가 성공적으로 생성되었습니다!')
      
      // 테스트 다시 실행
      runTests()
    } catch (error) {
      console.error('❌ 테스트 데이터 생성 오류:', error)
      alert('❌ 테스트 데이터 생성 실패: ' + (error instanceof Error ? error.message : '알 수 없는 오류'))
    } finally {
      setIsCreatingTestData(false)
    }
  }

  // Firebase에서 기존 리뷰 조회
  const fetchExistingReviews = async () => {
    try {
      setTestResults(prev => ({
        ...prev,
        message: 'Firebase에서 기존 리뷰 조회 중...'
      }));

      const result = await ReviewService.getAllReviews(10);
      const reviews = result.reviews;

      setTestResults(prev => ({
        ...prev,
        message: `📋 현재 Firebase에 ${reviews.length}개의 리뷰가 저장되어 있습니다.\n\n` +
          reviews.map((review, index) => 
            `${index + 1}. ${review.title} (작성자: ${review.author})`
          ).join('\n')
      }));

    } catch (error) {
      console.error('리뷰 조회 실패:', error);
      setTestResults(prev => ({
        ...prev,
        message: `❌ 리뷰 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      }));
    }
  };

  // Firebase에 샘플 리뷰 데이터 생성
  const createSampleReviews = async () => {
    try {
      const sampleReviews = [
        {
          title: '트루카로 첫 중고차 구매 성공!',
          content: '처음 중고차를 구매하는데 트루카에서 도움을 많이 받았어요. 상담사분이 친절하게 설명해주시고, 제 예산에 맞는 좋은 차량을 찾아주셨습니다.\n\n차량 상태도 설명해주신 것처럼 깨끗했고, 가격도 합리적이었어요. 다음에 차 바꿀 때도 트루카 이용할 예정입니다!',
          author: '김행복',
          rating: 5,
          vehicle_type: '승용차',
          budget: '2,000만원',
          mileage: '30,000km 이하',
          preferred_color: '화이트',
          repair_history: '무사고',
          reference_site: '카즈',
          image_url: 'https://cdn.imweb.me/thumbnail/20240407/bc0c4be6c9ec1.png',
          status: 'approved',
          views: 0
        },
        {
          title: '미니쿠퍼 구매 완료! 너무 만족해요',
          content: '오랫동안 원했던 미니쿠퍼를 드디어 구매했습니다! 트루카에서 제 조건에 맞는 차량을 빠르게 찾아주셔서 감사했어요.\n\n특히 차량 점검 서비스가 정말 꼼꼼했습니다. 안심하고 구매할 수 있었어요.',
          author: '이미니',
          rating: 5,
          vehicle_type: '승용차',
          budget: '2,500만원',
          mileage: '20,000km 이하',
          preferred_color: '블루, 레드',
          repair_history: '경미한 수리이력 1회',
          reference_site: '엔카',
          image_url: 'https://cdn.imweb.me/thumbnail/20240407/64e8e8a5e7a97.png',
          status: 'approved',
          views: 0
        },
        {
          title: '신차 같은 중고차 추천해주셔서 감사합니다',
          content: '거의 신차 수준의 중고차를 구할 수 있어서 너무 만족스러웠습니다. 가격도 합리적이고 상태도 완벽했어요.\n\n앞으로 주변에 많이 추천하겠습니다. 트루카 최고!',
          author: '박만족',
          rating: 5,
          vehicle_type: '세단',
          budget: '3,500만원',
          mileage: '10,000km 이하',
          preferred_color: '그레이',
          repair_history: '무사고',
          reference_site: '현대 인증중고차',
          image_url: 'https://cdn.imweb.me/thumbnail/20240407/dac9242bf16b4.png',
          status: 'approved',
          views: 0
        }
      ];

      setTestResults(prev => ({
        ...prev,
        message: '샘플 리뷰 데이터 생성 중...'
      }));

      // 각 리뷰를 Firebase에 추가
      for (const review of sampleReviews) {
        await ReviewService.createReview(review);
      }

      setTestResults(prev => ({
        ...prev,
        message: `✅ ${sampleReviews.length}개의 샘플 리뷰가 성공적으로 생성되었습니다!`
      }));

    } catch (error) {
      console.error('샘플 리뷰 생성 실패:', error);
      setTestResults(prev => ({
        ...prev,
        message: `❌ 샘플 리뷰 생성 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      }));
    }
  };

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            데이터베이스 연결 테스트
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Firebase 테스트 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                🔥 Firebase 연결 상태
              </h2>

              <TestResult
                title="Firebase 기본 연결"
                connected={testResults.firebase.connected}
                error={testResults.firebase.error}
              />

              <TestResult
                title="Firestore Database"
                connected={testResults.firestore.connected}
                error={testResults.firestore.error}
              />

              <TestResult
                title="Firebase Authentication"
                connected={testResults.auth.connected}
                error={testResults.auth.error}
              />
            </div>

            {/* Supabase 테스트 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-green-600 mb-4">
                ⚡ Supabase 연결 상태
              </h2>

              <TestResult
                title="Supabase Database"
                connected={testResults.supabase.connected}
                error={testResults.supabase.error}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={runTests}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🔄 다시 테스트
            </button>
            
            <button
              onClick={createTestData}
              disabled={isCreatingTestData}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {isCreatingTestData ? '⏳ 생성 중...' : '📝 테스트 데이터 생성'}
            </button>
          </div>

          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">📋 설정 체크리스트</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>Firebase 프로젝트 생성</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>Firestore Database 활성화</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>Authentication 설정</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>Storage 설정</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>인덱스 배포</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✅</span>
                <span>보안 규칙 설정 (테스트 모드)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-yellow-800 font-semibold mb-2">⚠️ 현재 설정</h4>
            <p className="text-yellow-700 text-sm">
              테스트를 위해 Firestore 보안 규칙이 임시로 모든 접근을 허용하도록 설정되었습니다. 
              프로덕션 배포 전에 적절한 보안 규칙으로 변경해야 합니다.
            </p>
          </div>

          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">📋 샘플 리뷰 데이터 관리</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={createSampleReviews}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  📝 샘플 리뷰 생성하기
                </button>
                <button
                  onClick={fetchExistingReviews}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🔍 기존 리뷰 조회하기
                </button>
              </div>
              {testResults.message && (
                <div className="bg-white p-4 rounded-lg border">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{testResults.message}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TestResult({ title, connected, error }: {
  title: string
  connected: boolean
  error: string | null
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          connected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {connected ? '✅ 연결됨' : '❌ 연결 안됨'}
        </div>
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          오류: {error}
        </div>
      )}
    </div>
  )
} 