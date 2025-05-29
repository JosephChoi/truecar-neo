import { Timestamp } from 'firebase/firestore'

// Firebase Firestore용 기본 타입 정의
export type FirestoreTimestamp = Timestamp | Date | string | null

// 리뷰 문서 타입 (Firestore 컬렉션: reviews)
export interface Review {
  id: string
  title: string
  content: string
  rating: number
  created_at: FirestoreTimestamp
  updated_at: FirestoreTimestamp
  user_id: string | null
  status: string | null
  image_url: string | null
  metadata: Record<string, any> | null
  author: string | null
  date: string | null
  vehicle_type: string | null
  budget: string | null
  mileage: string | null
  preferred_color: string | null
  repair_history: string | null
  reference_site: string | null
  views: number | null
}

// 리뷰 생성용 타입 (ID는 Firestore에서 자동 생성)
export interface ReviewCreate {
  title: string
  content: string
  rating: number
  user_id?: string | null
  status?: string | null
  image_url?: string | null
  metadata?: Record<string, any> | null
  author?: string | null
  date?: string | null
  vehicle_type?: string | null
  budget?: string | null
  mileage?: string | null
  preferred_color?: string | null
  repair_history?: string | null
  reference_site?: string | null
  views?: number | null
}

// 리뷰 업데이트용 타입 (모든 필드 선택적)
export interface ReviewUpdate {
  title?: string
  content?: string
  rating?: number
  user_id?: string | null
  status?: string | null
  image_url?: string | null
  metadata?: Record<string, any> | null
  author?: string | null
  date?: string | null
  vehicle_type?: string | null
  budget?: string | null
  mileage?: string | null
  preferred_color?: string | null
  repair_history?: string | null
  reference_site?: string | null
  views?: number | null
  updated_at?: FirestoreTimestamp
}

// 관리자 사용자 타입 (Firestore 컬렉션: admin_users)
export interface AdminUser {
  id: string
  email: string
  created_at: FirestoreTimestamp
}

// 관리자 사용자 생성용 타입
export interface AdminUserCreate {
  email: string
}

// Firebase Auth 사용자 정보 타입
export interface FirebaseUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
}

// Firestore 컬렉션 이름 상수
export const COLLECTIONS = {
  REVIEWS: 'reviews',
  ADMIN_USERS: 'admin_users',
  USERS: 'users'
} as const

// 리뷰 상태 상수
export const REVIEW_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
} as const

// 차량 타입 상수
export const VEHICLE_TYPES = {
  SEDAN: 'sedan',
  SUV: 'suv',
  HATCHBACK: 'hatchback',
  WAGON: 'wagon',
  COUPE: 'coupe',
  CONVERTIBLE: 'convertible'
} as const 