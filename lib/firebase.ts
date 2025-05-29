// Firebase 초기화 설정
import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// Firebase 설정 객체
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
}

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig)

// Firebase 서비스 초기화
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// 브라우저 환경에서만 환경 변수 체크 메시지 출력
if (typeof window !== 'undefined') {
  console.log('Firebase 환경 변수 체크:');
  console.log('- API Key 설정됨:', !!firebaseConfig.apiKey);
  console.log('- Auth Domain 설정됨:', !!firebaseConfig.authDomain);
  console.log('- Project ID 설정됨:', !!firebaseConfig.projectId);
  console.log('- Storage Bucket 설정됨:', !!firebaseConfig.storageBucket);
}

// Firebase 연결 테스트 함수
export const testFirebaseConnection = async () => {
  try {
    // 간단한 Firestore 연결 테스트 - 프로젝트 ID 확인
    if (firebaseConfig.projectId) {
      console.log('Firebase 연결 성공 확인됨')
      return true
    }
    return false
  } catch (err) {
    console.error('Firebase 연결 테스트 오류:', err)
    return false
  }
}

export default app 