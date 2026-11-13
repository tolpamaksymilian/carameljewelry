# Caramel Handmade Jewelry — strona internetowa

Next.js (App Router, TypeScript) w trybie **eksportu statycznego** (`output: "export"`), hostowany na Netlify Free — bez serwera, SSR ani funkcji serverless.

## Polecenia

| Polecenie | Co robi |
|---|---|
| `npm install` | instalacja zależności |
| `npm run dev` | serwer deweloperski — http://localhost:3000 |
| `npm run build` | eksport statyczny do `out/` |
| `npm run start` | podgląd zbudowanego `out/` (przez `serve`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | kontrola TypeScript |

## Struktura

```
app/
  layout.tsx        – <html lang="pl">, fonty, metadane SEO, viewport
  page.tsx          – strona główna (zapowiedź)
  not-found.tsx     – strona 404 (→ out/404.html)
  icon.png          – favicon (litera C z logo)
  apple-icon.png    – ikona dla iPhone/iPad
  globals.css       – paleta marki, tło, animacje
components/         – BrandLogo, BeadGarland (naszyjnik), BeadDivider, Sparkles, Stage (ramka), Typography
public/brand/       – caramel-logo.webp (logo z przezroczystym tłem)
config/site.ts      – nazwa, opis, indeksowanie, przyszłe linki social
lib/fonts.ts        – Cormorant Garamond + Jost (hostowane lokalnie)
netlify.toml        – build `npm run build`, publish `out`
```

## SEO i indeksowanie

Strona tymczasowa ma `noindex, nofollow`. Po starcie pełnej strony zmień w `config/site.ts`:

```ts
allowIndexing: true,
```

Opcjonalnie w Netlify ustaw zmienną `NEXT_PUBLIC_SITE_URL=https://twojadomena.pl` (adres kanoniczny / Open Graph).

## Nowe podstrony

Utwórz folder w `app/`, np. `app/kolekcje/page.tsx` → adres `/kolekcje`. Zdjęcia umieszczaj w `public/`.
