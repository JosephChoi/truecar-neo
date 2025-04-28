-- image_url 컬럼을 reviews 테이블에 추가
ALTER TABLE public.reviews
ADD COLUMN image_url TEXT DEFAULT NULL;

-- 컬럼에 대한 주석 추가
COMMENT ON COLUMN public.reviews.image_url IS '리뷰 이미지의 URL 경로를 저장합니다.';
