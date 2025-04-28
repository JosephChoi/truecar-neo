-- 리뷰 테이블에 조회수(views) 컬럼 추가
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- 이미 views 컬럼이 있는 행의 NULL 값을 0으로 업데이트
UPDATE public.reviews SET views = 0 WHERE views IS NULL;

-- views 컬럼에 대한 주석 추가
COMMENT ON COLUMN public.reviews.views IS '리뷰 조회수';
