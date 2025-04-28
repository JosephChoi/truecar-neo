-- 리뷰 테이블에 부족한 필드들 추가
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS author TEXT DEFAULT NULL;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS date TEXT DEFAULT NULL;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS vehicle_type TEXT DEFAULT NULL;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS budget TEXT DEFAULT NULL;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS mileage TEXT DEFAULT NULL;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS preferred_color TEXT DEFAULT NULL;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS repair_history TEXT DEFAULT NULL;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS reference_site TEXT DEFAULT NULL;

-- author 컬럼에 대한 주석 추가
COMMENT ON COLUMN public.reviews.author IS '리뷰 작성자 이름';
COMMENT ON COLUMN public.reviews.date IS '리뷰 작성일';
COMMENT ON COLUMN public.reviews.vehicle_type IS '차종 정보';
COMMENT ON COLUMN public.reviews.budget IS '구매 예산 정보';
COMMENT ON COLUMN public.reviews.mileage IS '주행거리 정보';
COMMENT ON COLUMN public.reviews.preferred_color IS '선호색상 정보';
COMMENT ON COLUMN public.reviews.repair_history IS '수리여부 정보';
COMMENT ON COLUMN public.reviews.reference_site IS '참고 타 사이트 정보';
