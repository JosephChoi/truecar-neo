// Supabase Storage → Firebase Storage 이미지 마이그레이션 스크립트
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore')
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage')
const https = require('https')
const fs = require('fs')
const path = require('path')

// 환경 변수 직접 로드
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

// 환경 변수 파싱
const envVars = {}
envContent.split('\n').forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim()
    }
  }
})

// Firebase 초기화
const firebaseConfig = {
  apiKey: envVars.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: envVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

// 이미지 다운로드 함수
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    console.log(`📥 이미지 다운로드 중: ${url}`)
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`))
        return
      }
      
      const chunks = []
      
      response.on('data', (chunk) => {
        chunks.push(chunk)
      })
      
      response.on('end', () => {
        const buffer = Buffer.concat(chunks)
        console.log(`✅ 다운로드 완료: ${buffer.length} bytes`)
        resolve(buffer)
      })
      
      response.on('error', (error) => {
        console.error(`❌ 다운로드 오류: ${error.message}`)
        reject(error)
      })
    }).on('error', (error) => {
      console.error(`❌ 요청 오류: ${error.message}`)
      reject(error)
    })
  })
}

// Firebase Storage에 이미지 업로드 함수
async function uploadToFirebaseStorage(buffer, fileName) {
  try {
    console.log(`📤 Firebase Storage 업로드 중: ${fileName}`)
    
    // Firebase Storage 참조 생성
    const storageRef = ref(storage, `review-images/${fileName}`)
    
    // 메타데이터 설정
    const metadata = {
      contentType: 'image/jpeg',
      customMetadata: {
        'migrated-from': 'supabase',
        'migration-date': new Date().toISOString()
      }
    }
    
    // 업로드 실행
    const snapshot = await uploadBytes(storageRef, buffer, metadata)
    
    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    console.log(`✅ Firebase 업로드 성공: ${downloadURL}`)
    return downloadURL
    
  } catch (error) {
    console.error(`❌ Firebase 업로드 오류: ${error.message}`)
    throw error
  }
}

// Supabase URL에서 파일명 추출 함수
function extractFileNameFromSupabaseUrl(url) {
  try {
    // URL 형식: https://dohupnobncsnpbjwuokl.supabase.co/storage/v1/object/public/review-images/reviews/review-1746281324702.jpg
    const urlParts = url.split('/')
    const fileName = urlParts[urlParts.length - 1] // 마지막 부분이 파일명
    return fileName
  } catch (error) {
    console.error('파일명 추출 오류:', error)
    return `migrated-${Date.now()}.jpg`
  }
}

// 이미지 마이그레이션 함수
async function migrateImage(supabaseUrl) {
  try {
    console.log(`\n🔄 이미지 마이그레이션 시작: ${supabaseUrl}`)
    
    // 1. Supabase에서 이미지 다운로드
    const imageBuffer = await downloadImage(supabaseUrl)
    
    // 2. 파일명 생성
    const originalFileName = extractFileNameFromSupabaseUrl(supabaseUrl)
    const newFileName = `migrated-${Date.now()}-${originalFileName}`
    
    // 3. Firebase Storage에 업로드
    const firebaseUrl = await uploadToFirebaseStorage(imageBuffer, newFileName)
    
    console.log(`✅ 이미지 마이그레이션 완료: ${supabaseUrl} → ${firebaseUrl}`)
    return firebaseUrl
    
  } catch (error) {
    console.error(`❌ 이미지 마이그레이션 실패: ${supabaseUrl}`, error)
    throw error
  }
}

// Firestore 리뷰 이미지 URL 업데이트 함수
async function updateReviewImageUrl(reviewId, newImageUrl) {
  try {
    console.log(`📝 리뷰 이미지 URL 업데이트: ${reviewId}`)
    
    const reviewRef = doc(db, 'reviews', reviewId)
    await updateDoc(reviewRef, {
      image_url: newImageUrl,
      migrated_at: new Date(),
      migration_status: 'completed'
    })
    
    console.log(`✅ 리뷰 URL 업데이트 완료: ${reviewId}`)
    
  } catch (error) {
    console.error(`❌ 리뷰 URL 업데이트 오류: ${reviewId}`, error)
    throw error
  }
}

// 모든 리뷰의 이미지 마이그레이션 함수
async function migrateAllReviewImages() {
  console.log('🚀 전체 리뷰 이미지 마이그레이션 시작')
  console.log('=====================================')
  
  try {
    // 1. Firestore에서 모든 리뷰 가져오기
    console.log('📊 Firestore에서 리뷰 데이터 조회 중...')
    const reviewsRef = collection(db, 'reviews')
    const querySnapshot = await getDocs(reviewsRef)
    
    const reviews = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.image_url && data.image_url.includes('supabase.co')) {
        reviews.push({
          id: doc.id,
          ...data
        })
      }
    })
    
    console.log(`📋 Supabase 이미지가 있는 리뷰: ${reviews.length}개`)
    
    if (reviews.length === 0) {
      console.log('⚠️ 마이그레이션할 Supabase 이미지가 없습니다.')
      return
    }
    
    // 2. 각 리뷰의 이미지 마이그레이션
    const results = {
      success: 0,
      failed: 0,
      errors: []
    }
    
    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i]
      console.log(`\n진행률: ${i + 1}/${reviews.length}`)
      console.log(`리뷰: ${review.title} (${review.author})`)
      console.log(`기존 URL: ${review.image_url}`)
      
      try {
        // 이미지 마이그레이션
        const newImageUrl = await migrateImage(review.image_url)
        
        // Firestore 업데이트
        await updateReviewImageUrl(review.id, newImageUrl)
        
        results.success++
        console.log(`✅ 성공: ${review.title}`)
        
        // API 제한 방지를 위한 대기
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        results.failed++
        results.errors.push({
          review: review.title,
          error: error.message
        })
        console.log(`❌ 실패: ${review.title} - ${error.message}`)
      }
    }
    
    // 3. 결과 요약
    console.log('\n🎉 이미지 마이그레이션 완료!')
    console.log('=====================================')
    console.log(`✅ 성공: ${results.success}개`)
    console.log(`❌ 실패: ${results.failed}개`)
    
    if (results.errors.length > 0) {
      console.log('\n❌ 실패한 이미지들:')
      results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.review}: ${error.error}`)
      })
    }
    
    // 4. 백업 생성
    const migrationReport = {
      migration_date: new Date().toISOString(),
      total_reviews: reviews.length,
      successful_migrations: results.success,
      failed_migrations: results.failed,
      errors: results.errors,
      firebase_storage_bucket: envVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    }
    
    const reportFileName = `image-migration-report-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.json`
    fs.writeFileSync(reportFileName, JSON.stringify(migrationReport, null, 2))
    console.log(`📊 마이그레이션 보고서 생성: ${reportFileName}`)
    
  } catch (error) {
    console.error('❌ 전체 마이그레이션 오류:', error)
    throw error
  }
}

// 개별 이미지 테스트 함수
async function testImageMigration() {
  console.log('🧪 이미지 마이그레이션 테스트 시작')
  
  const testUrl = 'https://dohupnobncsnpbjwuokl.supabase.co/storage/v1/object/public/review-images/reviews/review-1746281324702.jpg'
  
  try {
    const newUrl = await migrateImage(testUrl)
    console.log(`✅ 테스트 성공: ${newUrl}`)
  } catch (error) {
    console.error(`❌ 테스트 실패:`, error)
  }
}

// 메인 실행 함수
async function main() {
  console.log('🖼️ Supabase → Firebase 이미지 마이그레이션')
  console.log('=====================================')
  console.log('Firebase 프로젝트:', envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
  console.log('Storage 버킷:', envVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
  console.log('=====================================')
  
  try {
    const args = process.argv.slice(2)
    
    if (args.includes('--test')) {
      // 테스트 모드
      await testImageMigration()
    } else {
      // 전체 마이그레이션
      console.log('\n⏳ 5초 후 이미지 마이그레이션을 시작합니다...')
      console.log('주의: 이 작업은 시간이 많이 걸릴 수 있습니다.')
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      await migrateAllReviewImages()
    }
    
    console.log('\n🎉 작업 완료!')
    
  } catch (error) {
    console.error('❌ 메인 함수 오류:', error)
    process.exit(1)
  }
}

// 스크립트 실행
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  migrateImage,
  migrateAllReviewImages,
  testImageMigration
} 