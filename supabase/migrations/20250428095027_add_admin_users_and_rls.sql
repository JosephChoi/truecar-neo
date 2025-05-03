-- 관리자 이메일 목록 테이블
create table if not exists public.admin_users (
  id serial primary key,
  email text unique not null,
  user_id uuid references auth.users(id)
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

-- 누락된 user_id 정보를 auth.users 테이블의 정보를 바탕으로 업데이트하는 함수
create or replace function public.sync_admin_user_ids()
returns void as $$
begin
  update public.admin_users a
  set user_id = u.id
  from auth.users u
  where a.email = u.email and a.user_id is null;
end;
$$ language plpgsql security definer;
