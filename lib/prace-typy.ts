/** Typy i drobne funkcje dla prac - bez danych, bezpieczne dla komponentów klienckich. */

export type TypPracy = "naszyjnik" | "bransoletka" | "zestaw";

export type Zdjecie = {
  /** Domyślny plik (średni rozmiar). */
  src: string;
  /** Wszystkie rozmiary: „…-480.webp 360w, …-800.webp 600w, …”. */
  srcset: string;
  alt: string;
  /** Wymiary największej wersji - do proporcji (zero przeskoków układu). */
  w: number;
  h: number;
  /** Rozmyty podgląd (base64). */
  blur: string;
  /** Kadrowanie w ramce (object-position), domyślnie środek. */
  pozycja?: string;
};

export type Praca = {
  slug: string;
  nazwa: string;
  typ: TypPracy;
  /** Podpis typu na karcie, gdy inny niż domyślny (np. „Kolekcja bransoletek”). */
  typEtykieta?: string;
  opis: string;
  okladka: Zdjecie;
  zdjecia: Zdjecie[];
  /** true = nazwa robocza, do potwierdzenia. */
  nazwaRobocza: boolean;
};

export const TYP_ETYKIETA: Record<TypPracy, string> = {
  naszyjnik: "Naszyjnik",
  bransoletka: "Bransoletka",
  zestaw: "Naszyjnik i bransoletka",
};

export const etykietaTypu = (p: Praca) => p.typEtykieta ?? TYP_ETYKIETA[p.typ];

/** „2 zdjęcia”, „5 zdjęć” - polska odmiana. */
export function liczbaZdjec(n: number) {
  const d = n % 10;
  const dd = n % 100;
  if (n === 1) return "1 zdjęcie";
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return `${n} zdjęcia`;
  return `${n} zdjęć`;
}

/** „3 prace”, „16 prac”. */
export function liczbaPrac(n: number) {
  const d = n % 10;
  const dd = n % 100;
  if (n === 1) return "1 praca";
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return `${n} prace`;
  return `${n} prac`;
}

/** Do filtrów: zestaw liczy się i jako naszyjnik, i jako bransoletka. */
export const maNaszyjnik = (p: Praca) => p.typ === "naszyjnik" || p.typ === "zestaw";
export const maBransoletke = (p: Praca) => p.typ === "bransoletka" || p.typ === "zestaw";
