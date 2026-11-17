import KAMIENIE_JSON from "./dane/kamienie.json";

/**
 * Moc kamieni - jedno źródło danych dla strony głównej (/podglad) i podstron /moc-kamieni.
 * Treści kamieni edytuje się w panelu /admin (pierwotnie: dokument autorki „kamienie.docx” i dawne opisy).
 * Tu są tylko grupy, znaki zodiaku, źródła ciekawostek i funkcje pomocnicze.
 * Puste pola kamienia nie pojawiają się na stronie.
 */

/** Grupy kamieni - podział według tego, czego ktoś szuka (zamiast żywiołów). */
export type GroupId = "spokoj" | "milosc" | "radosc" | "sila" | "przemiana" | "intuicja";

export type Group = {
  id: GroupId;
  /** Krótka nazwa na przyciskach. */
  short: string;
  /** Pełna nazwa (nagłówki, etykieta nad nazwą kamienia). */
  title: string;
  /** Jedno zdanie pod nagłówkiem grupy. */
  lead: string;
  /** Dopełnienie do „Inne kamienie …”. */
  na: string;
};

export const GROUPS: Group[] = [
  { id: "spokoj", short: "Spokój", title: "Spokój i równowaga", lead: "Na wyciszenie, cierpliwość i poczucie, że wszystko jest na swoim miejscu.", na: "na spokój i równowagę" },
  { id: "milosc", short: "Miłość", title: "Miłość i czułość", lead: "Na łagodność, miłość własną i bliskie relacje.", na: "na miłość i czułość" },
  { id: "radosc", short: "Radość", title: "Radość i optymizm", lead: "Na lekkość, dobry humor i wiarę w siebie.", na: "na radość i optymizm" },
  { id: "sila", short: "Siła", title: "Siła i odwaga", lead: "Na odwagę, motywację i wytrwałość w działaniu.", na: "na siłę i odwagę" },
  { id: "przemiana", short: "Przemiana", title: "Przemiana i nowe początki", lead: "Na zmiany, odnowę i zaczynanie od nowa.", na: "na przemianę i nowe początki" },
  { id: "intuicja", short: "Intuicja", title: "Intuicja i wyrażanie siebie", lead: "Na szczerość, kreatywność i odwagę w mówieniu o sobie.", na: "na intuicję i wyrażanie siebie" },
];

export const getGroup = (id: GroupId) => GROUPS.find((g) => g.id === id)!;

/** Znaki zodiaku w kolejności kalendarzowej. */
export const ZODIAK = [
  { name: "Baran", slug: "baran", dates: "21.03 - 19.04" },
  { name: "Byk", slug: "byk", dates: "20.04 - 20.05" },
  { name: "Bliźnięta", slug: "bliznieta", dates: "21.05 - 20.06" },
  { name: "Rak", slug: "rak", dates: "21.06 - 22.07" },
  { name: "Lew", slug: "lew", dates: "23.07 - 22.08" },
  { name: "Panna", slug: "panna", dates: "23.08 - 22.09" },
  { name: "Waga", slug: "waga", dates: "23.09 - 22.10" },
  { name: "Skorpion", slug: "skorpion", dates: "23.10 - 21.11" },
  { name: "Strzelec", slug: "strzelec", dates: "22.11 - 21.12" },
  { name: "Koziorożec", slug: "koziorozec", dates: "22.12 - 19.01" },
  { name: "Wodnik", slug: "wodnik", dates: "20.01 - 18.02" },
  { name: "Ryby", slug: "ryby", dates: "19.02 - 20.03" },
] as const;

export type Znak = (typeof ZODIAK)[number]["name"];

/** Adresy z kotwicą do listy kamieni: /moc-kamieni#znak-baran, /moc-kamieni#cel-spokoj. */
export const znakHref = (name: Znak) => `/moc-kamieni#znak-${ZODIAK.find((z) => z.name === name)!.slug}`;
export const grupaHref = (id: GroupId) => `/moc-kamieni#cel-${id}`;

export type Stone = {
  slug: string;
  name: string;
  /** Druga nazwa pod nazwą główną (np. „Pink Opal”). */
  alias?: string;
  /** Ścieżka do ilustracji w /public. */
  image: string;
  /** Kolor akcentu kamienia. */
  accent: string;
  group: GroupId;
  /** Słowa z „Symboliki” - krótko, na kartach. */
  keywords: string;
  zodiac: Znak[];
  chakra?: string;
  numerology?: { n: number; text: string };
  element?: string;
  planet?: string;
  /** Opis kamienia - dawny tekst autorki ze strony (przed kartami z dokumentu). */
  description?: string;
  symbolism: string;
  intention?: string;
  fact: string;
  care: string;
};

/**
 * Kamienie z panelu /admin (Supabase → scripts/dane.mjs → lib/dane/kamienie.json).
 * Kolejność: grupy jak w GROUPS, w grupie według kolejności z panelu.
 * Cała lista wyznacza też „poprzedni / następny kamień”.
 */
export const STONES: Stone[] = (KAMIENIE_JSON as (Stone & { kolejnosc: number })[])
  .filter((k) => GROUPS.some((g) => g.id === k.group))
  .sort((a, b) => GROUPS.findIndex((g) => g.id === a.group) - GROUPS.findIndex((g) => g.id === b.group) || a.kolejnosc - b.kolejnosc)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .map(({ kolejnosc: _k, ...k }) => ({ ...k, zodiac: k.zodiac.filter((z): z is Znak => ZODIAK.some((x) => x.name === z)) }));

/** Źródła ciekawostek - z dokumentu autorki. */
export const ZRODLA: { name: string; topic: string; url: string }[] = [
  { name: "GIA (Gemological Institute of America)", topic: "perły, turmaliny, opale i kamienie jubilerskie", url: "https://www.gia.edu/" },
  { name: "USGS", topic: "skały wulkaniczne i pęcherzyki gazowe w lawie", url: "https://www.usgs.gov/" },
  { name: "Geoscience Australia", topic: "granaty i minerały", url: "https://www.ga.gov.au/" },
  { name: "University of Waterloo, Earth Sciences Museum", topic: "granaty", url: "https://uwaterloo.ca/earth-sciences-museum/" },
  { name: "Bodleian Libraries, University of Oxford", topic: "historia pigmentu ultramaryny", url: "https://www.bodleian.ox.ac.uk/" },
  { name: "IUGS Geoheritage", topic: "Sar-e-Sang, historyczne złoże lapis lazuli w Afganistanie", url: "https://iugs-geoheritage.org/" },
  {
    name: "Heaney & Fisher (2003), New interpretation of the origin of tiger's-eye, Geology",
    topic: "tygrysie oko",
    url: "https://doi.org/10.1130/0091-7613(2003)031<0323:NIOTOO>2.0.CO;2",
  },
  { name: "Scientific Reports (2020)", topic: "zmiany barwy ametystu w wyniku obróbki cieplnej", url: "https://www.nature.com/" },
];

export const stonesByGroup = (group: GroupId) => STONES.filter((s) => s.group === group);

export const stonesBySign = (sign: Znak) => STONES.filter((s) => s.zodiac.includes(sign));

export const getStone = (slug: string) => STONES.find((s) => s.slug === slug);

export const stoneHref = (slug: string) => `/moc-kamieni/${slug}`;

/** Opis do metadanych: symbolika + intencja. */
export const stoneSummary = (s: Stone) => [s.symbolism, s.intention].filter(Boolean).join(" ");

/** Pierwsze zdanie tekstu (np. opisu - na krótką zajawkę na karcie). */
export const firstSentence = (text: string) => {
  const m = text.match(/^.*?[.!?](?=\s|$)/);
  return m ? m[0] : text;
};

/** Odmiana „1 kamień / 2 kamienie / 5 kamieni”. */
export const kamienie = (n: number) => {
  const d = n % 10, dd = n % 100;
  if (n === 1) return "1 kamień";
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return `${n} kamienie`;
  return `${n} kamieni`;
};

/**
 * Typografia: twarda spacja po jednoliterowych słowach (i, z, w, o, a, u), żeby nie zostawały
 * na końcu linii, oraz przed krótkim myślnikiem, żeby nie zaczynał nowej linii.
 */
export const nbsp = (text: string) =>
  text.replace(/(^|[\s ])([aiouwzAIOUWZ]) /g, "$1$2 ").replace(/ - /g, " - ");
