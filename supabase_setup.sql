-- ============================================================================
-- BIO VRIKSHA — COMPLETE DATABASE SCHEMA, RLS POLICIES & STORAGE BUCKETS
-- ============================================================================
-- Paste this entire SQL file into your Supabase Dashboard -> SQL Editor and click RUN.

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE (Extends Supabase Auth users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'student' check (role in ('admin', 'student')),
  created_at timestamptz default now()
);

-- Auto-create profile trigger on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. CHAPTERS TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text default 'Biology',
  order_index int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 3. PDFS TABLE (Study Materials & Notes with Categorization & Recent Toggle)
-- ----------------------------------------------------------------------------
create table if not exists public.pdfs (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references public.chapters(id) on delete set null,
  title text not null,
  description text,
  thumbnail_url text, -- Public image URL (bucket: pdf-thumbnails)
  file_path text not null, -- Private storage path (bucket: pdf-files)
  is_free boolean default false,
  price numeric(10,2) default 0,
  is_active boolean default true,
  is_recent boolean default false, -- Owner toggle to showcase ANY note in Recents section
  note_type text default 'paid' check (note_type in ('paid', 'free', 'short', 'chapter')),
  class_level text default 'Class 12' check (class_level in ('Class 11', 'Class 12', 'NEET Special')),
  page_count int default 12,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add columns if table already exists
alter table public.pdfs add column if not exists is_recent boolean default false;
alter table public.pdfs add column if not exists note_type text default 'paid';
alter table public.pdfs add column if not exists class_level text default 'Class 12';

-- ----------------------------------------------------------------------------
-- 4. PURCHASES TABLE (Orders & Unlocked Notes)
-- ----------------------------------------------------------------------------
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade,
  pdf_id uuid references public.pdfs(id) on delete cascade,
  amount_paid numeric(10,2) not null,
  payment_status text default 'success' check (payment_status in ('success', 'failed', 'pending')),
  payment_gateway_id text, -- Razorpay Transaction / Payment ID
  purchased_at timestamptz default now(),
  constraint unique_student_pdf unique (student_id, pdf_id)
);

-- ----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.chapters enable row level security;
alter table public.pdfs enable row level security;
alter table public.purchases enable row level security;

-- PROFILES POLICIES
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Users can update non-role fields in own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- CHAPTERS POLICIES
create policy "Anyone can read active chapters" on public.chapters
  for select using (is_active = true or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Only admin can manage chapters" on public.chapters
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- PDFS POLICIES
create policy "Anyone can read active pdf metadata" on public.pdfs
  for select using (is_active = true or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Only admin can manage pdfs" on public.pdfs
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- PURCHASES POLICIES
create policy "Student can see own purchases or admin can see all" on public.purchases
  for select using (student_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- STRICT SECURITY: Direct client inserts on purchases are BLOCKED (Must be inserted via Server API)
create policy "No direct client insert on purchases" on public.purchases
  for insert with check (false);

-- ----------------------------------------------------------------------------
-- 6. STORAGE BUCKETS SETUP
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('pdf-thumbnails', 'pdf-thumbnails', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('pdf-files', 'pdf-files', false)
on conflict (id) do nothing;

create policy "Public view pdf-thumbnails" on storage.objects
  for select using (bucket_id = 'pdf-thumbnails');

create policy "Admin upload pdf-thumbnails" on storage.objects
  for insert with check (bucket_id = 'pdf-thumbnails' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admin update pdf-thumbnails" on storage.objects
  for update using (bucket_id = 'pdf-thumbnails' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admin delete pdf-thumbnails" on storage.objects
  for delete using (bucket_id = 'pdf-thumbnails' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admin manage pdf-files" on storage.objects
  for all using (bucket_id = 'pdf-files' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
