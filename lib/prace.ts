/**
 * Moje prace - jedno źródło danych dla strony głównej („Ręcznie zrobione”) i /pracownia.
 * Zdjęcia, ich rozmiary i rozmyte podglądy generuje scripts/zdjecia.mjs (lib/zdjecia.generated.ts).
 * Nie podaję cen ani właściwości kamieni.
 *
 * Uwaga: ten plik zawiera wszystkie dane zdjęć - importuj go tylko w komponentach serwerowych
 * i przekazuj potrzebne prace niżej. Typy i funkcje pomocnicze są w lib/prace-typy.ts.
 */
import type { Praca, Zdjecie } from "./prace-typy";
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

type Wpis = Omit<Praca, "okladka" | "zdjecia" | "nazwaRobocza"> & {
  alt: string;
  nazwaRobocza?: boolean;
  /** Alty kolejnych zdjęć, gdy inne niż alt pracy. */
  alty?: Record<number, string>;
};

const WPISY: Wpis[] = [
  {
    slug: "poziomka",
    nazwa: "Poziomka",
    typ: "naszyjnik",
    opis: "Perełki i czerwone poziomki - naszyjnik, który pachnie latem.",
    alt: "Naszyjnik Poziomka z perełek z zawieszkami w kształcie truskawek",
    alty: { 1: "Naszyjnik Poziomka - zbliżenie perełek i zawieszek-truskawek" },
  },
  {
    slug: "czern-i-perla",
    nazwa: "Czerń i perła",
    typ: "zestaw",
    opis: "Klasyka w moim wydaniu - czerń i perła, które pasują do wszystkiego.",
    alt: "Czarno-perłowy naszyjnik i bransoletka ręcznie robione",
  },
  {
    slug: "skorpion",
    nazwa: "Skorpion",
    typ: "zestaw",
    opis: "Znak zodiaku zamknięty w medalionie.",
    alt: "Naszyjnik i bransoletka ze srebrnym medalionem ze znakiem Skorpiona",
  },
  {
    slug: "kolory-natury",
    nazwa: "Kolory natury",
    typ: "bransoletka",
    typEtykieta: "Kolekcja bransoletek",
    opis: "Zielenie, róże i brązy - bransoletki, które łatwo łączyć ze sobą.",
    alt: "Bransoletki z koralików w kolorach zieleni, różu i brązu",
  },
  {
    slug: "kolorowy-polksiezyc",
    nazwa: "Kolorowy półksiężyc",
    typ: "zestaw",
    opis: "Kolorowe koraliki i złoty półksiężyc - na co dzień i od święta.",
    alt: "Kolorowy naszyjnik z półksiężycem i bransoletka",
  },
  {
    slug: "blisko-serca",
    nazwa: "Blisko serca",
    typ: "naszyjnik",
    opis: "Delikatny róż i medalik, który nosi się blisko serca.",
    alt: "Naszyjnik z różowych koralików ze złotym medalikiem z Maryją",
  },
  {
    // zawieszka to serce z jaspisu dalmatyńskiego (poprawka autorki - nie „serce w kropki”)
    slug: "dalmatynskie-serce",
    nazwa: "Dalmatyńskie serce",
    typ: "naszyjnik",
    opis: "Perełki, róż i serce z jaspisu dalmatyńskiego - słodko, ale z charakterem.",
    alt: "Naszyjnik z perełek z zawieszką-sercem z jaspisu dalmatyńskiego",
  },
  {
    slug: "czarny-polksiezyc",
    nazwa: "Czarny półksiężyc",
    typ: "naszyjnik",
    opis: "Czerń i złoto - minimalistycznie, z księżycem na środku.",
    alt: "Czarny naszyjnik z koralików ze złotym półksiężycem",
  },
  {
    slug: "serce-i-kluczyk",
    nazwa: "Serce i kluczyk",
    typ: "naszyjnik",
    opis: "Serduszko i kluczyk - mały sekret w biżuterii.",
    alt: "Naszyjnik z czarnym serduszkiem i złotym kluczykiem",
  },
  {
    slug: "kolorowy-medalion",
    nazwa: "Kolorowy medalion",
    typ: "zestaw",
    opis: "Dużo koloru i złote detale - zestaw na dobry humor.",
    alt: "Wielokolorowy naszyjnik ze złotym medalikiem oraz bransoletka",
  },
  {
    slug: "szary-medalion",
    nazwa: "Szary medalion",
    typ: "naszyjnik",
    opis: "Stonowane szarości i złota blaszka - elegancko na co dzień.",
    alt: "Szaro-czarny naszyjnik ze złotą okrągłą zawieszką",
  },
  {
    slug: "zielono-bialy",
    nazwa: "Zieleń i biel",
    typ: "zestaw",
    opis: "Zieleń, biel i odrobina czerni - świeży, naturalny zestaw.",
    alt: "Naszyjnik i bransoletka z zielonych, białych i czarnych koralików",
  },
  {
    slug: "fioletowe-bransoletki",
    nazwa: "Fioletowe bransoletki",
    typ: "bransoletka",
    typEtykieta: "Dwie bransoletki",
    opis: "Fiolet w surowej formie - dwie bransoletki do noszenia razem.",
    alt: "Dwie bransoletki z fioletowymi kamieniami",
  },
  {
    slug: "perla-i-braz",
    nazwa: "Perła i brąz",
    typ: "bransoletka",
    opis: "Perła i ciepły brąz - spokojna bransoletka na każdy dzień.",
    alt: "Bransoletka z perełek i brązowych koralików w dłoni",
  },
  {
    slug: "dlugi-naszyjnik",
    nazwa: "Długi naszyjnik",
    typ: "naszyjnik",
    opis: "Długi, w ciepłych kolorach - brąz i perła.",
    alt: "Długi naszyjnik z brązowych i perłowych koralików na kryształowym kielichu",
  },
  {
    slug: "trzy-bransoletki",
    nazwa: "Trio bransoletek",
    typ: "bransoletka",
    typEtykieta: "Trzy bransoletki",
    opis: "Trzy charaktery - do wyboru albo wszystkie naraz.",
    alt: "Trzy bransoletki z koralików na satynowym tle",
  },
];

export const PRACE: Praca[] = WPISY.map(({ alt, alty, nazwaRobocza, ...w }) => {
  const ile = ZDJECIA[w.slug]?.length ?? 0;
  const zdjecia = Array.from({ length: ile }, (_, i) =>
    zdjecie(w.slug, i, alty?.[i] ?? (ile > 1 && i > 0 ? `${alt} - zdjęcie ${i + 1}` : alt)),
  );
  return { ...w, nazwaRobocza: nazwaRobocza ?? false, okladka: zdjecia[0], zdjecia };
});

export const getPraca = (slug: string) => PRACE.find((p) => p.slug === slug);

/** Prace na stronie głównej - najładniejsze zdjęcia (prace 1-7 i 10). */
export const PRACE_NA_GLOWNEJ = [
  "czern-i-perla",
  "poziomka",
  "kolorowy-polksiezyc",
  "dalmatynskie-serce",
  "kolory-natury",
  "blisko-serca",
  "kolorowy-medalion",
  "skorpion",
]
  .map(getPraca)
  .filter((p): p is Praca => Boolean(p));

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

/** Zdjęcie w karcie „Wyróżniona praca” w hero. */
export const WYROZNIONA: Zdjecie = zdjecie("poziomka", 1, "Naszyjnik Poziomka z perełek z zawieszkami w kształcie truskawek");

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
