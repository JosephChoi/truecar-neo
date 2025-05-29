# Firebase 설정 및 마이그레이션 가이드

## 1. Firebase 프로젝트 설정

### 1.1 Firebase 콘솔에서 프로젝트 생성
1. [Firebase 콘솔](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: `truecar-neo`)
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

### 1.2 웹 앱 추가 및 설정
1. 프로젝트 대시보드에서 "웹" 아이콘 클릭
2. 앱 닉네임 입력 (예: `truecar-web`)
3. Firebase Hosting 설정 (선택사항)
4. 앱 등록 완료
5. **중요**: SDK 설정 정보 복사해두기

### 1.3 필요한 Firebase 서비스 활성화

#### Firestore Database
1. 왼쪽 메뉴에서 "Firestore Database" 선택
2. "데이터베이스 만들기" 클릭
3. 보안 규칙: "테스트 모드로 시작" 선택 (임시)
4. 위치: `asia-northeast3` (서울) 선택 권장
5. 완료

#### Authentication
1. 왼쪽 메뉴에서 "Authentication" 선택
2. "시작하기" 클릭
3. "Sign-in method" 탭에서 "이메일/비밀번호" 활성화
4. 저장

#### Storage
1. 왼쪽 메뉴에서 "Storage" 선택
2. "시작하기" 클릭
3. 보안 규칙: "테스트 모드로 시작" 선택 (임시)
4. 위치: Firestore와 동일한 지역 선택
5. 완료

## 2. 환경 변수 설정

### 2.1 Firebase 설정 정보 복사
1. 프로젝트 설정 (톱니바퀴 아이콘) → 일반 탭
2. "내 앱" 섹션에서 웹 앱 선택
3. "SDK 설정 및 구성" 정보 복사

### 2.2 환경 변수 파일 생성
`firebase-env-template.txt` 파일을 참고하여 `.env.local` 파일 생성:

```bash
# .env.local 파일 생성
cp firebase-env-template.txt .env.local
```

Firebase 설정 정보를 `.env.local`에 입력:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 3. Firebase 보안 규칙 설정

### 3.1 Firestore Security Rules
Firestore Database → 규칙 탭에서 다음 규칙 적용:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 리뷰 컬렉션 규칙
    match /reviews/{reviewId} {
      // 모든 사용자가 활성 상태 리뷰 읽기 가능
      allow read: if resource.data.status == 'active';
      
      // 인증된 관리자만 생성, 수정, 삭제 가능
      allow create, update, delete: if isAdmin();
    }
    
    // 관리자 사용자 컬렉션 규칙
    match /admin_users/{userId} {
      // 관리자만 접근 가능
      allow read, write: if isAdmin();
    }
    
    // 관리자 권한 확인 함수
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/admin_users/$(request.auth.uid));
    }
  }
}
```

### 3.2 Firebase Storage Security Rules
Storage → 규칙 탭에서 다음 규칙 적용:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 리뷰 이미지: 모든 사용자 읽기, 관리자만 쓰기
    match /review-images/{imageId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // 프로필 이미지: 소유자만 쓰기, 모든 사용자 읽기
    match /profile-images/{userId}/{imageId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 관리자 권한 확인 함수
    function isAdmin() {
      return request.auth != null && 
             firestore.exists(/databases/(default)/documents/admin_users/$(request.auth.uid));
    }
  }
}
```

## 4. 데이터 마이그레이션 준비

### 4.1 현재 Supabase 데이터 확인
기존 데이터 구조와 내용을 파악하여 마이그레이션 계획 수립

### 4.2 Firestore 컬렉션 구조 설계
```
reviews (컬렉션)
├── {reviewId} (문서)
│   ├── title: string
│   ├── content: string
│   ├── rating: number
│   ├── created_at: timestamp
│   ├── updated_at: timestamp
│   ├── user_id: string
│   ├── status: string
│   ├── image_url: string
│   ├── author: string
│   ├── vehicle_type: string
│   ├── budget: string
│   ├── mileage: string
│   ├── preferred_color: string
│   ├── repair_history: string
│   ├── reference_site: string
│   └── views: number

admin_users (컬렉션)
├── {userId} (문서)
│   ├── email: string
│   └── created_at: timestamp
```

## 5. 개발 환경 테스트

### 5.1 Firebase 연결 테스트
```bash
npm run dev
```

브라우저 콘솔에서 Firebase 연결 상태 확인

### 5.2 관리자 계정 생성
Firebase Console → Authentication → 사용자 탭에서 관리자 이메일로 사용자 생성

Firestore → admin_users 컬렉션에 관리자 문서 추가:
```json
{
  "email": "admin@truecar.com",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## 6. 패키지 의존성 확인

현재 설치된 Firebase 패키지:
```json
{
  "firebase": "^latest_version"
}
```

추가로 필요한 패키지가 있다면 설치:
```bash
npm install firebase
```

## 7. 다음 단계

이제 Firebase 기본 설정이 완료되었습니다. 다음 단계는:

1. **코드 마이그레이션**: 기존 Supabase 코드를 Firebase 코드로 변경
2. **데이터 마이그레이션**: Supabase에서 Firebase로 데이터 이전
3. **테스트**: 모든 기능이 정상 작동하는지 확인
4. **배포**: Vercel 환경 변수 업데이트 및 배포

## 8. 주의사항

- Firebase 프로젝트의 보안 규칙은 처음에는 테스트 모드로 설정되어 있습니다.
- 프로덕션 배포 전에 반드시 적절한 보안 규칙을 설정해야 합니다.
- 환경 변수 파일(`.env.local`)은 절대 git에 커밋하지 마세요.
- Firebase 사용량을 정기적으로 모니터링하세요.

## 9. 유용한 링크

- [Firebase 문서](https://firebase.google.com/docs)
- [Firestore 보안 규칙 가이드](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage 보안 규칙](https://firebase.google.com/docs/storage/security)
- [Firebase 가격 정책](https://firebase.google.com/pricing) 