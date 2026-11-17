/**
 * Moje prace - jedno źródło danych dla strony głównej („Ręcznie zrobione”) i /pracownia.
 * Prace i ich zdjęcia pochodzą z panelu /admin (Supabase → scripts/dane.mjs → lib/dane/prace.json).
 * Zdjęcia dekoracyjne (pasek Instagram, pracownia, klimat) generuje scripts/zdjecia.mjs (lib/zdjecia.generated.ts).
 * Nie podaję cen ani właściwości kamieni.
 *
 * Uwaga: ten plik zawiera wszystkie dane zdjęć - importuj go tylko w komponentach serwerowych
 * i przekazuj potrzebne prace niżej. Typy i funkcje pomocnicze są w lib/prace-typy.ts.
 */
import type { Praca, Zdjecie } from "./prace-typy";
import PRACE_JSON from "./dane/prace.json";
import { ZDJECIA } from "./zdjecia.generated";

export type { Praca, TypPracy, Zdjecie } from "./prace-typy";

/**
 * Kadrowanie zdjęć w ramkach 4:5 (object-position) - tylko tam, gdzie środek nie wystarcza.
 * Klucz: <slug>-<nr>. Sprawdzone na wszystkich zdjęciach: biżuteria jest zawsze w całości widoczna.
 */
const POZYCJE: Record<string, string> = {
  "poziomka-01": "45% 50%",
  "czern-i-perla-01": "50% 20%",
  "czern-i-perla-05": "50% 15%",
  "czern-i-perla-07": "50% 15%",
  "serce-i-kluczyk-03": "50% 60%",
  "kolorowy-polksiezyc-04": "50% 45%",
  "kolorowy-medalion-04": "50% 65%",
  "kolory-natury-10": "50% 70%",
  "fioletowe-bransoletki-01": "50% 45%",
  "klimat-02": "50% 80%",
};

/** Buduje zdjęcie z wygenerowanych wariantów: zdjecie("poziomka", 0, "alt"). */
export function zdjecie(slug: string, i: number, alt: string, pozycja?: string): Zdjecie {
  const z = ZDJECIA[slug]?.[i];
  if (!z) throw new Error(`Brak zdjęcia ${slug} nr ${i + 1} - uruchom: node scripts/zdjecia.mjs`);
  const klucz = `${slug}-${String(i + 1).padStart(2, "0")}`;
  const sredni = z.warianty.find((v) => v.dluzszy >= 800) ?? z.warianty[z.warianty.length - 1];
  return {
    src: `${z.baza}-${sredni.dluzszy}.webp`,
    srcset: z.warianty.map((v) => `${z.baza}-${v.dluzszy}.webp ${v.w}w`).join(", "),
    alt,
    w: z.w,
    h: z.h,
    blur: z.blur,
    pozycja: pozycja ?? POZYCJE[klucz],
  };
}

/** Praca z pliku lib/dane/prace.json (scripts/dane.mjs pobiera ją z Supabase). */
type PracaDane = {
  slug: string;
  nazwa: string;
  typ: Praca["typ"];
  typEtykieta?: string;
  opis: string;
  alt: string;
  naGlownej: boolean;
  kolejnoscGlowna: number;
  wyrozniona: boolean;
  zdjecia: { baza: string; alt: string | null; pozycja: string | null; w: number; h: number; warianty: { dluzszy: number; w: number }[]; blur: string }[];
};

const DANE = PRACE_JSON as PracaDane[];

function zdjecieZDanych(z: PracaDane["zdjecia"][number], alt: string): Zdjecie {
  const sredni = z.warianty.find((v) => v.dluzszy >= 800) ?? z.warianty[z.warianty.length - 1];
  return {
    src: `${z.baza}-${sredni.dluzszy}.webp`,
    srcset: z.warianty.map((v) => `${z.baza}-${v.dluzszy}.webp ${v.w}w`).join(", "),
    alt,
    w: z.w,
    h: z.h,
    blur: z.blur,
    pozycja: z.pozycja ?? undefined,
  };
}

/** Wszystkie widoczne prace w kolejności z panelu (/pracownia). */
export const PRACE: Praca[] = DANE.map((d) => {
  const ile = d.zdjecia.length;
  const zdjecia = d.zdjecia.map((z, i) => zdjecieZDanych(z, z.alt ?? (ile > 1 && i > 0 ? `${d.alt} - zdjęcie ${i + 1}` : d.alt)));
  return {
    slug: d.slug,
    nazwa: d.nazwa,
    typ: d.typ,
    typEtykieta: d.typEtykieta,
    opis: d.opis,
    nazwaRobocza: false,
    okladka: zdjecia[0],
    zdjecia,
  };
});

export const getPraca = (slug: string) => PRACE.find((p) => p.slug === slug);

/** Prace na stronie głównej - zaznaczone w panelu, w kolejności „na stronie głównej”. */
export const PRACE_NA_GLOWNEJ: Praca[] = DANE.filter((d) => d.naGlownej)
  .sort((a, b) => a.kolejnoscGlowna - b.kolejnoscGlowna)
  .map((d) => getPraca(d.slug))
  .filter((p): p is Praca => Boolean(p));

/** Praca w karcie „Wyróżniona praca” w hero (zaznaczona w panelu; gdy żadna - pierwsza praca). */
export const WYROZNIONA_PRACA: Praca = getPraca(DANE.find((d) => d.wyrozniona)?.slug ?? "") ?? PRACE[0];

/** Zdjęcie w karcie „Wyróżniona praca” - drugie zdjęcie pracy (pionowe kadry), gdy jest, inaczej okładka. */
export const WYROZNIONA: Zdjecie = WYROZNIONA_PRACA.zdjecia[1] ?? WYROZNIONA_PRACA.okladka;

/** Pasek „Zajrzyj do mojej pracowni” na stronie głównej - kwadratowe kadry. */
export const PASEK_INSTAGRAM: Zdjecie[] = [
  zdjecie("kolory-natury", 9, "Bransoletka z koralików na nadgarstku", "50% 95%"),
  zdjecie("kolory-natury", 7, "Bransoletki Kolory natury w dłoni", "50% 75%"),
  zdjecie("kolory-natury", 0, "Bransoletka Kolory natury na kubku kawy", "50% 55%"),
  zdjecie("klimat", 0, "Bransoletka Caramel obok kota", "50% 45%"),
  zdjecie("klimat", 1, "Bransoletka Caramel przy filiżance kawy", "50% 50%"),
];

/** Okrągłe zdjęcie w karcie „Na zamówienie” (IMG_8299). */
export const NA_ZAMOWIENIE: Zdjecie = zdjecie("kolorowy-medalion", 3, "Kolorowy naszyjnik z koralików ze złotym medalikiem w dłoniach", "50% 72%");


/** Zdjęcia nastrojowe - bez karty pracy. */
export const KLIMAT: Zdjecie[] = [
  zdjecie("klimat", 0, "Bransoletka Caramel obok kota"),
  zdjecie("klimat", 1, "Bransoletka Caramel przy filiżance kawy"),
];

/** Zdjęcia pracowni (sekcja „Jak pracuję”) - widoczne tylko przy POKAZ_PRACOWNIE = true. */
export const PRACOWNIA = {
  biurko: zdjecie("pracownia", 1, "Moje biurko w pracowni z pudełkami koralików, narzędziami i lampą"),
  narzedzia: zdjecie("pracownia", 2, "Szczypce, nożyczki i pęseta na stole w mojej pracowni"),
  nawlekanie: zdjecie("pracownia", 0, "Szczypce i nawlekane naszyjniki z kolorowych koralików"),
  uklad: zdjecie("pracownia", 3, "Bransoletki ułożone na tablicy przed założeniem zapięć"),
  zapiecia: zdjecie("pracownia", 4, "Bransoletki na tablicy i zapięcia gotowe do zamocowania"),
  wykonczenie: zdjecie("pracownia", 5, "Wykańczanie bransoletek - zapięcia i szczypce"),
  pakowanie: zdjecie("pracownia", 6, "Papierowe torebki z logo Caramel"),
};
