# Start strony Caramel Jewelry - krok po kroku

Do dnia startu pod adresem `/` działa zapowiedź („już wkrótce”), a pełna strona jest pod `/podglad`
i ma ustawione `noindex, nofollow`. Poniżej wszystko, co trzeba zrobić, żeby pełna strona stała się publiczna.

## 1. Przed startem - uzupełnij dane (opcjonalnie, ale warto)

- `lib/site.ts` → `GEO`: miasto, województwo, obszar dostaw, sposób wysyłki (teraz są tam TODO).
- `lib/faq.ts`: dopisz pytania o cenę, wysyłkę, czas realizacji, płatność, zwroty, pielęgnację
  - tylko jeśli znasz odpowiedzi.
- `lib/prace.ts`: nazwy i opisy prac.

## 2. Przełącz stronę na publiczną

1. W `lib/site.ts` zmień `SITE_PUBLIC = false` na `SITE_PUBLIC = true`.
2. Podmień stronę główną:
   - przenieś `app/page.tsx` i `app/page.module.css` (zapowiedź) do folderu `_archiwum/` w głównym
     folderze projektu (albo usuń),
   - przenieś `app/(site)/podglad/page.tsx` do `app/(site)/page.tsx`,
   - usuń pusty folder `app/(site)/podglad/`.
3. W `netlify.toml` dopisz przekierowanie starego adresu podglądu:

   ```toml
   [[redirects]]
     from = "/podglad"
     to = "/"
     status = 301
   ```

Po zmianie flagi automatycznie:

- podstrony dostają `index, follow` zamiast `noindex, nofollow`,
- menu „Start” i logo prowadzą do `/`,
- `npm run build` tworzy `out/sitemap.xml`, `out/robots.txt` i `out/llms.txt`.

## 3. Zbuduj i sprawdź lokalnie

```bash
npm run build
```

Sprawdź, że w folderze `out/` są: `index.html` (pełna strona główna), `sitemap.xml`, `robots.txt`, `llms.txt`.
Podgląd lokalny: `npm run start`.

## 4. Wyślij na Netlify

Zrób commit i push gałęzi w GitHub Desktop - Netlify zbuduje stronę sam (`npm run build`, folder `out`).

## 5. Po wdrożeniu

- Otwórz `https://carameljewelry.pl/`, `/pracownia`, `/moc-kamieni`, `/kontakt` i `/sitemap.xml`.
- Dodaj domenę w Google Search Console i zgłoś mapę: `https://carameljewelry.pl/sitemap.xml`.
- Sprawdź podgląd linku (Open Graph), np. wklejając adres strony w wiadomości na Facebooku.
- Uruchom PageSpeed Insights dla strony głównej.

## Przydatne

- Zdjęcia: `node scripts/zdjecia.mjs` (konwersja z folderu źródłowego, można uruchamiać wielokrotnie).
- Sekcję „Jak pracuję” ze zdjęciami pracowni wyłącza `POKAZ_PRACOWNIE = false` w `lib/site.ts`.
- Korektę zdjęć (jasność, ostrość) wyłącza `KOREKTA = false` w `scripts/zdjecia.mjs`.
- Folder `public/_archiwum/` zawiera stare, nieużywane zdjęcia. Jest w `public/`, więc trafia też na serwer
  (bez linków i z blokadą w `robots.txt`). Przed startem możesz go przenieść poza `public/`.
