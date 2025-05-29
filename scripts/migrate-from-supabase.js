// Supabase → Firebase 실제 데이터 마이그레이션 스크립트
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore')
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

// Supabase에서 조회한 실제 리뷰 데이터
const reviewsData = [
  {
    id: "c97af2c4-a71a-412b-8ae4-6175bcabc89d",
    title: "특별한 자동차도 잘 찾아 주셔서 감사합니다.",
    content: "제가 원하는 차량의 색상과 옵션을 구하기가 좀 힘들어서 \n여기저기 헤메다가 트루카에 한번 의뢰해 보았습니다. \n설마 하며 한두주를 기다리는데 그 사이 친절하게 접촉하고 계신 예비 후보차량들에 대한 정보를 꼼꼼히 알려주셨습니다. \n결국 딱 원하던 차량을 찾아주셨고 \n가격, 성능, 서비스 모든것에 만족합니다. \n내게 맞는 차량을 찾는 수고로움을 대신해 주신 트루카에 감사드립니다.",
    rating: 5,
    created_at: "2025-05-03 14:08:45.455+00",
    updated_at: "2025-05-03 14:08:45.455+00",
    status: "approved",
    image_url: "https://dohupnobncsnpbjwuokl.supabase.co/storage/v1/object/public/review-images/reviews/review-1746281324702.jpg",
    author: "김OO",
    date: "2024-08-30",
    vehicle_type: "미니",
    budget: "3000만원",
    mileage: "3만km이하",
    preferred_color: "스트라이프",
    repair_history: "무사고",
    reference_site: "엔카, 차차차",
    views: 4
  },
  {
    id: "80b96935-df24-4ef3-b304-03913ec429f6",
    title: "인생 첫 차를 찾아주셔서 감사합니다",
    content: "사회생활 시작후 2년간 뚜벅이로 지내다 지인의 추천으로 맞춤형 중고차를 알게 되었습니다.\n미혼이라 혼자 탈 차량 그리고 외국에서 학교를 다니다보니 작지만 힘이 좋은 차를 타고 싶었는데\n예산이 넉넉하지 못하여 고민하는 중에 신청하였습니다. 시세를 잘 몰라 막연하게 싸고 좋은 차를 구매하고 싶었지만\n사전 통화상담을 통해 제가 원하는 그리고 구매할 수 있는 차량을 선택하고 주문하였네요.\n2주가 지난 시점 즈음에 상품화된 차량을 보니 정말 저렴하게 좋은 차를 구하였구나!! 하는 생각이 들었습니다.\n한달 가량 운행한 결과 상당히 만족합니다. 옵션은 많지 않았지만 인생 첫차이다보니 꾸미는 재미도 있구요~ㅎ\n좋은 차 구해주셔서 감사합니다!!\n돈 많이 벌어 두번째 차는 신차로 하고 싶지만 현실적으로....ㅎㄷㄷ\n두번째는 좀더 업그레이된 차량으로 다시 주문하고 싶네요~~\n사업 번창하세요~~^^",
    rating: 5,
    created_at: "2025-04-28 13:49:11.582+00",
    updated_at: "2025-04-28 14:26:34.24+00",
    status: "approved",
    image_url: "https://dohupnobncsnpbjwuokl.supabase.co/storage/v1/object/public/review-images/reviews/review-1745848150930.jpg",
    author: "김대리",
    date: "2024-07-30",
    vehicle_type: "폭스바겐 골프",
    budget: "700만원",
    mileage: "10만km 내외",
    preferred_color: "흰색, 회색",
    repair_history: "단순교환",
    reference_site: "엔카, KB차차차",
    views: 15
  },
  {
    id: "45922886-470f-425b-88c3-a65acf00f3c0",
    title: "나의 이쁜 프댕이",
    content: "면허증을 취득하고 처음으로 내차를 구매하게 되었어요. 중고차 하시는 분도 모르고 여자 혼자 가기엔 좀 무서운..... 그런 느낌?\n지인에게서 추천을 받고 조심스럽게 의뢰해봤습니다. 처음엔 누구나 아는 아반떼를 생각했는데...\n원하는 연식과 무사고에서는 절대 구할 수 없음을......ㅠ\n그래서 비슷한 크기의 다른 차량을 비교해보고 프라이드가 맘에 들어서 정했습니다.\n생각한 예산보다 더 적은 금액으로 차를 찾았고 궁금해서 차를 구경하러 매장에 방문하였지요~ㅎㅎ\n아직 상품화(?)가 안되어 운전석에 잠시 앉아보고 눈으로만 구경하고 다시 집으로...\n3일 뒤 제차가 새차인 듯 깨끗하게 되어서 대표님께서 직접 갖다주신 모습에 감동받아\n중고차하시는 분들이 더이상 무섭지 않게 느껴졌어요~ㅋㅋㅋ\n제차를 오랫동안 탈 예정이지만 혹시나 바꾸게 된다면 또 이용할 거랍니다.\n물론 주위에서 중고차 산다는 사람들 있으면 알려주고요~~^^\n감사합니당~~~~",
    rating: 5,
    created_at: "2025-04-28 13:42:28.394+00",
    updated_at: "2025-04-28 14:17:08.851+00",
    status: "approved",
    image_url: "https://dohupnobncsnpbjwuokl.supabase.co/storage/v1/object/public/review-images/reviews/review-1745847748123.jpg",
    author: "파주오씨",
    date: "2024-07-28",
    vehicle_type: "더뉴프라이드",
    budget: "900만원이하",
    mileage: "8만km이하",
    preferred_color: "흰색",
    repair_history: "무사고",
    reference_site: "엔카",
    views: 8
  },
  {
    id: "087e438a-f265-4a9a-8b22-37856eb18d7c",
    title: "맥스크루즈를 처분하고 카니발을 취하다",
    content: "7년정도 탄 맥스크루즈!! 헤X딜러에 견적을 의뢰해놓고 카니발 신차는 6개월이상 걸린다고 하여 신차에 버금가는 중고차를 찾고 있었음.\n엔카사이트에서 일주일 정도 찾아보고 있었는데 너무너무 귀찮음. 가서 봐야하고 찾아보는데 시간도 낭비인 거 같고...\n직원이 추천해준 트루카 맞춤서비스를 이용해보니 2주일도 안되어 내가 찾던 차량을 찾았음. 엔카보다 쪼금 더 싼 느낌?\n트루카 대표는 광고비가 안들어가서 그 정도 빼줬다고 하는데 무슨 광고비인지는 안 물어봄.\n그리고 맥스크루즈 견적의뢰는 했는데 카니발을 구하지 못해 아직 상담도 못 받은 상황에서 혹시나 싶어 매입도 하냐고 물어보니 잘 물어봤음.\n매입도 한다고 해서 견적내 달라고 했는데... 생각한 금액과 별 차이가 없고 카니발 잘 구해주셨으니 트루카에 바로 넘김.\n귀찮아하는 내 성격에 딱이었음.\n후기는 남겨주면 감사하다는 말에 고민하다가 다음에 또 볼 수도 있으니...\n사업 번창하세요!!",
    rating: 5,
    created_at: "2025-04-28 13:39:41.223+00",
    updated_at: "2025-04-28 14:17:01.371+00",
    status: "approved",
    image_url: "https://dohupnobncsnpbjwuokl.supabase.co/storage/v1/object/public/review-images/reviews/review-1745847580541.jpg",
    author: "만사마",
    date: "2024-07-25",
    vehicle_type: "카니발4세대 노블리스",
    budget: "3400만원",
    mileage: "3만km 내외",
    preferred_color: "흰색",
    repair_history: "무사고",
    reference_site: "엔카",
    views: 12
  }
]

// Supabase에서 조회한 실제 관리자 데이터
const adminUsersData = [
  {
    id: 5,
    email: "kunmin.choi@gmail.com"
  },
  {
    id: 11,
    email: "kmchoi76@gmail.com"
  }
]

async function migrateReviewsToFirebase() {
  console.log('🔄 리뷰 데이터 Firebase 마이그레이션 시작...')
  console.log(`📊 총 ${reviewsData.length}개의 리뷰를 마이그레이션합니다.`)
  
  for (let i = 0; i < reviewsData.length; i++) {
    const review = reviewsData[i]
    console.log(`📝 리뷰 마이그레이션 중... (${i + 1}/${reviewsData.length}): ${review.title}`)
    
    try {
      // Firebase Firestore 형식으로 데이터 변환
      const firebaseReviewData = {
        title: review.title || '',
        content: review.content || '',
        author: review.author || '',
        vehicle_type: review.vehicle_type || '',
        budget: review.budget || '',
        mileage: review.mileage || '',
        preferred_color: review.preferred_color || '',
        repair_history: review.repair_history || '',
        reference_site: review.reference_site || '',
        image_url: review.image_url || '',
        status: review.status === 'approved' ? 'active' : 'inactive',
        views: review.views || 0,
        created_at: review.created_at ? new Date(review.created_at) : new Date(),
        updated_at: review.updated_at ? new Date(review.updated_at) : new Date(),
        date: review.date || new Date().toISOString().split('T')[0],
        // Supabase 원본 ID 보존 (참조용)
        supabase_id: review.id
      }
      
      // Firebase에 문서 추가
      const docRef = await addDoc(collection(db, 'reviews'), firebaseReviewData)
      console.log(`✅ 리뷰 마이그레이션 성공: ${docRef.id} (원본: ${review.id})`)
      
      // API 제한 방지를 위한 대기
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`❌ 리뷰 마이그레이션 오류 (${review.title}):`, error)
    }
  }
  
  console.log('✅ 리뷰 데이터 마이그레이션 완료!')
}

async function migrateAdminUsersToFirebase() {
  console.log('🔄 관리자 사용자 Firebase 마이그레이션 시작...')
  console.log(`👥 총 ${adminUsersData.length}명의 관리자를 마이그레이션합니다.`)
  
  for (let i = 0; i < adminUsersData.length; i++) {
    const admin = adminUsersData[i]
    console.log(`👤 관리자 마이그레이션 중... (${i + 1}/${adminUsersData.length}): ${admin.email}`)
    
    try {
      // Firebase Firestore 형식으로 데이터 변환
      const firebaseAdminData = {
        email: admin.email || '',
        created_at: new Date(), // 새로 생성된 시간으로 설정
        // Supabase 원본 ID 보존 (참조용)
        supabase_id: admin.id
      }
      
      // Firebase에 문서 추가
      const docRef = await addDoc(collection(db, 'admin_users'), firebaseAdminData)
      console.log(`✅ 관리자 마이그레이션 성공: ${docRef.id} (원본: ${admin.id})`)
      
      // API 제한 방지를 위한 대기
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`❌ 관리자 마이그레이션 오류 (${admin.email}):`, error)
    }
  }
  
  console.log('✅ 관리자 데이터 마이그레이션 완료!')
}

// 백업 함수
async function createBackup() {
  console.log('💾 마이그레이션 전 데이터 백업 생성...')
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const backupDir = `backup-supabase-${timestamp}`
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir)
  }
  
  // 리뷰 데이터 백업
  fs.writeFileSync(
    path.join(backupDir, 'reviews.json'), 
    JSON.stringify(reviewsData, null, 2)
  )
  
  // 관리자 데이터 백업
  fs.writeFileSync(
    path.join(backupDir, 'admin_users.json'), 
    JSON.stringify(adminUsersData, null, 2)
  )
  
  // 백업 요약
  const summary = {
    backup_date: new Date().toISOString(),
    source: 'Supabase MCP',
    destination: 'Firebase Firestore',
    tables: {
      reviews: reviewsData.length,
      admin_users: adminUsersData.length
    },
    total_records: reviewsData.length + adminUsersData.length
  }
  
  fs.writeFileSync(
    path.join(backupDir, 'migration-summary.json'), 
    JSON.stringify(summary, null, 2)
  )
  
  console.log(`✅ 백업 생성 완료: ${backupDir}`)
  console.log(`📊 총 ${summary.total_records}개 레코드 백업됨`)
}

// 메인 실행 함수
async function main() {
  console.log('🚀 Supabase → Firebase 데이터 마이그레이션 시작')
  console.log('=====================================')
  console.log('Firebase 프로젝트:', envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
  console.log('=====================================')
  
  try {
    // 1. 백업 생성
    await createBackup()
    
    console.log('\n⏳ 3초 후 마이그레이션을 시작합니다...')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 2. 관리자 데이터 마이그레이션
    await migrateAdminUsersToFirebase()
    
    console.log('\n')
    
    // 3. 리뷰 데이터 마이그레이션
    await migrateReviewsToFirebase()
    
    console.log('\n🎉 모든 데이터 마이그레이션이 완료되었습니다!')
    console.log('=====================================')
    console.log('Firebase 콘솔에서 데이터를 확인하세요:')
    console.log(`https://console.firebase.google.com/project/${envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/firestore`)
    
  } catch (error) {
    console.error('❌ 마이그레이션 전체 오류:', error)
  }
}

// 스크립트 실행
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  migrateReviewsToFirebase,
  migrateAdminUsersToFirebase,
  createBackup
} 