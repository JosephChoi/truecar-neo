-- 리뷰 테이블 생성
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  user_id uuid references auth.users(id),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected'))
);

-- RLS 활성화
alter table public.reviews enable row level security;
