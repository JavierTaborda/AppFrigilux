-- Historial de accesos exitosos a Supabase.
-- Ejecutar en Supabase Dashboard > SQL Editor.

create table if not exists public.login_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  user_name text,
  role text,
  method text not null check (method in ('password', 'email_otp', 'sms_otp')),
  platform text default 'mobile',
  created_at timestamptz not null default now()
);

create index if not exists login_history_created_at_idx
  on public.login_history (created_at desc);

create index if not exists login_history_user_id_idx
  on public.login_history (user_id);

create or replace function public.fill_login_history_metadata()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.user_id <> auth.uid() then
    raise exception 'user_id must match the authenticated user';
  end if;

  new.user_email := coalesce(auth.jwt() ->> 'email', new.user_email);
  new.user_name := coalesce(auth.jwt() ->> 'name-user', new.user_name);
  new.role := auth.jwt() ->> 'app-role';
  new.platform := coalesce(new.platform, 'mobile');
  return new;
end;
$$;

drop trigger if exists set_login_history_metadata on public.login_history;
create trigger set_login_history_metadata
before insert on public.login_history
for each row execute function public.fill_login_history_metadata();

alter table public.login_history enable row level security;

 drop policy if exists "Users can insert their own login history" on public.login_history;
create policy "Users can insert their own login history"
on public.login_history
for insert
to authenticated
with check (user_id = auth.uid());

 drop policy if exists "Only admins can read login history" on public.login_history;
create policy "Only admins can read login history"
on public.login_history
for select
to authenticated
using ((auth.jwt() ->> 'app-role') = '1');

revoke all on public.login_history from anon;
grant insert on public.login_history to authenticated;
grant select on public.login_history to authenticated;
