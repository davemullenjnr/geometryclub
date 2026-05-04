create extension if not exists "pgcrypto";

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  instagram_username text not null,
  name text not null,
  email text not null,
  location text not null,
  notes text not null default '',
  image_path text not null,
  image_public_url text,
  image_original_name text not null,
  image_mime_type text not null,
  image_bytes bigint not null check (image_bytes > 0),
  status text not null default 'pending_review'
);

alter table public.submissions enable row level security;

drop policy if exists "Service role can manage submissions" on public.submissions;
create policy "Service role can manage submissions"
on public.submissions
as permissive
for all
to service_role
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('submit-photos', 'submit-photos', false)
on conflict (id) do nothing;

update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'submit-photos';

drop policy if exists "Anon can upload submissions images" on storage.objects;
create policy "Anon can upload submissions images"
on storage.objects
for insert
to anon
with check (bucket_id = 'submit-photos' and (storage.foldername(name))[1] = 'submissions');

drop policy if exists "Service role can read submission images" on storage.objects;
create policy "Service role can read submission images"
on storage.objects
for select
to service_role
using (bucket_id = 'submit-photos');
