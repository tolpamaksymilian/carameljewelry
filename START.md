# Strona Caramel Jewelry - stan po starcie (2026-11-17)

Pełna strona działa pod `/` i jest indeksowana (`SITE_PUBLIC = true` w `lib/site.ts`).
Dawny adres podglądu `/podglad` przekierowuje na `/` (301, `netlify.toml`). Zapowiedź „już wkrótce” została usunięta
(jest w historii gita).

Treści (prace, zdjęcia, kamienie, teksty) zmienia się w panelu `/admin` - instrukcja: `PANEL.md`.

## Po wdrożeniu - do zrobienia raz

- Otwórz `https://carameljewelry.pl/`, `/pracownia`, `/moc-kamieni`, `/kontakt`, `/sitemap.xml` i `/podglad`
  (powinien przenieść na stronę główną).
- Dodaj domenę w Google Search Console i zgłoś mapę strony: `https://carameljewelry.pl/sitemap.xml`.
- Sprawdź podgląd linku (Open Graph), np. wklejając adres strony w wiadomości na Facebooku.
- Uruchom PageSpeed Insights dla strony głównej.

## Do uzupełnienia, gdy będą dane

- `lib/site.ts` → `GEO`: miasto, województwo, obszar dostaw, sposób wysyłki.
- Panel → Teksty → Kontakt: pytania o cenę, wysyłkę, czas realizacji, płatność, zwroty (dziś jest 6 pytań).

## Przydatne

- Zdjęcia dekoracyjne (hero, pasek Instagrama, pracownia): `node scripts/zdjecia.mjs` (z folderu źródłowego).
- Sekcję „Jak pracuję” wyłącza `POKAZ_PRACOWNIE = false` w `lib/site.ts`.
- Ukrycie strony przed wyszukiwarkami: `SITE_PUBLIC = false` (noindex, bez mapy strony).
- Stare, nieużywane zdjęcia są w `_archiwum/` (poza `public/`, nie trafiają na serwer).
