-- ============================================================================
-- BIO VRIKSH — COMPLETE DATABASE SCHEMA, RLS POLICIES & STORAGE BUCKETS
-- UPDATED: Multi-Subject Support (Biology, Physics, Chemistry) & Chapter Tests
-- ============================================================================
-- Paste this entire SQL query into Supabase Dashboard -> SQL Editor and click RUN.
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE (Extends Supabase Auth users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'student' check (role in ('admin', 'student')),
  subscription_plan text default 'none',
  subscription_status text default 'none' check (subscription_status in ('none', 'active', 'expired')),
  subscription_expires_at timestamptz,
  created_at timestamptz default now()
);

-- Safe migrations for profiles columns
alter table public.profiles add column if not exists subscription_plan text default 'none';
alter table public.profiles add column if not exists subscription_status text default 'none';
alter table public.profiles add column if not exists subscription_expires_at timestamptz;

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
  on conflict (id) do update set
    full_name = excluded.full_name,
    phone = excluded.phone;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. CHAPTERS TABLE (Biology, Physics, Chemistry for Class 11 & 12)
-- ----------------------------------------------------------------------------
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text default 'Biology' check (subject in ('Biology', 'Physics', 'Chemistry')),
  class_level text default 'Class 12' check (class_level in ('Class 11', 'Class 12', 'NEET Special')),
  order_index int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.chapters add column if not exists class_level text default 'Class 12';
alter table public.chapters add column if not exists subject text default 'Biology';

-- ----------------------------------------------------------------------------
-- 3. PDFS TABLE (Notes, Short Mindmaps, and Chapter Test Papers)
-- ----------------------------------------------------------------------------
create table if not exists public.pdfs (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references public.chapters(id) on delete set null,
  sub_heading text,
  title text not null,
  description text,
  thumbnail_url text,
  file_path text not null,
  is_free boolean default false,
  price numeric(10,2) default 0,
  is_active boolean default true,
  is_recent boolean default false,
  note_type text default 'paid',
  class_level text default 'Class 12',
  subject text default 'Biology',
  page_count int default 12,
  questions_count int default 45,
  duration_minutes int default 45,
  total_marks int default 180,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Safe migrations for pdfs columns
alter table public.pdfs add column if not exists sub_heading text;
alter table public.pdfs add column if not exists unit text;
alter table public.pdfs add column if not exists years_covered text default 'NEET 2016 - 2024';
alter table public.pdfs add column if not exists highlight_text text;
alter table public.pdfs add column if not exists is_recent boolean default false;
alter table public.pdfs add column if not exists note_type text default 'paid';
alter table public.pdfs add column if not exists class_level text default 'Class 12';
alter table public.pdfs add column if not exists subject text default 'Biology';
alter table public.pdfs add column if not exists questions_count int default 45;
alter table public.pdfs add column if not exists duration_minutes int default 45;
alter table public.pdfs add column if not exists total_marks int default 180;

-- Update constraints safely for note_type, subject & class_level
alter table public.pdfs drop constraint if exists pdfs_note_type_check;
alter table public.pdfs add constraint pdfs_note_type_check check (note_type in ('paid', 'free', 'short', 'chapter', 'test', 'annotated_ncert'));

alter table public.pdfs drop constraint if exists pdfs_class_level_check;
alter table public.pdfs add constraint pdfs_class_level_check check (class_level in ('Class 11', 'Class 12', 'NEET Special'));

alter table public.pdfs drop constraint if exists pdfs_subject_check;
alter table public.pdfs add constraint pdfs_subject_check check (subject in ('Biology', 'Physics', 'Chemistry'));

-- ----------------------------------------------------------------------------
-- 4. TESTS TABLE (Dedicated Chapter Tests & Mock Test Series)
-- ----------------------------------------------------------------------------
create table if not exists public.tests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null default 'Biology' check (subject in ('Biology', 'Physics', 'Chemistry')),
  class_level text not null default 'Class 12' check (class_level in ('Class 11', 'Class 12', 'NEET Special')),
  chapter_id uuid references public.chapters(id) on delete set null,
  pdf_id uuid references public.pdfs(id) on delete set null,
  questions_count int default 45,
  duration_minutes int default 45,
  total_marks int default 180,
  is_free boolean default true,
  price numeric(10,2) default 0,
  description text,
  file_path text,
  solution_file_path text,
  is_active boolean default true,
  order_index int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 5. PURCHASES TABLE (Orders & Student Note Unlocks)
-- ----------------------------------------------------------------------------
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade,
  pdf_id uuid references public.pdfs(id) on delete cascade,
  amount_paid numeric(10,2) not null,
  payment_status text default 'success' check (payment_status in ('success', 'failed', 'pending')),
  payment_gateway_id text,
  purchased_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '90 days'),
  constraint unique_student_pdf unique (student_id, pdf_id)
);

alter table public.purchases add column if not exists expires_at timestamptz default (now() + interval '90 days');

-- ----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES & SECURITY DEFINER ADMIN HELPER
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

alter table public.profiles enable row level security;
alter table public.chapters enable row level security;
alter table public.pdfs enable row level security;
alter table public.tests enable row level security;
alter table public.purchases enable row level security;

-- PROFILES POLICIES
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can update non-role fields in own profile" on public.profiles;
create policy "Users can update non-role fields in own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- CHAPTERS POLICIES
drop policy if exists "Anyone can read active chapters" on public.chapters;
create policy "Anyone can read active chapters" on public.chapters
  for select using (is_active = true or public.is_admin());

drop policy if exists "Only admin can manage chapters" on public.chapters;
create policy "Only admin can manage chapters" on public.chapters
  for all using (public.is_admin());

-- PDFS POLICIES
drop policy if exists "Anyone can read active pdf metadata" on public.pdfs;
create policy "Anyone can read active pdf metadata" on public.pdfs
  for select using (is_active = true or public.is_admin());

drop policy if exists "Only admin can manage pdfs" on public.pdfs;
create policy "Only admin can manage pdfs" on public.pdfs
  for all using (public.is_admin());

-- TESTS POLICIES
drop policy if exists "Anyone can read active tests" on public.tests;
create policy "Anyone can read active tests" on public.tests
  for select using (is_active = true or public.is_admin());

drop policy if exists "Only admin can manage tests" on public.tests;
create policy "Only admin can manage tests" on public.tests
  for all using (public.is_admin());

-- PURCHASES POLICIES
drop policy if exists "Student can see own purchases or admin can see all" on public.purchases;
create policy "Student can see own purchases or admin can see all" on public.purchases
  for select using (student_id = auth.uid() or public.is_admin());

drop policy if exists "Admin can manage all purchases" on public.purchases;
create policy "Admin can manage all purchases" on public.purchases
  for all using (public.is_admin());

drop policy if exists "No direct client insert on purchases" on public.purchases;
create policy "No direct client insert on purchases" on public.purchases
  for insert with check (false);

-- ----------------------------------------------------------------------------
-- 7. STORAGE BUCKETS & STORAGE POLICIES
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('pdf-thumbnails', 'pdf-thumbnails', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('pdf-files', 'pdf-files', false)
on conflict (id) do update set public = false;

-- Policies for pdf-thumbnails
drop policy if exists "Public thumbnail view" on storage.objects;
create policy "Public thumbnail view" on storage.objects
  for select using (bucket_id = 'pdf-thumbnails');

drop policy if exists "Allow upload to pdf-thumbnails" on storage.objects;
create policy "Allow upload to pdf-thumbnails" on storage.objects
  for insert with check (bucket_id = 'pdf-thumbnails');

drop policy if exists "Allow update on pdf-thumbnails" on storage.objects;
create policy "Allow update on pdf-thumbnails" on storage.objects
  for update using (bucket_id = 'pdf-thumbnails');

drop policy if exists "Allow delete on pdf-thumbnails" on storage.objects;
create policy "Allow delete on pdf-thumbnails" on storage.objects
  for delete using (bucket_id = 'pdf-thumbnails');

-- Policies for pdf-files
drop policy if exists "Allow upload to pdf-files" on storage.objects;
create policy "Allow upload to pdf-files" on storage.objects
  for insert with check (bucket_id = 'pdf-files');

drop policy if exists "Allow update on pdf-files" on storage.objects;
create policy "Allow update on pdf-files" on storage.objects
  for update using (bucket_id = 'pdf-files');

drop policy if exists "Allow delete on pdf-files" on storage.objects;
create policy "Allow delete on pdf-files" on storage.objects
  for delete using (bucket_id = 'pdf-files');

-- Trigger for auto updated_at timestamp
create or replace function public.update_pdfs_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_update_pdfs_updated_at on public.pdfs;
create trigger trigger_update_pdfs_updated_at
  before update on public.pdfs
  for each row execute function public.update_pdfs_updated_at();

-- ----------------------------------------------------------------------------
-- 8. SEED DATA: PCB CHAPTERS (Biology, Physics, Chemistry)
-- ----------------------------------------------------------------------------
-- Biology Chapters
insert into public.chapters (name, subject, class_level, order_index, is_active)
values 
  ('Human Reproduction & Reproductive Health', 'Biology', 'Class 12', 1, true),
  ('Principles of Inheritance and Variation (Genetics)', 'Biology', 'Class 12', 2, true),
  ('Molecular Basis of Inheritance', 'Biology', 'Class 12', 3, true),
  ('Biotechnology: Principles and Processes', 'Biology', 'Class 12', 4, true),
  ('Cell: The Unit of Life & Cell Cycle', 'Biology', 'Class 11', 5, true),
  ('Plant Physiology (Photosynthesis & Respiration)', 'Biology', 'Class 11', 6, true),
  ('Human Physiology (Digestion, Circulation, Neural)', 'Biology', 'Class 11', 7, true)
on conflict do nothing;

-- Physics Chapters
insert into public.chapters (name, subject, class_level, order_index, is_active)
values 
  ('Electrostatics & Electric Potential', 'Physics', 'Class 12', 8, true),
  ('Current Electricity & Kirchhoffs Laws', 'Physics', 'Class 12', 9, true),
  ('Ray Optics and Optical Instruments', 'Physics', 'Class 12', 10, true),
  ('Units, Dimensions and Error Analysis', 'Physics', 'Class 11', 11, true),
  ('Kinematics (Motion in a Straight Line & Plane)', 'Physics', 'Class 11', 12, true),
  ('Laws of Motion and Work, Energy & Power', 'Physics', 'Class 11', 13, true)
on conflict do nothing;

-- Chemistry Chapters
insert into public.chapters (name, subject, class_level, order_index, is_active)
values 
  ('Solutions and Colligative Properties', 'Chemistry', 'Class 12', 14, true),
  ('Electrochemistry and Chemical Kinetics', 'Chemistry', 'Class 12', 15, true),
  ('Aldehydes, Ketones and Carboxylic Acids', 'Chemistry', 'Class 12', 16, true),
  ('Some Basic Concepts of Chemistry (Mole Concept)', 'Chemistry', 'Class 11', 17, true),
  ('Structure of Atom and Quantum Numbers', 'Chemistry', 'Class 11', 18, true),
  ('Chemical Bonding and Molecular Structure', 'Chemistry', 'Class 11', 19, true)
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- 9. SEED DATA: ANNOTATED NCERT & PYQS (Biology, Physics, Chemistry)
-- ----------------------------------------------------------------------------
insert into public.pdfs (title, subject, class_level, note_type, unit, years_covered, highlight_text, description, file_path, is_free, price, questions_count, page_count, is_active, is_recent)
values
  -- Biology Annotated NCERT
  ('Cell: The Unit of Life & Cell Cycle', 'Biology', 'Class 11', 'annotated_ncert', 'Cell Biology', 'NEET 2016 - 2024', 'High yield NCERT lines on Endomembrane system and organelle markers.', 'Line-by-line annotated NCERT with 10-year solved PYQs and organelle comparison charts.', 'sample_bio_cell.pdf', true, 0, 68, 24, true, true),
  ('Human Physiology: Chemical Coordination & Neural Control', 'Biology', 'Class 11', 'annotated_ncert', 'Human Physiology', 'NEET 2015 - 2024', 'Action potential mechanism, endocrine feedback loops with NCERT annotated figures.', 'Detailed NCERT margin notes, hormonal axis diagrams, and 90+ NEET PYQs solved.', 'sample_bio_physio.pdf', false, 49, 92, 32, true, false),
  ('Genetics: Principles of Inheritance & Variation', 'Biology', 'Class 12', 'annotated_ncert', 'Genetics & Evolution', 'NEET 2015 - 2024', 'Direct pedigree analysis shortcuts & linkage exceptions line annotations.', 'NCERT line annotations covering Mendel laws, chromosomal basis and pedigree tricks.', 'sample_bio_genetics.pdf', false, 49, 115, 38, true, true),
  ('Molecular Basis of Inheritance', 'Biology', 'Class 12', 'annotated_ncert', 'Genetics & Evolution', 'NEET 2016 - 2024', 'Meselson-Stahl experiment, lac operon regulatory proteins annotated text.', 'Line-by-line replication, transcription, and translation annotations with PYQs.', 'sample_bio_molecular.pdf', true, 0, 104, 34, true, false),
  
  -- Physics Annotated NCERT
  ('Kinematics & Laws of Motion', 'Physics', 'Class 11', 'annotated_ncert', 'Mechanics', 'NEET 2015 - 2024', 'Calculus formulations, projectile trajectories and free-body diagram shortcuts.', 'NCERT highlighted formulas, graph interpretations, and 10-year NEET mechanics questions.', 'sample_phy_kinematics.pdf', true, 0, 78, 28, true, true),
  ('Electrostatics & Potential', 'Physics', 'Class 12', 'annotated_ncert', 'Electromagnetism', 'NEET 2015 - 2024', 'Gauss law symmetry applications, capacitor dielectric insertion energy formulas.', 'Every NCERT example dissected with step-by-step NEET approach.', 'sample_phy_electro.pdf', false, 49, 88, 36, true, false),

  -- Chemistry Annotated NCERT
  ('Chemical Bonding & Molecular Structure', 'Chemistry', 'Class 11', 'annotated_ncert', 'Inorganic Chemistry', 'NEET 2015 - 2024', 'Isoelectronic species bond orders, dipole moments and hybridization chart.', 'Inorganic NCERT trends, VSEPR geometries and MOT electron filling order annotations.', 'sample_chem_bonding.pdf', true, 0, 98, 35, true, true),
  ('Coordination Compounds', 'Chemistry', 'Class 12', 'annotated_ncert', 'Inorganic Chemistry', 'NEET 2015 - 2024', 'CFT splitting diagrams, isomerism types, magnetic moments and IUPAC naming.', 'NCERT color complexes, spectrochemical series tricks and previous 10-year questions.', 'sample_chem_coordination.pdf', true, 0, 90, 32, true, false)
on conflict do nothing;

-- ============================================================================
-- SETUP COMPLETE!
-- To make yourself Admin, sign up with your email on the site or Supabase Auth,
-- then run:
-- UPDATE public.profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@HERE.COM');
-- ============================================================================
