import { reviewData } from "./review-data";

// 리뷰 타입 정의
export interface OrderDetail {
  vehicleType: string;
  budget: string;
  mileage: string;
  preferredColor: string;
  repairHistory: string;
  referenceSite: string;
  imageUrl?: string;
}

export interface Review {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  views: number;
  imageUrl?: string; // 리뷰 이미지 URL (주문 내역과 별개로 존재 가능)
  orderDetail: OrderDetail; // 필수 항목으로 변경
}

const REVIEWS_STORAGE_KEY = 'truecar_reviews';
const REVIEWS_INDEX_KEY = 'truecar_reviews_index';
const IMAGE_STORAGE_PREFIX = 'truecar_review_img_';
const MAX_IMAGE_SIZE = 512 * 1024; // 512KB로 제한 감소
const LOCAL_STORAGE_KEY = 'truecar-reviews';
const LOCAL_STORAGE_IMAGES_KEY = 'truecar-review-images';

// 클라이언트 사이드 환경인지 확인하는 함수
function isClientSide(): boolean {
  return typeof window !== 'undefined';
}

// 안전하게 localStorage 접근하기
function safelyAccessStorage<T>(operation: () => T, fallback: T): T {
  // 서버 사이드 렌더링 중에는 fallback 반환
  if (!isClientSide()) {
    return fallback;
  }
  
  try {
    return operation();
  } catch (error) {
    console.error('localStorage 접근 오류:', error);
    return fallback;
  }
}

// 큰 이미지 데이터를 별도 저장하는 함수
function storeImageSeparately(reviewId: string, imageData: string | undefined): string | undefined {
  if (!imageData) return undefined;
  
  try {
    // 너무 큰 이미지는 sessionStorage에 저장 (브라우저 세션 동안만 유지)
    if (imageData.length > MAX_IMAGE_SIZE) {
      const imageKey = `${IMAGE_STORAGE_PREFIX}${reviewId}`;
      sessionStorage.setItem(imageKey, imageData);
      return `session:${imageKey}`; // session: prefix로 세션스토리지에 있음을 표시
    }
    
    // 적절한 크기는 그대로 반환
    return imageData;
  } catch (error) {
    console.error('이미지 저장 오류:', error);
    return undefined;
  }
}

// 이미지 데이터 불러오기 함수
function loadImageData(imageRef: string | undefined): string | undefined {
  if (!imageRef) return undefined;
  
  // 세션스토리지에서 불러오기
  if (imageRef.startsWith('session:')) {
    try {
      const imageKey = imageRef.substring(8); // 'session:' 접두사 제거
      return sessionStorage.getItem(imageKey) || undefined;
    } catch (error) {
      console.error('세션스토리지 이미지 로드 오류:', error);
      return undefined;
    }
  }
  
  // 일반 이미지 URL 그대로 반환
  return imageRef;
}

// 이미지 URL 크기 제한 함수
function limitImageSize(imageUrl: string | undefined): string | undefined {
  if (!imageUrl) return undefined;
  
  // 데이터 URL인 경우에만 크기 체크
  if (imageUrl.startsWith('data:')) {
    // 대략적인 Base64 문자열 길이 계산 (4/3 * 원본 크기)
    const base64Length = imageUrl.length - imageUrl.indexOf(',') - 1;
    const approximateSize = (base64Length * 3) / 4;
    
    if (approximateSize > MAX_IMAGE_SIZE) {
      console.warn('이미지 크기가 너무 큽니다. 수정이 필요합니다.');
      return undefined;
    }
  }
  
  return imageUrl;
}

// 안전하게 localStorage에 저장하는 함수
function safeLocalStorageSave(key: string, data: any): boolean {
  return safelyAccessStorage(() => {
    try {
      const jsonString = JSON.stringify(data);
      localStorage.setItem(key, jsonString);
      return true;
    } catch (error) {
      console.error('localStorage 저장 오류:', error);
      
      // 할당량 초과 오류인 경우 특별 처리
      if (error instanceof DOMException && 
          (error.name === 'QuotaExceededError' || error.message.includes('quota'))) {
        console.error('로컬스토리지 할당량이 초과되었습니다. 데이터를 정리하세요.');
        
        // 중요: 실제 프로덕션 환경에서는 여기서 사용자에게 알림 표시 또는
        // 이전 데이터 정리를 제안하는 로직이 필요할 수 있음
        throw new Error('로컬스토리지 할당량 초과: 이미지 크기를 줄이거나 일부 데이터를 삭제하세요');
      }
      
      return false;
    }
  }, false);
}

// 로컬 스토리지 크기를 KB 단위로 계산
export function getLocalStorageSize(): number {
  let totalSize = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        totalSize += key.length + value.length;
      }
    }
    // 바이트를 KB로 변환 (2바이트/문자 * 문자 수 / 1024)
    return (totalSize * 2) / 1024;
  } catch (e) {
    console.error('로컬 스토리지 크기 계산 중 오류:', e);
    return 0;
  }
}

// 로컬 스토리지 할당량 초과 오류인지 확인
function isQuotaExceededError(error: unknown): boolean {
  return (
    error instanceof DOMException && 
    (error.name === 'QuotaExceededError' || 
     error.name === 'NS_ERROR_DOM_QUOTA_REACHED' || // Firefox
     error.code === 22 || // Chrome
     error.message.includes('exceeded') || 
     error.message.includes('quota'))
  );
}

// 이미지를 별도 저장소에 저장
function storeImage(id: string, imageUrl: string): boolean {
  try {
    // 크기가 큰 이미지는 세션 스토리지에 저장 시도
    if (imageUrl && imageUrl.length > 800 * 1024) { // 800KB 이상
      sessionStorage.setItem(`image_${id}`, imageUrl);
      return true;
    }
    
    // 일반 크기 이미지는 로컬 스토리지 이미지 저장소에 저장
    const images = loadImages();
    images[id] = imageUrl;
    localStorage.setItem(LOCAL_STORAGE_IMAGES_KEY, JSON.stringify(images));
    return true;
  } catch (error) {
    console.error('이미지 저장 중 오류:', error);
    
    if (isQuotaExceededError(error)) {
      throw new Error('로컬 스토리지 할당량 초과: 이미지 저장 실패');
    }
    
    return false;
  }
}

// 이미지 로드
function loadImage(id: string): string | null {
  try {
    // 먼저 세션 스토리지에서 확인
    const sessionImage = sessionStorage.getItem(`image_${id}`);
    if (sessionImage) {
      return sessionImage;
    }
    
    // 없으면 로컬 스토리지 이미지 저장소에서 확인
    const images = loadImages();
    return images[id] || null;
  } catch (error) {
    console.error('이미지 로드 중 오류:', error);
    return null;
  }
}

// 이미지 저장소 로드
function loadImages(): Record<string, string> {
  try {
    const imagesJson = localStorage.getItem(LOCAL_STORAGE_IMAGES_KEY);
    return imagesJson ? JSON.parse(imagesJson) : {};
  } catch (error) {
    console.error('이미지 저장소 로드 중 오류:', error);
    return {};
  }
}

// 이미지 삭제
function removeImage(id: string): boolean {
  try {
    // 세션 스토리지에서 삭제
    sessionStorage.removeItem(`image_${id}`);
    
    // 로컬 스토리지 이미지 저장소에서 삭제
    const images = loadImages();
    if (images[id]) {
      delete images[id];
      localStorage.setItem(LOCAL_STORAGE_IMAGES_KEY, JSON.stringify(images));
    }
    
    return true;
  } catch (error) {
    console.error('이미지 삭제 중 오류:', error);
    return false;
  }
}

// 초기 데이터 로드 (localStorage에 없으면 기본 데이터 사용)
export function initializeReviews(): void {
  if (!isClientSide()) return; // 서버 사이드에서 실행 시 무시
  
  safelyAccessStorage(() => {
    try {
      const existingReviews = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (!existingReviews) {
        safeLocalStorageSave(REVIEWS_STORAGE_KEY, reviewData);
      }
    } catch (error) {
      console.error('리뷰 데이터 초기화 오류:', error);
    }
  }, undefined);
}

// 모든 리뷰 가져오기
export function getAllReviews(): Review[] {
  return safelyAccessStorage(() => {
    try {
      const reviews = localStorage.getItem(REVIEWS_STORAGE_KEY);
      const parsedReviews = reviews ? JSON.parse(reviews) : [];
      
      // 세션스토리지에 저장된 이미지 참조 처리
      return parsedReviews.map((review: Review) => {
        // 이미지 처리
        if (review.imageUrl?.startsWith('session:')) {
          const imageData = loadImageData(review.imageUrl);
          return { ...review, imageUrl: imageData };
        }
        
        return review;
      });
    } catch (error) {
      console.error('리뷰 데이터 로드 오류:', error);
      return [];
    }
  }, reviewData); // 서버 사이드에서는 기본 데이터 반환
}

// 특정 ID의 리뷰 가져오기
export function getReviewById(id: string): Review | undefined {
  if (!id) return undefined;
  
  return safelyAccessStorage(() => {
    try {
      const reviews = getAllReviews();
      return reviews.find(review => review.id === id);
    } catch (error) {
      console.error(`ID ${id}의 리뷰 조회 오류:`, error);
      return undefined;
    }
  }, undefined);
}

// 새 리뷰 추가
export function addReview(reviewData: Omit<Review, 'id' | 'views'>): Review | null {
  return safelyAccessStorage(() => {
    try {
      const reviews = getAllReviews();
      
      // 새 ID 생성 (현재 가장 큰 ID + 1)
      const maxId = Math.max(...reviews.map(r => parseInt(r.id) || 0), 0);
      const newId = (maxId + 1).toString();
      
      // 이미지 처리 - 크기에 따라 저장 방식 결정
      const imageUrl = reviewData.imageUrl 
        ? storeImageSeparately(newId, reviewData.imageUrl)
        : undefined;
      
      const newReview: Review = {
        ...reviewData,
        imageUrl,
        orderDetail: reviewData.orderDetail,  // 항상 포함됨 (필수 항목)
        id: newId,
        views: 0
      };
      
      // 세션스토리지 이미지 참조를 담은 버전으로 저장
      const storageReview = { ...newReview };
      
      const updatedReviews = [...reviews, storageReview];
      
      if (!safeLocalStorageSave(REVIEWS_STORAGE_KEY, updatedReviews)) {
        throw new Error('로컬스토리지 저장 실패');
      }
      
      // 완전한 이미지 데이터가 포함된 버전 반환
      return newReview;
    } catch (error) {
      console.error('리뷰 추가 오류:', error);
      throw error; // 호출자가 처리할 수 있도록 오류 전파
    }
  }, null);
}

// 리뷰 수정
export function updateReview(id: string, reviewData: Partial<Review>): Review | null {
  if (!id) return null;
  
  return safelyAccessStorage(() => {
    try {
      const reviews = getAllReviews();
      const reviewIndex = reviews.findIndex(r => r.id === id);
      
      if (reviewIndex === -1) return null;
      
      // 이미지 처리 - 크기에 따라 저장 방식 결정
      const imageUrl = reviewData.imageUrl 
        ? storeImageSeparately(id, reviewData.imageUrl)
        : reviews[reviewIndex].imageUrl;
      
      // 주문 내역 정보 업데이트
      const orderDetail = reviewData.orderDetail || reviews[reviewIndex].orderDetail;
      
      const updatedReview = {
        ...reviews[reviewIndex],
        ...reviewData,
        imageUrl,
        orderDetail, // 항상 포함됨 (필수 항목)
        id // ID는 변경하지 않음
      };
      
      // 세션스토리지 이미지 참조를 담은 버전으로 저장
      const storageReview = { ...updatedReview };
      
      const updatedReviews = [...reviews];
      updatedReviews[reviewIndex] = storageReview;
      
      if (!safeLocalStorageSave(REVIEWS_STORAGE_KEY, updatedReviews)) {
        throw new Error('로컬스토리지 저장 실패');
      }
      
      // 완전한 이미지 데이터가 포함된 버전 반환
      return updatedReview;
    } catch (error) {
      console.error('리뷰 수정 오류:', error);
      throw error; // 호출자가 처리할 수 있도록 오류 전파
    }
  }, null);
}

// 리뷰 삭제
export function deleteReview(id: string): boolean {
  if (!id) return false;
  
  return safelyAccessStorage(() => {
    try {
      const reviews = getAllReviews();
      
      // 삭제할 리뷰 찾기
      const reviewToDelete = reviews.find(r => r.id === id);
      if (!reviewToDelete) return false;
      
      // 세션스토리지에 저장된 이미지 정리
      try {
        if (reviewToDelete.imageUrl?.startsWith('session:')) {
          const imageKey = reviewToDelete.imageUrl.substring(8);
          sessionStorage.removeItem(imageKey);
        }
      } catch (e) {
        console.warn('이미지 정리 중 오류:', e);
        // 이미지 정리 실패는 리뷰 삭제에 영향을 주지 않도록 처리
      }
      
      const updatedReviews = reviews.filter(r => r.id !== id);
      
      return safeLocalStorageSave(REVIEWS_STORAGE_KEY, updatedReviews);
    } catch (error) {
      console.error(`ID ${id}의 리뷰 삭제 오류:`, error);
      return false;
    }
  }, false);
}

// 조회수 증가
export function incrementViews(id: string): void {
  if (!id) return;
  
  safelyAccessStorage(() => {
    try {
      const reviews = getAllReviews();
      const reviewIndex = reviews.findIndex(r => r.id === id);
      
      if (reviewIndex !== -1) {
        const updatedReview = {
          ...reviews[reviewIndex],
          views: reviews[reviewIndex].views + 1
        };
        
        const updatedReviews = [...reviews];
        updatedReviews[reviewIndex] = updatedReview;
        
        safeLocalStorageSave(REVIEWS_STORAGE_KEY, updatedReviews);
      }
    } catch (error) {
      console.error(`ID ${id}의 조회수 증가 오류:`, error);
    }
  }, undefined);
}

// 로컬스토리지 정리 (오래된 데이터 삭제)
export function cleanupStorage(): boolean {
  return safelyAccessStorage(() => {
    try {
      // 이 함수는 실제 앱에서 로컬스토리지가 가득 찼을 때 호출될 수 있습니다
      // 예: 오래된 리뷰 삭제, 사용하지 않는 데이터 정리 등
      
      // 세션스토리지 이미지 참조 정리
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(IMAGE_STORAGE_PREFIX)) {
          // 해당 키가 현재 리뷰에서 사용 중인지 확인하는 로직 필요
          // 사용되지 않으면 삭제
        }
      }
      
      return true;
    } catch (error) {
      console.error('스토리지 정리 오류:', error);
      return false;
    }
  }, false);
}

// 로컬스토리지 데이터 지우기 (테스트용)
export function clearReviews(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_IMAGES_KEY);
    
    // 세션 스토리지의 이미지 데이터도 제거
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('image_')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('리뷰 데이터 초기화 중 오류:', error);
  }
} 