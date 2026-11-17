-- jest_adminem() nie musi być dostępna przez API (/rest/v1/rpc) - przenoszę ją do schematu,
-- którego Supabase nie wystawia. Zasady RLS odwołują się do funkcji po OID, więc działają dalej.
create schema if not exists prywatne;
revoke all on schema prywatne from public;
grant usage on schema prywatne to anon, authenticated;
alter function public.jest_adminem() set schema prywatne;
revoke all on function prywatne.jest_adminem() from public;
grant execute on function prywatne.jest_adminem() to anon, authenticated;
