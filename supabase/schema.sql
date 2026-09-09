create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  category text not null,
  capacity text not null,
  description text not null,
  image_url text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Anyone can view projects"
  on public.projects for select using (true);

create policy "Only configured admin can add projects"
  on public.projects for insert with check (auth.uid() = created_by and (auth.jwt() ->> 'email') = 'sanapanuj7@gmail.com');

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "Anyone can view project images"
  on storage.objects for select using (bucket_id = 'project-images');

drop policy if exists "Signed-in users can upload project images" on storage.objects;
drop policy if exists "Only admin can upload project images" on storage.objects;

create policy "Only admin can upload project images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'project-images' and (auth.jwt() ->> 'email') = 'sanapanuj7@gmail.com');