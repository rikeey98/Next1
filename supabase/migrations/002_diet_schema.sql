-- 이지 다이어트 노트 스키마
-- meal_entries 테이블

create type meal_type as enum ('breakfast', 'lunch', 'dinner', 'snack', 'late_night');

create table if not exists meal_entries (
  id                          uuid primary key default gen_random_uuid(),
  user_id                     uuid not null references auth.users(id) on delete cascade,
  meal_type                   meal_type not null,
  input_text                  text,
  image_url                   text,
  analysis_json               jsonb,
  recorded_at                 timestamptz not null default now(),
  interval_since_prev_minutes int,
  created_at                  timestamptz not null default now()
);

-- 인덱스
create index if not exists meal_entries_user_recorded_at
  on meal_entries (user_id, recorded_at desc);

-- RLS
alter table meal_entries enable row level security;

create policy "Users can read own meals"
  on meal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own meals"
  on meal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own meals"
  on meal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own meals"
  on meal_entries for delete
  using (auth.uid() = user_id);

-- Storage: meal-images 버킷 (Supabase Dashboard에서 수동으로 생성 필요)
-- 버킷명: meal-images, Public: true
-- Storage Policy:
-- INSERT: auth.uid()::text = (storage.foldername(name))[1]
-- SELECT: true (public)
-- DELETE: auth.uid()::text = (storage.foldername(name))[1]
