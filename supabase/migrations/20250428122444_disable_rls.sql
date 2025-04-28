-- 개발 단계에서는 리뷰 테이블의 RLS 정책을 일시적으로 비활성화
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
