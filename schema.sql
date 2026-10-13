-- Sentinel Platform Schema
-- Run in Supabase > SQL Editor
-- This is the COMPLETE schema for the full platform

create extension if not exists pgcrypto;

-- ============================================
-- NETWORK MANAGEMENT MODULE
-- ============================================

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id),
  plan text not null,               -- weekly | monthly | custom | hourly
  amount numeric(12,2) not null check (amount >= 0),
  days integer not null default 0,
  start_time text,                  -- e.g. "16:00" for hourly plans
  end_time text,                    -- e.g. "04:00" for hourly plans
  paid_at timestamptz not null default now(),
  expires_at timestamptz not null,
  notified_expiry boolean not null default false,
  receipt_code text,
  served_by text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ============================================
-- STUDENT / CLASS MANAGEMENT MODULE
-- ============================================

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),   -- Supabase Auth link
  admission_number text unique,              -- also their certificate code prefix
  full_name text not null,
  phone text,
  email text,
  parent_name text,
  parent_phone text,
  id_front_url text,                         -- Supabase Storage URL
  id_back_url text,
  is_fulltime boolean default true,
  availability_days text default 'daily',    -- daily | mon,tue,wed...
  availability_start text default '09:00',   -- e.g. "13:00"
  availability_end text default '17:00',     -- e.g. "14:00"
  accepted_terms boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'general',  -- computer_packages | adobe | networking | webdev | general
  price numeric(12,2) not null default 0,
  description text,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.course_topics (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  points integer not null default 10,        -- points earned on completion
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  course_id uuid not null references public.courses(id),
  enrolled_at timestamptz not null default now(),
  status text not null default 'active',     -- active | completed | dropped
  fees_total numeric(12,2) not null default 0,
  fees_paid numeric(12,2) not null default 0,
  fees_due_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique(student_id, course_id)
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  date date not null default current_date,
  check_in timestamptz,
  check_out timestamptz,
  status text not null default 'present',    -- present | absent | late
  signed_by text default '',                 -- 'self' or admin name
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique(student_id, date)
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  topic_id uuid not null references public.course_topics(id),
  completed boolean not null default false,
  completed_at timestamptz,
  marked_by text default '',                 -- 'student' or admin name
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique(student_id, topic_id)
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  course_id uuid not null references public.courses(id),
  cert_code text unique not null,            -- e.g. CERT-XXXX or admission_number based
  issued_at timestamptz default now(),
  is_eligible boolean default false,
  admin_approved boolean default false,
  fees_cleared boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.course_topics(id),
  course_id uuid references public.courses(id),
  title text not null,
  file_url text not null,                    -- Supabase Storage URL
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ============================================
-- INDEXES
-- ============================================

create index if not exists payments_client_idx on public.payments(client_id, paid_at desc);
create index if not exists clients_name_idx on public.clients(lower(name));
create index if not exists payments_receipt_code_idx on public.payments(receipt_code);
create index if not exists students_admission_idx on public.students(admission_number);
create index if not exists students_user_idx on public.students(user_id);
create index if not exists enrollments_student_idx on public.enrollments(student_id);
create index if not exists enrollments_course_idx on public.enrollments(course_id);
create index if not exists attendance_student_date_idx on public.attendance(student_id, date desc);
create index if not exists progress_student_idx on public.progress(student_id);
create index if not exists certificates_code_idx on public.certificates(cert_code);
create index if not exists course_topics_course_idx on public.course_topics(course_id, sort_order);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.clients enable row level security;
alter table public.payments enable row level security;
alter table public.students enable row level security;
alter table public.courses enable row level security;
alter table public.course_topics enable row level security;
alter table public.enrollments enable row level security;
alter table public.attendance enable row level security;
alter table public.progress enable row level security;
alter table public.certificates enable row level security;
alter table public.notes enable row level security;

-- Admin (anon) policies — full access for the admin app
create policy "clients_all" on public.clients for all to anon using (true) with check (true);
create policy "payments_all" on public.payments for all to anon using (true) with check (true);
create policy "courses_all" on public.courses for all to anon using (true) with check (true);
create policy "course_topics_all" on public.course_topics for all to anon using (true) with check (true);
create policy "notes_all" on public.notes for all to anon using (true) with check (true);

-- Admin can see all students
create policy "students_admin" on public.students for all to anon using (true) with check (true);
create policy "enrollments_admin" on public.enrollments for all to anon using (true) with check (true);
create policy "attendance_admin" on public.attendance for all to anon using (true) with check (true);
create policy "progress_admin" on public.progress for all to anon using (true) with check (true);
create policy "certificates_admin" on public.certificates for all to anon using (true) with check (true);

-- Student portal policies (authenticated users can only see their own data)
create policy "students_own_select" on public.students for select to authenticated
  using (user_id = auth.uid());
create policy "students_own_update" on public.students for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "enrollments_own" on public.enrollments for select to authenticated
  using (student_id in (select id from public.students where user_id = auth.uid()));

create policy "attendance_own_select" on public.attendance for select to authenticated
  using (student_id in (select id from public.students where user_id = auth.uid()));
create policy "attendance_own_insert" on public.attendance for insert to authenticated
  with check (student_id in (select id from public.students where user_id = auth.uid()));

create policy "progress_own_select" on public.progress for select to authenticated
  using (student_id in (select id from public.students where user_id = auth.uid()));
create policy "progress_own_update" on public.progress for update to authenticated
  using (student_id in (select id from public.students where user_id = auth.uid()));

create policy "certificates_own" on public.certificates for select to authenticated
  using (student_id in (select id from public.students where user_id = auth.uid()));

-- Courses and topics are readable by all authenticated users (students need to see course info)
create policy "courses_read" on public.courses for select to authenticated using (true);
create policy "topics_read" on public.course_topics for select to authenticated using (true);
create policy "notes_read" on public.notes for select to authenticated using (true);

-- ============================================
-- SEED DATA: Default Courses
-- ============================================

-- Computer Packages
insert into public.courses (name, category, price, description) values
  ('Computer Packages', 'computer_packages', 5000, 'Microsoft Office Suite: Word, Excel, Access, PowerPoint')
on conflict do nothing;

-- Adobe
insert into public.courses (name, category, price, description) values
  ('Adobe Suite', 'adobe', 8000, 'Adobe Photoshop, Illustrator, and design fundamentals')
on conflict do nothing;

-- Networking & PC Repair
insert into public.courses (name, category, price, description) values
  ('Basic Networking & PC Repair', 'networking', 6000, 'Network fundamentals, hardware troubleshooting, and PC repair')
on conflict do nothing;

-- Web Development
insert into public.courses (name, category, price, description) values
  ('Web Development', 'webdev', 10000, 'HTML, CSS, and JavaScript from scratch to professional')
on conflict do nothing;

-- ============================================
-- SEED DATA: Default Topics
-- ============================================

-- Computer Packages topics
insert into public.course_topics (course_id, name, sort_order, points)
select c.id, t.name, t.ord, t.pts
from public.courses c,
(values
  ('Microsoft Word', 1, 25),
  ('Microsoft Excel', 2, 25),
  ('Microsoft Access', 3, 25),
  ('Microsoft PowerPoint', 4, 25)
) as t(name, ord, pts)
where c.name = 'Computer Packages'
on conflict do nothing;

-- Web Development topics
insert into public.course_topics (course_id, name, sort_order, points)
select c.id, t.name, t.ord, t.pts
from public.courses c,
(values
  ('HTML', 1, 30),
  ('CSS', 2, 30),
  ('JavaScript', 3, 40)
) as t(name, ord, pts)
where c.name = 'Web Development'
on conflict do nothing;

-- ============================================
-- MIGRATION: Add new columns to existing tables
-- Run these if you already have data:
-- ============================================
-- ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS receipt_code text;
-- ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS served_by text DEFAULT '';
-- ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS start_time text;
-- ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS end_time text;
-- ALTER TABLE public.payments ALTER COLUMN days SET DEFAULT 0;

-- ============================================
-- STORAGE BUCKETS (run via Supabase Dashboard > Storage)
-- ============================================
-- Create buckets:
--   1. "student-ids" — for ID card uploads (front/back)
--   2. "notes"       — for PDF course notes
--   3. "logos"        — for admin logo uploads
