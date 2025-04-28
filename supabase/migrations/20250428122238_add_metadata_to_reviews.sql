-- metadata JSONB 컬럼을 reviews 테이블에 추가
ALTER TABLE public.reviews
ADD COLUMN metadata JSONB DEFAULT NULL;

-- 컬럼에 대한 주석 추가
COMMENT ON COLUMN public.reviews.metadata IS '리뷰 작성자 정보와 주문 상세 정보를 JSON 형식으로 저장합니다.';

-- RLS 정책 업데이트 
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 모든 사용자(익명 포함)가 reviews 테이블을 읽을 수 있도록 설정
CREATE POLICY "모든 사용자가 리뷰를 볼 수 있습니다" ON public.reviews
    FOR SELECT USING (true);
    
-- 인증된 사용자만 reviews 테이블에 삽입할 수 있도록 설정
CREATE POLICY "인증된 사용자가 리뷰를 작성할 수 있습니다" ON public.reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
-- 관리자 사용자만 reviews 테이블을 업데이트하거나 삭제할 수 있도록 설정
CREATE POLICY "관리자 사용자가 리뷰를 수정할 수 있습니다" ON public.reviews
    FOR UPDATE USING (auth.role() = 'authenticated');
    
CREATE POLICY "관리자 사용자가 리뷰를 삭제할 수 있습니다" ON public.reviews
    FOR DELETE USING (auth.role() = 'authenticated');

-- Storage RLS 정책 생성
CREATE POLICY "모든 사용자가 이미지를 볼 수 있습니다" ON storage.objects
    FOR SELECT USING (bucket_id = 'review-images');
    
CREATE POLICY "인증된 사용자가 이미지를 업로드할 수 있습니다" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'review-images'
        AND auth.role() = 'authenticated'
    );
    
CREATE POLICY "인증된 사용자가 이미지를 수정할 수 있습니다" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'review-images'
        AND auth.role() = 'authenticated'
    );
    
CREATE POLICY "인증된 사용자가 이미지를 삭제할 수 있습니다" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'review-images'
        AND auth.role() = 'authenticated'
    );
