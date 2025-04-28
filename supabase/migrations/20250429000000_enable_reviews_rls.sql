-- 리뷰 테이블의 RLS(Row Level Security) 다시 활성화
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 기존 RLS 정책이 있다면 재생성하지 않기 위해 먼저 삭제
DROP POLICY IF EXISTS "모든 사용자가 리뷰를 읽을 수 있음" ON public.reviews;
DROP POLICY IF EXISTS "관리자만 리뷰를 생성할 수 있음" ON public.reviews;
DROP POLICY IF EXISTS "관리자만 리뷰를 수정할 수 있음" ON public.reviews;
DROP POLICY IF EXISTS "관리자만 리뷰를 삭제할 수 있음" ON public.reviews;

-- 모든 사용자가 리뷰를 읽을 수 있는 정책 추가
CREATE POLICY "모든 사용자가 리뷰를 읽을 수 있음" ON public.reviews
    FOR SELECT
    USING (true);

-- 관리자만 리뷰를 생성/수정/삭제할 수 있는 정책 추가
CREATE POLICY "관리자만 리뷰를 생성할 수 있음" ON public.reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "관리자만 리뷰를 수정할 수 있음" ON public.reviews
    FOR UPDATE
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "관리자만 리뷰를 삭제할 수 있음" ON public.reviews
    FOR DELETE
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM public.admin_users)); 