-- osobna kolejność prac na stronie głównej (pracownia ma swoją: kolumna kolejnosc)
alter table public.prace add column kolejnosc_glowna integer not null default 0;
