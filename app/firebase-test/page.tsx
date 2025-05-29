'use client'

import { useState, useEffect } from 'react'
import { testFirebaseConnection } from '@/lib/firebase'
import { ReviewService, AdminUserService } from '@/lib/firestore-utils'
import { FirebaseAuthService } from '@/lib/firebase-auth-utils'

export default function FirebaseTestPage() {
  const [testResults, setTestResults] = useState({
    firebase: { connected: false, error: null as string | null },
    firestore: { connected: false, error: null as string | null },
    auth: { connected: false, error: null as string | null },
    message: ''
  })

  const [isCreatingTestData, setIsCreatingTestData] = useState(false)

  const runTests = async () => {
    console.log('🔄 Firebase 연결 테스트를 시작합니다...')

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
          image_url: 'https://cdn.imweb.me/thumbnail/20240407/bc0c4be6c9ec1.png'
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
          image_url: 'https://cdn.imweb.me/thumbnail/20240407/64e8e8a5e7a97.png'
        }
      ];

      setTestResults(prev => ({
        ...prev,
        message: '📝 샘플 리뷰 생성 중...'
      }));

      for (let i = 0; i < sampleReviews.length; i++) {
        const review = sampleReviews[i];
        await ReviewService.createReview(review);
        console.log(`✅ 샘플 리뷰 ${i + 1} 생성 완료:`, review.title);
      }

      setTestResults(prev => ({
        ...prev,
        message: `✅ ${sampleReviews.length}개의 샘플 리뷰가 성공적으로 생성되었습니다!`
      }));

      // 생성 후 기존 리뷰 조회
      setTimeout(() => {
        fetchExistingReviews();
      }, 1000);

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Firebase 연결 테스트</h1>
        
        <div className="grid gap-6 mb-8">
          <TestResult
            title="Firebase 기본 연결"
            connected={testResults.firebase.connected}
            error={testResults.firebase.error}
          />
          
          <TestResult
            title="Firestore 데이터베이스"
            connected={testResults.firestore.connected}
            error={testResults.firestore.error}
          />
          
          <TestResult
            title="Firebase Authentication"
            connected={testResults.auth.connected}
            error={testResults.auth.error}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">테스트 액션</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={runTests}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🔄 연결 테스트 재실행
            </button>
            
            <button
              onClick={createTestData}
              disabled={isCreatingTestData}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isCreatingTestData ? '⏳ 생성 중...' : '📝 테스트 데이터 생성'}
            </button>
            
            <button
              onClick={fetchExistingReviews}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              📋 기존 리뷰 조회
            </button>
            
            <button
              onClick={createSampleReviews}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              🎯 샘플 리뷰 생성
            </button>
          </div>
        </div>

        {testResults.message && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">결과</h2>
            <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded">
              {testResults.message}
            </pre>
          </div>
        )}
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
    <div className={`p-4 rounded-lg ${connected ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <span className={`px-2 py-1 rounded text-sm ${connected ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {connected ? '✅ 연결됨' : '❌ 연결 실패'}
        </span>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          오류: {error}
        </p>
      )}
    </div>
  )
} 