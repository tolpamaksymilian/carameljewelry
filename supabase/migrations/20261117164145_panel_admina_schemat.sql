-- Panel admina Caramel Jewelry: prace, kamienie, teksty stron, admini, publikacje.
-- Zasada: wszyscy mogą czytać to, co opublikowane (build strony używa klucza anon),
-- zapisywać mogą tylko konta z tabeli public.admini.

-- ---------------------------------------------------------------------------
-- Admini i funkcja sprawdzająca
-- ---------------------------------------------------------------------------
create table public.admini (
  user_id uuid primary key references auth.users (id) on delete cascade,
  dodano timestamptz not null default now()
);
alter table public.admini enable row level security;

-- security definer: działa także wtedy, gdy RLS ukrywa tabelę admini przed zwykłym użytkownikiem
create function public.jest_adminem()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admini where user_id = (select auth.uid()));
$$;
revoke all on function public.jest_adminem() from public;
grant execute on function public.jest_adminem() to anon, authenticated;

create policy "admin widzi listę adminów" on public.admini
  for select to authenticated using ((select public.jest_adminem()));

-- wspólny wyzwalacz: data ostatniej zmiany
create function public.ustaw_zmieniono()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.zmieniono := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Prace (/pracownia, strona główna)
-- ---------------------------------------------------------------------------
create table public.prace (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nazwa text not null check (length(trim(nazwa)) > 0),
  typ text not null check (typ in ('naszyjnik', 'bransoletka', 'zestaw')),
  typ_etykieta text,
  opis text not null default '',
  alt text not null default '',
  kolejnosc integer not null default 0,
  na_glownej boolean not null default false,
  wyrozniona boolean not null default false,
  widoczna boolean not null default true,
  utworzono timestamptz not null default now(),
  zmieniono timestamptz not null default now()
);
create index prace_kolejnosc_idx on public.prace (kolejnosc);
create trigger prace_zmieniono before update on public.prace
  for each row execute function public.ustaw_zmieniono();

create table public.prace_zdjecia (
  id uuid primary key default gen_random_uuid(),
  praca_id uuid not null references public.prace (id) on delete cascade,
  -- ścieżka w buckecie „prace”, np. poziomka/01.webp
  plik text not null check (plik ~* '\.webp$'),
  alt text,
  -- kadrowanie w ramce (object-position), np. „50% 20%”
  pozycja text,
  kolejnosc integer not null default 0,
  utworzono timestamptz not null default now()
);
create index prace_zdjecia_praca_idx on public.prace_zdjecia (praca_id, kolejnosc);

-- ---------------------------------------------------------------------------
-- Kamienie (/moc-kamieni)
-- ---------------------------------------------------------------------------
create table public.kamienie (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nazwa text not null check (length(trim(nazwa)) > 0),
  alias text,
  grupa text not null check (grupa in ('spokoj', 'milosc', 'radosc', 'sila', 'przemiana', 'intuicja')),
  akcent text not null default '#8B4A1E' check (akcent ~* '^#[0-9a-f]{6}$'),
  slowa_kluczowe text not null default '',
  znaki text[] not null default '{}',
  czakra text,
  numerologia_liczba integer,
  numerologia_opis text,
  zywiol text,
  planeta text,
  symbolika text not null default '',
  intencja text,
  opis text,
  ciekawostka text not null default '',
  pielegnacja text not null default '',
  -- ścieżka w buckecie „kamienie”, np. ametyst.webp
  ilustracja text check (ilustracja is null or ilustracja ~* '\.webp$'),
  kolejnosc integer not null default 0,
  widoczny boolean not null default true,
  utworzono timestamptz not null default now(),
  zmieniono timestamptz not null default now()
);
create index kamienie_kolejnosc_idx on public.kamienie (grupa, kolejnosc);
create trigger kamienie_zmieniono before update on public.kamienie
  for each row execute function public.ustaw_zmieniono();

-- ---------------------------------------------------------------------------
-- Teksty stron (strona główna, kontakt, pracownia) - klucz → treść
-- ---------------------------------------------------------------------------
create table public.teksty (
  klucz text primary key check (klucz ~ '^[a-z0-9_.-]+$'),
  strona text not null,
  etykieta text not null,
  tresc text not null default '',
  kolejnosc integer not null default 0,
  zmieniono timestamptz not null default now()
);
create trigger teksty_zmieniono before update on public.teksty
  for each row execute function public.ustaw_zmieniono();

-- ---------------------------------------------------------------------------
-- Publikacje („Zapisz stronę” → przebudowa na Netlify)
-- ---------------------------------------------------------------------------
create table public.publikacje (
  id bigint generated always as identity primary key,
  kto uuid references auth.users (id) on delete set null,
  utworzono timestamptz not null default now(),
  status text not null default 'wyslano' check (status in ('wyslano', 'blad')),
  komunikat text
);

-- ---------------------------------------------------------------------------
-- RLS: czytanie publiczne (tylko widoczne), zapis tylko admini
-- ---------------------------------------------------------------------------
alter table public.prace enable row level security;
alter table public.prace_zdjecia enable row level security;
alter table public.kamienie enable row level security;
alter table public.teksty enable row level security;
alter table public.publikacje enable row level security;

create policy "czytanie widocznych prac" on public.prace
  for select to anon, authenticated using (widoczna or (select public.jest_adminem()));
create policy "admin zmienia prace (dodawanie)" on public.prace
  for insert to authenticated with check ((select public.jest_adminem()));
create policy "admin zmienia prace (edycja)" on public.prace
  for update to authenticated using ((select public.jest_adminem())) with check ((select public.jest_adminem()));
create policy "admin zmienia prace (usuwanie)" on public.prace
  for delete to authenticated using ((select public.jest_adminem()));

create policy "czytanie zdjęć widocznych prac" on public.prace_zdjecia
  for select to anon, authenticated using (
    exists (select 1 from public.prace p where p.id = praca_id and (p.widoczna or (select public.jest_adminem())))
  );
create policy "admin zmienia zdjęcia prac (dodawanie)" on public.prace_zdjecia
  for insert to authenticated with check ((select public.jest_adminem()));
create policy "admin zmienia zdjęcia prac (edycja)" on public.prace_zdjecia
  for update to authenticated using ((select public.jest_adminem())) with check ((select public.jest_adminem()));
create policy "admin zmienia zdjęcia prac (usuwanie)" on public.prace_zdjecia
  for delete to authenticated using ((select public.jest_adminem()));

create policy "czytanie widocznych kamieni" on public.kamienie
  for select to anon, authenticated using (widoczny or (select public.jest_adminem()));
create policy "admin zmienia kamienie (dodawanie)" on public.kamienie
  for insert to authenticated with check ((select public.jest_adminem()));
create policy "admin zmienia kamienie (edycja)" on public.kamienie
  for update to authenticated using ((select public.jest_adminem())) with check ((select public.jest_adminem()));
create policy "admin zmienia kamienie (usuwanie)" on public.kamienie
  for delete to authenticated using ((select public.jest_adminem()));

create policy "czytanie tekstów" on public.teksty
  for select to anon, authenticated using (true);
create policy "admin zmienia teksty (dodawanie)" on public.teksty
  for insert to authenticated with check ((select public.jest_adminem()));
create policy "admin zmienia teksty (edycja)" on public.teksty
  for update to authenticated using ((select public.jest_adminem())) with check ((select public.jest_adminem()));
create policy "admin zmienia teksty (usuwanie)" on public.teksty
  for delete to authenticated using ((select public.jest_adminem()));

create policy "admin widzi publikacje" on public.publikacje
  for select to authenticated using ((select public.jest_adminem()));
create policy "admin dodaje publikacje" on public.publikacje
  for insert to authenticated with check ((select public.jest_adminem()) and kto = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Storage: dwa publiczne buckety, wyłącznie pliki .webp do 10 MB
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('prace', 'prace', true, 10485760, array['image/webp']),
  ('kamienie', 'kamienie', true, 10485760, array['image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- publiczny bucket: pliki są dostępne pod publicznym adresem bez zasady select
-- (brak zasady select = nikt nie może wylistować zawartości bucketu przez API)
create policy "admin wgrywa zdjęcia" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('prace', 'kamienie') and (select public.jest_adminem()) and lower(name) like '%.webp');
create policy "admin zmienia zdjęcia" on storage.objects
  for update to authenticated
  using (bucket_id in ('prace', 'kamienie') and (select public.jest_adminem()))
  with check (bucket_id in ('prace', 'kamienie') and (select public.jest_adminem()) and lower(name) like '%.webp');
create policy "admin usuwa zdjęcia" on storage.objects
  for delete to authenticated
  using (bucket_id in ('prace', 'kamienie') and (select public.jest_adminem()));
create policy "admin widzi zdjęcia" on storage.objects
  for select to authenticated
  using (bucket_id in ('prace', 'kamienie') and (select public.jest_adminem()));
