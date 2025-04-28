-- 버킷이 없는 경우 생성
INSERT INTO storage.buckets (id, name, public) 
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 익명 사용자에게 스토리지 액세스 권한 부여 
-- 개발용 정책 (프로덕션에서는 비활성화해야 함)
DROP POLICY IF EXISTS "모든 사용자가 이미지를 볼 수 있습니다" ON storage.objects;
CREATE POLICY "모든 사용자가 이미지를 볼 수 있음" ON storage.objects
    FOR SELECT USING (bucket_id = 'review-images');

DROP POLICY IF EXISTS "익명 사용자 이미지 업로드 허용" ON storage.objects;
CREATE POLICY "익명 사용자 이미지 업로드 허용" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'review-images');

DROP POLICY IF EXISTS "익명 사용자 이미지 업데이트 허용" ON storage.objects;
CREATE POLICY "익명 사용자 이미지 업데이트 허용" ON storage.objects
    FOR UPDATE USING (bucket_id = 'review-images');

DROP POLICY IF EXISTS "익명 사용자 이미지 삭제 허용" ON storage.objects;
CREATE POLICY "익명 사용자 이미지 삭제 허용" ON storage.objects
    FOR DELETE USING (bucket_id = 'review-images');
