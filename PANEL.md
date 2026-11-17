# Panel admina - carameljewelry.pl/admin

## Jak z niego korzystać

1. Wejdź na **carameljewelry.pl/admin** i zaloguj się kontem z Supabase.
2. Zmieniaj, co chcesz. Każdy zapis od razu trafia do bazy, ale **jeszcze nie na stronę**.
   - **Prace** - dodawanie, edycja, kolejność w „Mojej pracowni” i na stronie głównej, zdjęcia (tylko `.webp`, do 10 MB), praca wyróżniona, ukrywanie.
   - **Kamienie** - dodawanie, edycja wszystkich pól karty, ilustracja (`.webp`), kolejność w grupie, ukrywanie.
   - **Teksty** - teksty strony głównej, „Mojej pracowni”, kontaktu (z FAQ) i opis marki w stopce.
     Fragment w `*gwiazdkach*` jest kursywą w kolorze akcentu.
3. Na końcu kliknij **Zapisz stronę**. Netlify przebuduje stronę - zmiany będą widoczne po ok. 2-3 minutach.
   Przycisk działa najwyżej raz na minutę.

Adres w linku (np. `poziomka`) też można zmieniać - stary link przestanie wtedy działać.

## Jak to działa (dla programisty)

- Dane: Supabase (projekt „Caramel Jewelry”) - tabele `prace`, `prace_zdjecia`, `kamienie`, `teksty`, `publikacje`, `admini`;
  zdjęcia w bucketach `prace` i `kamienie` (publiczne, tylko `image/webp`, do 10 MB).
- Uprawnienia (RLS): czytać może każdy (tylko widoczne prace i kamienie), zapisywać tylko konta z tabeli `admini`.
  Nowego admina dodaje się w SQL: `insert into public.admini (user_id) select id from auth.users where email = '…';`
- Schemat bazy: `supabase/migrations/`.
- Build: `scripts/dane.mjs` (uruchamia się przed `npm run dev` i `npm run build`) pobiera dane z Supabase,
  robi warianty zdjęć (480/800/1200/1600 px + rozmyty podgląd) do `public/zdjecia/p` i `public/zdjecia/k`
  i zapisuje `lib/dane/*.json`. Przetworzone zdjęcia trzyma w `node_modules/.cache/caramel-zdjecia`.
  Gdy Supabase nie odpowiada, build na Netlify się przerywa i zostaje poprzednia wersja strony.
- „Zapisz stronę”: `netlify/functions/publikuj.mts` (`POST /api/publikuj`) sprawdza sesję i uprawnienia admina,
  a potem wywołuje build hook z `NETLIFY_BUILD_HOOK`.
- Zmienne środowiskowe (lokalnie `.env.local`, na Netlify w ustawieniach projektu):
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NETLIFY_BUILD_HOOK`.
- Teksty domyślne i lista edytowalnych tekstów: `lib/teksty-domyslne.ts` (nowy klucz pojawi się w panelu sam).
- Zdjęcia dekoracyjne (hero, pasek Instagrama, zdjęcia pracowni) nadal generuje `scripts/zdjecia.mjs` - nie są w panelu.
