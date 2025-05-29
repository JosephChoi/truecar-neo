import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  serverTimestamp,
  increment
} from 'firebase/firestore'
import { db } from './firebase'
import {
  Review,
  ReviewCreate,
  ReviewUpdate,
  AdminUser,
  AdminUserCreate,
  COLLECTIONS,
  REVIEW_STATUS
} from './firestore.types'

// 리뷰 관련 함수들
export class ReviewService {
  private static collectionRef = collection(db, COLLECTIONS.REVIEWS)

  // 모든 리뷰 조회 (페이징 지원) - 최적화된 쿼리 복원
  static async getAllReviews(pageSize: number = 10, lastDoc?: any) {
    try {
      let q = query(
        this.collectionRef,
        where('status', '==', REVIEW_STATUS.ACTIVE),
        orderBy('created_at', 'desc'),
        limit(pageSize)
      )

      if (lastDoc) {
        q = query(q, startAfter(lastDoc))
      }

      const snapshot = await getDocs(q)
      const reviews: Review[] = []
      
      snapshot.forEach((doc) => {
        reviews.push({
          id: doc.id,
          ...doc.data()
        } as Review)
      })

      return {
        reviews,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === pageSize
      }
    } catch (error) {
      console.error('리뷰 목록 조회 오류:', error)
      throw error
    }
  }

  // 특정 리뷰 조회
  static async getReviewById(id: string): Promise<Review | null> {
    try {
      const docRef = doc(db, COLLECTIONS.REVIEWS, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Review
      }
      
      return null
    } catch (error) {
      console.error('리뷰 조회 오류:', error)
      throw error
    }
  }

  // 리뷰 생성
  static async createReview(reviewData: ReviewCreate): Promise<string> {
    try {
      const newReview = {
        ...reviewData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        status: REVIEW_STATUS.ACTIVE,
        views: 0
      }

      const docRef = await addDoc(this.collectionRef, newReview)
      return docRef.id
    } catch (error) {
      console.error('리뷰 생성 오류:', error)
      throw error
    }
  }

  // 리뷰 업데이트
  static async updateReview(id: string, updateData: ReviewUpdate): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.REVIEWS, id)
      await updateDoc(docRef, {
        ...updateData,
        updated_at: serverTimestamp()
      })
    } catch (error) {
      console.error('리뷰 업데이트 오류:', error)
      throw error
    }
  }

  // 리뷰 삭제 (실제로는 상태를 inactive로 변경)
  static async deleteReview(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.REVIEWS, id)
      await updateDoc(docRef, {
        status: REVIEW_STATUS.INACTIVE,
        updated_at: serverTimestamp()
      })
    } catch (error) {
      console.error('리뷰 삭제 오류:', error)
      throw error
    }
  }

  // 리뷰 조회수 증가 (중복 방지 기능 포함)
  static async incrementViews(id: string, userId?: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.REVIEWS, id)
      
      // 중복 조회 방지를 위한 세션 스토리지 체크 (선택적)
      if (typeof window !== 'undefined') {
        const viewKey = `review_viewed_${id}`
        const lastViewed = sessionStorage.getItem(viewKey)
        const now = Date.now()
        
        // 같은 세션에서 5분 이내 재방문시 조회수 증가 안함
        if (lastViewed && (now - parseInt(lastViewed)) < 5 * 60 * 1000) {
          console.log('중복 조회로 인한 조회수 증가 생략')
          return
        }
        
        // 조회 시간 기록
        sessionStorage.setItem(viewKey, now.toString())
      }
      
      // Firestore에서 원자적으로 조회수 증가
      await updateDoc(docRef, {
        views: increment(1),
        last_viewed_at: serverTimestamp()
      })
      
      console.log(`리뷰 ${id} 조회수 증가 완료`)
    } catch (error) {
      console.error('조회수 증가 오류:', error)
      throw error
    }
  }

  // 차량 타입별 리뷰 조회 - 최적화된 쿼리 복원
  static async getReviewsByVehicleType(vehicleType: string, pageSize: number = 10) {
    try {
      const q = query(
        this.collectionRef,
        where('vehicle_type', '==', vehicleType),
        where('status', '==', REVIEW_STATUS.ACTIVE),
        orderBy('created_at', 'desc'),
        limit(pageSize)
      )

      const snapshot = await getDocs(q)
      const reviews: Review[] = []
      
      snapshot.forEach((doc) => {
        reviews.push({
          id: doc.id,
          ...doc.data()
        } as Review)
      })

      return reviews
    } catch (error) {
      console.error('차량 타입별 리뷰 조회 오류:', error)
      throw error
    }
  }

  // 인기 리뷰 조회 (조회수 기준) - 캐시 기능 추가
  static async getPopularReviews(pageSize: number = 10, useCache: boolean = true) {
    try {
      // 캐시 확인 (5분간 유효)
      if (useCache && typeof window !== 'undefined') {
        const cacheKey = 'popular_reviews_cache'
        const cacheTimeKey = 'popular_reviews_cache_time'
        const cached = localStorage.getItem(cacheKey)
        const cacheTime = localStorage.getItem(cacheTimeKey)
        
        if (cached && cacheTime) {
          const age = Date.now() - parseInt(cacheTime)
          if (age < 5 * 60 * 1000) { // 5분 이내라면 캐시 사용
            return JSON.parse(cached)
          }
        }
      }

      const q = query(
        this.collectionRef,
        where('status', '==', REVIEW_STATUS.ACTIVE),
        orderBy('views', 'desc'),
        limit(pageSize)
      )

      const snapshot = await getDocs(q)
      const reviews: Review[] = []
      
      snapshot.forEach((doc) => {
        reviews.push({
          id: doc.id,
          ...doc.data()
        } as Review)
      })

      // 결과 캐시 저장
      if (useCache && typeof window !== 'undefined') {
        localStorage.setItem('popular_reviews_cache', JSON.stringify(reviews))
        localStorage.setItem('popular_reviews_cache_time', Date.now().toString())
      }

      return reviews
    } catch (error) {
      console.error('인기 리뷰 조회 오류:', error)
      throw error
    }
  }

  // 조회수 통계 조회
  static async getViewsStats() {
    try {
      const snapshot = await getDocs(
        query(
          this.collectionRef,
          where('status', '==', REVIEW_STATUS.ACTIVE)
        )
      )

      let totalViews = 0
      let reviewCount = 0
      let maxViews = 0
      let minViews = Infinity

      snapshot.forEach((doc) => {
        const data = doc.data()
        const views = data.views || 0
        totalViews += views
        reviewCount++
        maxViews = Math.max(maxViews, views)
        minViews = Math.min(minViews, views)
      })

      const avgViews = reviewCount > 0 ? Math.round(totalViews / reviewCount) : 0

      return {
        totalViews,
        reviewCount,
        avgViews,
        maxViews: maxViews === -Infinity ? 0 : maxViews,
        minViews: minViews === Infinity ? 0 : minViews
      }
    } catch (error) {
      console.error('조회수 통계 조회 오류:', error)
      throw error
    }
  }
}

// 관리자 사용자 관련 함수들
export class AdminUserService {
  private static collectionRef = collection(db, COLLECTIONS.ADMIN_USERS)

  // 관리자 사용자 조회 (이메일로)
  static async getAdminByEmail(email: string): Promise<AdminUser | null> {
    try {
      const q = query(this.collectionRef, where('email', '==', email))
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0]
        return {
          id: doc.id,
          ...doc.data()
        } as AdminUser
      }
      
      return null
    } catch (error) {
      console.error('관리자 사용자 조회 오류:', error)
      throw error
    }
  }

  // 관리자 사용자 생성
  static async createAdmin(adminData: AdminUserCreate): Promise<string> {
    try {
      const newAdmin = {
        ...adminData,
        created_at: serverTimestamp()
      }

      const docRef = await addDoc(this.collectionRef, newAdmin)
      return docRef.id
    } catch (error) {
      console.error('관리자 사용자 생성 오류:', error)
      throw error
    }
  }

  // 관리자 권한 확인
  static async isAdmin(email: string): Promise<boolean> {
    try {
      const admin = await this.getAdminByEmail(email)
      return admin !== null
    } catch (error) {
      console.error('관리자 권한 확인 오류:', error)
      return false
    }
  }
}

// 날짜 변환 유틸리티
export const convertTimestamp = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate()
  }
  if (timestamp instanceof Date) {
    return timestamp
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp)
  }
  return new Date()
} 