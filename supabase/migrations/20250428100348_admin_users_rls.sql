-- admin_users 테이블 RLS 활성화
alter table public.admin_users enable row level security;

-- 인증된 사용자는 관리자 목록을 조회할 수 있음
create policy "Authenticated can read admin_users"
  on public.admin_users
  for select
  using (auth.role() = 'authenticated');

-- 인증된 사용자는 관리자 추가 가능
create policy "Authenticated can insert admin_users"
  on public.admin_users
  for insert
  with check (auth.role() = 'authenticated');
