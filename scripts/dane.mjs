/**
 * Dane strony z Supabase (to, co zmienia się w panelu /admin):
 *   - prace i ich zdjęcia  → lib/dane/prace.json   + public/zdjecia/p/…  (480/800/1200/1600 px, rozmyty podgląd)
 *   - kamienie             → lib/dane/kamienie.json + public/zdjecia/k/…
 *   - teksty stron         → lib/dane/teksty.json
 *
 * Uruchamia się samo przed `npm run dev` i `npm run build` (predev / prebuild).
 * Przetworzone zdjęcia trzymam w node_modules/.cache/caramel-zdjecia - Netlify zachowuje ten folder
 * między buildami, więc każde zdjęcie przetwarza się tylko raz.
 *
 * Gdy Supabase nie odpowiada: na Netlify build się przerywa (zostaje poprzednia wersja strony),
 * lokalnie zostają ostatnie zapisane dane.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DANE = path.join(ROOT, "lib", "dane");
const PUB_P = path.join(ROOT, "public", "zdjecia", "p");
const PUB_K = path.join(ROOT, "public", "zdjecia", "k");
const CACHE = path.join(ROOT, "node_modules", ".cache", "caramel-zdjecia");
const NA_SERWERZE = Boolean(process.env.NETLIFY || process.env.CI);

const ROZMIARY = [480, 800, 1200, 1600];
const JAKOSC = 80;
const KAMIEN_MAX = 1200;

// ---------- konfiguracja (lokalnie z .env.local, na Netlify ze zmiennych środowiskowych) ----------
function wczytajEnv() {
  for (const plik of [".env.local", ".env"]) {
    const p = path.join(ROOT, plik);
    if (!fs.existsSync(p)) continue;
    for (const linia of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = linia.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}
wczytajEnv();
const URL_SB = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  .replace(/\/+$/, "")
  .replace(/\/(rest|auth|storage)\/v1$/, "");
const KLUCZ = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

function koniec(komunikat) {
  if (NA_SERWERZE) {
    console.error(`dane: BŁĄD - ${komunikat}. Build przerwany, na stronie zostaje poprzednia wersja.`);
    process.exit(1);
  }
  console.warn(`dane: ${komunikat} - zostają ostatnie zapisane dane (lib/dane/*.json).`);
  process.exit(0);
}

if (!URL_SB || !KLUCZ) koniec("brak NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");

async function rest(zapytanie) {
  const r = await fetch(`${URL_SB}/rest/v1/${zapytanie}`, { headers: { apikey: KLUCZ, Authorization: `Bearer ${KLUCZ}` } });
  if (!r.ok) throw new Error(`${zapytanie.split("?")[0]}: HTTP ${r.status}`);
  return r.json();
}

const publiczny = (bucket, plik) => `${URL_SB}/storage/v1/object/public/${bucket}/${plik.split("/").map(encodeURIComponent).join("/")}`;

async function pobierz(bucket, plik) {
  const r = await fetch(publiczny(bucket, plik));
  if (!r.ok) throw new Error(`zdjęcie ${bucket}/${plik}: HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

// ---------- zdjęcia prac: warianty + rozmyty podgląd, z pamięcią podręczną ----------
const stem = (plik) => plik.replace(/\.webp$/i, "");

async function zdjeciePracy(plik) {
  const dir = path.join(CACHE, "p", stem(plik));
  const metaPlik = path.join(dir, "meta.json");
  if (fs.existsSync(metaPlik)) {
    const meta = JSON.parse(fs.readFileSync(metaPlik, "utf8"));
    if (meta.warianty.every((v) => fs.existsSync(path.join(dir, `${v.dluzszy}.webp`)))) return { meta, dir, nowe: false };
  }
  const zrodlo = await pobierz("prace", plik);
  const obraz = sharp(zrodlo).rotate();
  const { width: w0, height: h0 } = await obraz.metadata();
  const dluzszy0 = Math.max(w0, h0);
  const rozmiary = [...new Set([...ROZMIARY.filter((r) => r < dluzszy0), Math.min(dluzszy0, ROZMIARY.at(-1))])];
  fs.mkdirSync(dir, { recursive: true });
  const warianty = [];
  for (const d of rozmiary) {
    const out = await sharp(zrodlo)
      .rotate()
      .resize({ width: w0 >= h0 ? d : undefined, height: h0 > w0 ? d : undefined, withoutEnlargement: true })
      .webp({ quality: JAKOSC })
      .toBuffer({ resolveWithObject: true });
    fs.writeFileSync(path.join(dir, `${d}.webp`), out.data);
    warianty.push({ dluzszy: d, w: out.info.width });
  }
  const najw = warianty.at(-1);
  const h = Math.round((najw.w * h0) / w0);
  const blur = await sharp(zrodlo).rotate().resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  const meta = { w: najw.w, h, warianty, blur: `data:image/webp;base64,${blur.toString("base64")}` };
  fs.writeFileSync(metaPlik, JSON.stringify(meta));
  return { meta, dir, nowe: true };
}

async function ilustracjaKamienia(plik) {
  const cel = path.join(CACHE, "k", plik);
  if (!fs.existsSync(cel)) {
    const zrodlo = await pobierz("kamienie", plik);
    fs.mkdirSync(path.dirname(cel), { recursive: true });
    const out = await sharp(zrodlo).rotate().resize({ width: KAMIEN_MAX, height: KAMIEN_MAX, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    fs.writeFileSync(cel, out);
    return { cel, nowe: true };
  }
  return { cel, nowe: false };
}

function zapiszJesliInny(plik, dane) {
  const tresc = JSON.stringify(dane, null, 1) + "\n";
  if (fs.existsSync(plik) && fs.readFileSync(plik, "utf8") === tresc) return;
  fs.writeFileSync(plik, tresc);
}

// ---------- główna część ----------
let prace, kamienie, teksty;
try {
  [prace, kamienie, teksty] = await Promise.all([
    rest("prace?select=*,prace_zdjecia(*)&widoczna=eq.true&order=kolejnosc.asc,nazwa.asc"),
    rest("kamienie?select=*&widoczny=eq.true&order=kolejnosc.asc,nazwa.asc"),
    rest("teksty?select=klucz,tresc"),
  ]);
} catch (e) {
  koniec(`nie udało się pobrać danych z Supabase (${e.message})`);
}
if (!prace.length || !kamienie.length) koniec("w bazie nie ma prac albo kamieni");

fs.mkdirSync(DANE, { recursive: true });
fs.rmSync(PUB_P, { recursive: true, force: true });
fs.rmSync(PUB_K, { recursive: true, force: true });

let noweZdj = 0;
const praceWynik = [];
for (const p of prace) {
  const zdjecia = [];
  for (const z of [...p.prace_zdjecia].sort((a, b) => a.kolejnosc - b.kolejnosc)) {
    try {
      const { meta, dir, nowe } = await zdjeciePracy(z.plik);
      if (nowe) noweZdj++;
      const cel = path.join(PUB_P, stem(z.plik));
      fs.mkdirSync(path.dirname(cel), { recursive: true });
      for (const v of meta.warianty) fs.copyFileSync(path.join(dir, `${v.dluzszy}.webp`), `${cel}-${v.dluzszy}.webp`);
      zdjecia.push({ baza: `/zdjecia/p/${stem(z.plik)}`, alt: z.alt, pozycja: z.pozycja, ...meta });
    } catch (e) {
      if (NA_SERWERZE) koniec(e.message);
      console.warn(`dane: pomijam zdjęcie - ${e.message}`);
    }
  }
  if (!zdjecia.length) {
    console.warn(`dane: praca „${p.nazwa}” nie ma zdjęć - nie pokazuję jej na stronie.`);
    continue;
  }
  praceWynik.push({
    slug: p.slug,
    nazwa: p.nazwa,
    typ: p.typ,
    typEtykieta: p.typ_etykieta || undefined,
    opis: p.opis,
    alt: p.alt || p.nazwa,
    naGlownej: p.na_glownej,
    kolejnoscGlowna: p.kolejnosc_glowna,
    wyrozniona: p.wyrozniona,
    zdjecia,
  });
}

let noweKam = 0;
const kamienieWynik = [];
for (const k of kamienie) {
  let image = "";
  if (k.ilustracja) {
    try {
      const { cel, nowe } = await ilustracjaKamienia(k.ilustracja);
      if (nowe) noweKam++;
      fs.mkdirSync(PUB_K, { recursive: true });
      fs.copyFileSync(cel, path.join(PUB_K, path.basename(k.ilustracja)));
      image = `/zdjecia/k/${path.basename(k.ilustracja)}`;
    } catch (e) {
      if (NA_SERWERZE) koniec(e.message);
      console.warn(`dane: pomijam ilustrację - ${e.message}`);
    }
  }
  kamienieWynik.push({
    slug: k.slug,
    name: k.nazwa,
    alias: k.alias || undefined,
    image,
    accent: k.akcent,
    group: k.grupa,
    keywords: k.slowa_kluczowe,
    zodiac: k.znaki,
    chakra: k.czakra || undefined,
    numerology: k.numerologia_liczba != null ? { n: k.numerologia_liczba, text: k.numerologia_opis ?? "" } : undefined,
    element: k.zywiol || undefined,
    planet: k.planeta || undefined,
    description: k.opis || undefined,
    symbolism: k.symbolika,
    intention: k.intencja || undefined,
    fact: k.ciekawostka,
    care: k.pielegnacja,
    kolejnosc: k.kolejnosc,
  });
}

zapiszJesliInny(path.join(DANE, "prace.json"), praceWynik);
zapiszJesliInny(path.join(DANE, "kamienie.json"), kamienieWynik);
zapiszJesliInny(path.join(DANE, "teksty.json"), Object.fromEntries(teksty.map((t) => [t.klucz, t.tresc])));

console.log(
  `dane: ${praceWynik.length} prac, ${kamienieWynik.length} kamieni, ${teksty.length} tekstów` +
    ` (nowe zdjęcia: ${noweZdj}, nowe ilustracje: ${noweKam}).`,
);
