-- EcoBottle initial production schema with RLS, triggers, and atomic RPCs

create schema if not exists private;

-- 1. Tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'warga' check (role in ('warga', 'petugas')),
  points integer not null default 0 check (points >= 0),
  xp integer not null default 0 check (xp >= 0),
  level integer not null default 1 check (level >= 1),
  bottles_saved integer not null default 0 check (bottles_saved >= 0),
  emission_kg numeric(10, 2) not null default 0 check (emission_kg >= 0),
  streak_days integer not null default 0 check (streak_days >= 0),
  last_deposit_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.locations (
  id bigint generated always as identity primary key,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  bottles integer not null default 0 check (bottles >= 0),
  max_bottles integer not null default 400 check (max_bottles > 0),
  capacity integer not null default 0 check (capacity between 0 and 100),
  status text not null default 'low' check (status in ('low', 'mid', 'high', 'full')),
  updated_at timestamptz not null default now()
);

create table if not exists public.bottle_transactions (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  location_id bigint not null references public.locations(id) on delete cascade,
  qty integer not null check (qty > 0),
  weight_kg numeric(10, 2) not null default 0 check (weight_kg >= 0),
  plastic_type text not null check (plastic_type in ('PET', 'HDPE', 'PP', 'Campuran')),
  condition text not null default 'Baik' check (condition in ('Baik', 'Rusak', 'Kotor')),
  note text,
  points_awarded integer not null default 0 check (points_awarded >= 0),
  created_at timestamptz not null default now()
);

-- 2. Indexes
create index if not exists idx_profiles_points_desc
  on public.profiles (points desc, bottles_saved desc);

create index if not exists idx_bottle_transactions_user_id
  on public.bottle_transactions (user_id, created_at desc);

create index if not exists idx_bottle_transactions_location_id
  on public.bottle_transactions (location_id);

create index if not exists idx_bottle_transactions_created_at
  on public.bottle_transactions (created_at desc);

-- 3. Private helper & trigger functions
create or replace function private.is_petugas()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'petugas'
  );
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Pengguna'
    ),
    'warga'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create or replace function private.prevent_profile_tampering()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select auth.uid()) is not null then
    if new.role is distinct from old.role
      or new.points is distinct from old.points
      or new.xp is distinct from old.xp
      or new.level is distinct from old.level
      or new.bottles_saved is distinct from old.bottles_saved
      or new.emission_kg is distinct from old.emission_kg
      or new.streak_days is distinct from old.streak_days
      or new.last_deposit_date is distinct from old.last_deposit_date then
      raise exception 'Kolom statistik dan role tidak dapat diubah secara langsung';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_prevent_profile_tampering on public.profiles;
create trigger trg_prevent_profile_tampering
  before update on public.profiles
  for each row execute function private.prevent_profile_tampering();

-- 4. Grants & RLS Policies
grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, update on public.locations to authenticated;
grant select on public.bottle_transactions to authenticated;

alter table public.profiles enable row level security;
alter table public.locations enable row level security;
alter table public.bottle_transactions enable row level security;

create policy "Authenticated users can view profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Authenticated users can view locations"
  on public.locations for select
  to authenticated
  using (true);

create policy "Petugas can update locations"
  on public.locations for update
  to authenticated
  using ((select private.is_petugas()))
  with check ((select private.is_petugas()));

create policy "Users can view own transactions or petugas can view all"
  on public.bottle_transactions for select
  to authenticated
  using ((select auth.uid()) = user_id or (select private.is_petugas()));

-- 5. Atomic RPCs
create or replace function public.deposit_bottles(
  p_location_id bigint,
  p_qty integer,
  p_plastic_type text,
  p_weight_kg numeric default null,
  p_condition text default 'Baik',
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_profile public.profiles%rowtype;
  v_loc public.locations%rowtype;
  v_weight numeric(10, 2);
  v_new_bottles integer;
  v_new_capacity integer;
  v_new_status text;
  v_points_awarded integer := 0;
  v_xp_gained integer := 0;
  v_emission_gained numeric(10, 2) := 0;
  v_new_xp integer;
  v_new_level integer;
  v_today date := (now() at time zone 'Asia/Jakarta')::date;
  v_new_streak integer;
  v_tx_id bigint;
begin
  if v_uid is null then
    raise exception 'Autentikasi diperlukan';
  end if;

  select * into v_profile
  from public.profiles
  where id = v_uid
  for update;

  if not found then
    raise exception 'Profil pengguna tidak ditemukan';
  end if;

  if p_plastic_type not in ('PET', 'HDPE', 'PP', 'Campuran') then
    raise exception 'Jenis plastik tidak valid';
  end if;

  if p_condition not in ('Baik', 'Rusak', 'Kotor') then
    raise exception 'Kondisi botol tidak valid';
  end if;

  if v_profile.role = 'warga' then
    if p_qty is null or p_qty < 1 or p_qty > 100 then
      raise exception 'Jumlah botol warga harus antara 1 sampai 100';
    end if;
  else
    if p_qty is null or p_qty < 1 or p_qty > 5000 then
      raise exception 'Jumlah botol petugas harus antara 1 sampai 5000';
    end if;
  end if;

  select * into v_loc
  from public.locations
  where id = p_location_id
  for update;

  if not found then
    raise exception 'Lokasi dropbox tidak ditemukan';
  end if;

  if v_profile.role = 'warga' and v_loc.status = 'full' then
    raise exception 'Dropbox sedang penuh atau ditutup';
  end if;

  v_weight := coalesce(p_weight_kg, round((p_qty * 0.025)::numeric, 2));
  if v_weight < 0 then
    raise exception 'Berat tidak boleh negatif';
  end if;

  v_new_bottles := least(v_loc.bottles + p_qty, v_loc.max_bottles);
  v_new_capacity := round((v_new_bottles::numeric / v_loc.max_bottles) * 100)::integer;

  if v_new_capacity >= 100 then
    v_new_status := 'full';
  elsif v_new_capacity >= 75 then
    v_new_status := 'high';
  elsif v_new_capacity >= 35 then
    v_new_status := 'mid';
  else
    v_new_status := 'low';
  end if;

  update public.locations
  set
    bottles = v_new_bottles,
    capacity = v_new_capacity,
    status = v_new_status,
    updated_at = now()
  where id = p_location_id;

  if v_profile.role = 'warga' then
    v_points_awarded := p_qty * 10;
    v_xp_gained := p_qty * 15;
    v_emission_gained := round((p_qty * 0.015)::numeric, 2);
    v_new_xp := v_profile.xp + v_xp_gained;
    v_new_level := 1 + floor(v_new_xp / 1000.0)::integer;

    if v_profile.last_deposit_date = v_today then
      v_new_streak := greatest(v_profile.streak_days, 1);
    elsif v_profile.last_deposit_date = (v_today - 1) then
      v_new_streak := v_profile.streak_days + 1;
    else
      v_new_streak := 1;
    end if;

    update public.profiles
    set
      points = v_profile.points + v_points_awarded,
      xp = v_new_xp,
      level = v_new_level,
      bottles_saved = v_profile.bottles_saved + p_qty,
      emission_kg = v_profile.emission_kg + v_emission_gained,
      streak_days = v_new_streak,
      last_deposit_date = v_today,
      updated_at = now()
    where id = v_uid;
  end if;

  insert into public.bottle_transactions (
    user_id,
    location_id,
    qty,
    weight_kg,
    plastic_type,
    condition,
    note,
    points_awarded
  )
  values (
    v_uid,
    p_location_id,
    p_qty,
    v_weight,
    p_plastic_type,
    p_condition,
    nullif(trim(coalesce(p_note, '')), ''),
    v_points_awarded
  )
  returning id into v_tx_id;

  return jsonb_build_object(
    'transaction_id', v_tx_id,
    'location_id', p_location_id,
    'bottles', v_new_bottles,
    'capacity', v_new_capacity,
    'status', v_new_status,
    'points_awarded', v_points_awarded
  );
end;
$$;

revoke all on function public.deposit_bottles(bigint, integer, text, numeric, text, text) from public, anon;
grant execute on function public.deposit_bottles(bigint, integer, text, numeric, text, text) to authenticated;

create or replace function public.update_location_status(
  p_location_id bigint,
  p_status text
)
returns public.locations
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_loc public.locations%rowtype;
  v_updated public.locations%rowtype;
begin
  if not (select private.is_petugas()) then
    raise exception 'Hanya petugas yang dapat mengubah status lokasi';
  end if;

  if p_status not in ('low', 'mid', 'high', 'full') then
    raise exception 'Status lokasi tidak valid';
  end if;

  select * into v_loc
  from public.locations
  where id = p_location_id
  for update;

  if not found then
    raise exception 'Lokasi dropbox tidak ditemukan';
  end if;

  update public.locations
  set
    status = p_status,
    capacity = case
      when p_status = 'full' then 100
      when p_status = 'low' then 0
      else v_loc.capacity
    end,
    bottles = case
      when p_status = 'full' then v_loc.max_bottles
      when p_status = 'low' then 0
      else v_loc.bottles
    end,
    updated_at = now()
  where id = p_location_id
  returning * into v_updated;

  return v_updated;
end;
$$;

revoke all on function public.update_location_status(bigint, text) from public, anon;
grant execute on function public.update_location_status(bigint, text) to authenticated;
