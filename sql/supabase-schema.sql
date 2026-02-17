-- Enable UUID extension
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  task_date date not null,
  start_time time not null,
  duration int not null check (duration <= 120 and duration > 0),
  breaks_count int not null default 0 check (breaks_count between 0 and 10),
  break_duration int not null default 5 check (break_duration between 1 and 15),
  created_at timestamptz default now()
);

create table if not exists public.flashcards (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scheduled_at timestamptz not null,
  content text not null check (char_length(content) <= 1500),
  completed boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.folders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists public.files (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  folder_id uuid not null references public.folders(id) on delete cascade,
  title text not null,
  content text not null check (char_length(content) <= 1500),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.flashcards enable row level security;
alter table public.folders enable row level security;
alter table public.files enable row level security;

create policy "profiles_own" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "tasks_own" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "flashcards_own" on public.flashcards for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "folders_own" on public.folders for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "files_own" on public.files for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
