# Firebase Firestore 데이터베이스 구조

## 개요

트루카(중고차 서비스) 웹 애플리케이션은 Firebase Firestore를 사용하여 데이터를 관리합니다.

## 컬렉션 구조

### 1. `reviews` 컬렉션

고객 리뷰 정보를 저장하는 메인 테이블입니다.

| 필드명 | 타입 | 설명 | 필수 |
|--------|------|------|------|
| title | string | 리뷰 제목 | ✅ |
| content | string | 리뷰 내용 | ✅ |
| author | string | 작성자 이름 | ✅ |
| vehicle_type | string | 차량 유형 | ✅ |
| budget | string | 예산 | ✅ |
| mileage | string | 주행거리 | ✅ |
| preferred_color | string | 선호 색상 | ✅ |
| repair_history | string | 수리 이력 | ✅ |
| reference_site | string | 참고 사이트 | ✅ |
| image_url | string | 이미지 URL | ❌ |
| status | string | 상태 (active/inactive) | ✅ |
| views | number | 조회수 | ✅ |
| created_at | timestamp | 생성일시 | ✅ |
| updated_at | timestamp | 수정일시 | ✅ |
| date | string | 리뷰 날짜 (YYYY-MM-DD) | ✅ |

### 2. `admin_users` 컬렉션

관리자 사용자 정보를 저장합니다.

| 필드명 | 타입 | 설명 | 필수 |
|--------|------|------|------|
| email | string | 관리자 이메일 | ✅ |
| created_at | timestamp | 계정 생성일시 | ✅ |

## Firebase Storage 구조

### 이미지 저장소

- **버킷**: Firebase Storage의 기본 버킷 사용
- **경로**: `review-images/` 폴더 사용
- **파일명 형식**: `migrated-{timestamp}-{original_filename}.jpg`

## 환경 변수

Firebase 연결을 위한 환경 변수들:

- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API 키
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase 인증 도메인
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase 프로젝트 ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase Storage 버킷
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase 메시징 발신자 ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase 앱 ID

## 보안 규칙

### Firestore 보안 규칙
- 리뷰 읽기: 모든 사용자 허용
- 리뷰 쓰기: 인증된 사용자만 허용
- 관리자 데이터: 인증된 사용자만 접근 가능

### Storage 보안 규칙
- 이미지 읽기: 모든 사용자 허용 (공개)
- 이미지 업로드: 인증된 사용자만 허용

## 데이터 마이그레이션

Supabase에서 Firebase로 마이그레이션이 완료되었습니다:
- 리뷰 데이터: 4개 마이그레이션 완료
- 관리자 데이터: 2개 마이그레이션 완료
- 이미지 파일: Firebase Storage로 마이그레이션 완료

## 모니터링 및 관리

- Firebase 콘솔에서 데이터베이스 활동 및 성능 모니터링
- Firestore 사용량 및 요청 수 추적 가능
- Storage 사용량 및 대역폭 모니터링
