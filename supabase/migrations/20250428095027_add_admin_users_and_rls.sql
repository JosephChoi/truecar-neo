-- 관리자 이메일 목록 테이블
create table if not exists public.admin_users (
  id serial primary key,
  email text unique not null
);

-- 최초 관리자 등록
insert into public.admin_users (email) values ('kunmin.choi@gmail.com') on conflict do nothing;

-- 모든 사용자가 리뷰 조회 가능
create policy "Public can read reviews"
  on public.reviews
  for select
  using (true);

-- 관리자만 리뷰 작성/수정/삭제 가능
create policy "Admins can manage reviews"
  on public.reviews
  for all
  using (
    exists (
      select 1 from public.admin_users au
      where au.email = auth.email()
    )
  );
