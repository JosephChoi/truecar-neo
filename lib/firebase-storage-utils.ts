import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage'
import { storage } from './firebase'

// Firebase Storage 관련 상수
const STORAGE_BUCKETS = {
  REVIEW_IMAGES: 'review-images',
  PROFILE_IMAGES: 'profile-images',
  GENERAL: 'uploads'
} as const

export class FirebaseStorageService {
  // 이미지 업로드 (리뷰 이미지)
  static async uploadReviewImage(file: File, reviewId?: string): Promise<string> {
    try {
      const fileName = reviewId 
        ? `${reviewId}_${Date.now()}_${file.name}`
        : `${Date.now()}_${file.name}`
      
      const imageRef = ref(storage, `${STORAGE_BUCKETS.REVIEW_IMAGES}/${fileName}`)
      
      // 파일 업로드
      const snapshot = await uploadBytes(imageRef, file)
      
      // 다운로드 URL 가져오기
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      console.log('이미지 업로드 성공:', downloadURL)
      return downloadURL
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
      throw new Error('이미지 업로드에 실패했습니다.')
    }
  }

  // Base64 이미지 업로드
  static async uploadBase64Image(dataUrl: string, filePath: string): Promise<string> {
    try {
      // Base64 데이터 URL을 Blob으로 변환
      const base64Data = dataUrl.split(',')[1]
      const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0]
      
      // Base64를 바이너리로 변환
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: mimeType })
      
      // Firebase Storage에 업로드
      const imageRef = ref(storage, filePath)
      const snapshot = await uploadBytes(imageRef, blob)
      
      // 다운로드 URL 가져오기
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      console.log('Base64 이미지 업로드 성공:', downloadURL)
      return downloadURL
    } catch (error) {
      console.error('Base64 이미지 업로드 오류:', error)
      throw new Error('Base64 이미지 업로드에 실패했습니다.')
    }
  }

  // 프로필 이미지 업로드
  static async uploadProfileImage(file: File, userId: string): Promise<string> {
    try {
      const fileName = `${userId}_${Date.now()}_${file.name}`
      const imageRef = ref(storage, `${STORAGE_BUCKETS.PROFILE_IMAGES}/${fileName}`)
      
      const snapshot = await uploadBytes(imageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      console.log('프로필 이미지 업로드 성공:', downloadURL)
      return downloadURL
    } catch (error) {
      console.error('프로필 이미지 업로드 오류:', error)
      throw new Error('프로필 이미지 업로드에 실패했습니다.')
    }
  }

  // 일반 파일 업로드
  static async uploadFile(file: File, folder?: string): Promise<string> {
    try {
      const folderPath = folder || STORAGE_BUCKETS.GENERAL
      const fileName = `${Date.now()}_${file.name}`
      const fileRef = ref(storage, `${folderPath}/${fileName}`)
      
      const snapshot = await uploadBytes(fileRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      console.log('파일 업로드 성공:', downloadURL)
      return downloadURL
    } catch (error) {
      console.error('파일 업로드 오류:', error)
      throw new Error('파일 업로드에 실패했습니다.')
    }
  }

  // 이미지 삭제 (URL에서 경로 추출)
  static async deleteImageByUrl(imageUrl: string): Promise<void> {
    try {
      // Firebase Storage URL에서 파일 경로 추출
      const urlParts = imageUrl.split('/o/')
      if (urlParts.length < 2) {
        throw new Error('유효하지 않은 Firebase Storage URL입니다.')
      }
      
      const filePath = decodeURIComponent(urlParts[1].split('?')[0])
      const imageRef = ref(storage, filePath)
      
      await deleteObject(imageRef)
      console.log('이미지 삭제 성공:', filePath)
    } catch (error) {
      console.error('이미지 삭제 오류:', error)
      throw new Error('이미지 삭제에 실패했습니다.')
    }
  }

  // 특정 폴더의 모든 파일 목록 가져오기
  static async listFiles(folderPath: string): Promise<string[]> {
    try {
      const folderRef = ref(storage, folderPath)
      const result = await listAll(folderRef)
      
      const urls: string[] = []
      for (const itemRef of result.items) {
        const url = await getDownloadURL(itemRef)
        urls.push(url)
      }
      
      return urls
    } catch (error) {
      console.error('파일 목록 조회 오류:', error)
      throw new Error('파일 목록 조회에 실패했습니다.')
    }
  }

  // 파일 메타데이터 가져오기
  static async getFileMetadata(filePath: string) {
    try {
      const fileRef = ref(storage, filePath)
      const metadata = await getMetadata(fileRef)
      
      return {
        name: metadata.name,
        size: metadata.size,
        contentType: metadata.contentType,
        timeCreated: metadata.timeCreated,
        updated: metadata.updated
      }
    } catch (error) {
      console.error('파일 메타데이터 조회 오류:', error)
      throw new Error('파일 메타데이터 조회에 실패했습니다.')
    }
  }

  // 이미지 파일 유효성 검사
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    // 파일 크기 검사 (5MB 제한)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: '파일 크기가 5MB를 초과할 수 없습니다.'
      }
    }

    // 파일 타입 검사
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'JPG, PNG, WebP 형식의 이미지만 업로드 가능합니다.'
      }
    }

    return { isValid: true }
  }

  // 이미지 파일 압축 (선택적 기능)
  static async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // 최대 크기 설정 (예: 1200px)
        const maxWidth = 1200
        const maxHeight = 1200
        
        let { width, height } = img
        
        // 비율 유지하면서 크기 조정
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // 이미지 그리기
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Blob으로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              reject(new Error('이미지 압축에 실패했습니다.'))
            }
          },
          file.type,
          quality
        )
      }

      img.onerror = () => reject(new Error('이미지 로드에 실패했습니다.'))
      img.src = URL.createObjectURL(file)
    })
  }
}

// 스토리지 버킷 상수 내보내기
export { STORAGE_BUCKETS } 