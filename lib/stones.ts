/**
 * Moc kamieni - jedno źródło danych dla strony głównej (/podglad) i podstron /moc-kamieni.
 * Teksty opisów i dopisków są wklejone dokładnie z materiałów od autorki - nie zmieniaj ich tutaj bez potrzeby.
 */

export type Element = "ogien" | "ziemia" | "powietrze" | "woda";

export type Stone = {
  slug: string;
  name: string;
  /** Ścieżka do zdjęcia w /public. */
  image: string;
  keywords: string;
  /** Kolor akcentu kamienia (słowa kluczowe, dopisek o znaku). */
  accent: string;
  description: string;
  /** Dopisek o znaku zodiaku. */
  signNote: string;
  sign: string;
  element: Element;
  /** Mały podpis wersalikami nad nazwą. */
  label: string;
};

export const ELEMENTS: { id: Element; label: string }[] = [
  { id: "ogien", label: "Ogień" },
  { id: "ziemia", label: "Ziemia" },
  { id: "powietrze", label: "Powietrze" },
  { id: "woda", label: "Woda" },
];

export const elementLabel = (id: Element) => ELEMENTS.find((e) => e.id === id)?.label ?? "";

const DEFAULT_LABEL = "KAMIEŃ NATURALNY";

const img = (slug: string) => `/zdjecia/kamienie/kamien-${slug}.webp`;

/**
 * Kolejność ma znaczenie: w obrębie żywiołu tak, jak kamienie pojawiają się na kartach,
 * a cała lista (Ogień → Ziemia → Powietrze → Woda) wyznacza „poprzedni / następny kamień”.
 */
export const STONES: Stone[] = [
  // ---------- Ogień ----------
  {
    slug: "cytryn",
    name: "Cytryn",
    image: img("cytryn"),
    keywords: "energia, sukces, radość",
    accent: "#B06C18",
    description:
      "Cytryn dodaje energii, wzmacnia motywację i wspiera realizację celów. Przyciąga obfitość, pomaga zachować pozytywne nastawienie i dodaje pewności siebie. Wspiera kreatywność i otwiera na nowe możliwości.",
    signNote: "Tradycyjnie przypisywany Lwom (23.07 - 22.08), ale jego energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Lew",
    element: "ogien",
    label: DEFAULT_LABEL,
  },
  {
    slug: "jaspis-cesarski",
    name: "Jaspis cesarski",
    image: img("jaspis-cesarski"),
    keywords: "stabilność, odwaga, równowaga",
    accent: "#965032",
    description:
      "Jaspis cesarski wspiera stabilność i wewnętrzną siłę. Jego unikalne wzory podkreślają indywidualny charakter i pomagają zachować równowagę w codziennym życiu.",
    signNote: "Tradycyjnie przypisywany Baranom (21.03 - 19.04), ale jego energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Baran",
    element: "ogien",
    label: DEFAULT_LABEL,
  },
  {
    slug: "ametyst",
    name: "Ametyst",
    image: img("ametyst"),
    keywords: "spokój, intuicja, ochrona",
    accent: "#784696",
    description:
      "Ametyst wspiera spokój, wycisza emocje i pomaga w lepszym zrozumieniu siebie. Chroni przed negatywną energią i wspiera rozwój duchowy.",
    signNote: "Tradycyjnie przypisywany Strzelcom (22.11 - 21.12), ale jego energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Strzelec",
    element: "ogien",
    label: DEFAULT_LABEL,
  },
  {
    slug: "tygrysie-oko",
    name: "Tygrysie oko",
    image: img("tygrysie-oko"),
    keywords: "pewność, odwaga, równowaga",
    accent: "#965F1E",
    description:
      "Tygrysie oko wzmacnia pewność siebie, pomaga zachować spokój i skupienie. Wspiera podejmowanie decyzji, dodaje odwagi i chroni przed negatywnymi wpływami. Pomaga realizować cele i przyciąga pozytywną energię.",
    signNote: "Tradycyjnie przypisywane Lwom (23.07 - 22.08), ale jego energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Lew",
    element: "ogien",
    label: DEFAULT_LABEL,
  },
  {
    slug: "jaspis-czerwony",
    name: "Jaspis czerwony",
    image: img("jaspis-czerwony"),
    keywords: "odwaga, siła, energia",
    accent: "#AA2D28",
    description:
      "Jaspis czerwony dodaje odwagi, wzmacnia siłę i wytrwałość. Pomaga pokonywać przeszkody i konsekwentnie dążyć do celu.",
    signNote: "Tradycyjnie przypisywany Baranom (21.03 - 19.04), ale jego energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Baran",
    element: "ogien",
    label: DEFAULT_LABEL,
  },

  // ---------- Ziemia ----------
  {
    slug: "malachit",
    name: "Malachit",
    image: img("malachit"),
    keywords: "odwaga, harmonia, zmiana",
    accent: "#1E6E50",
    description:
      "Malachit wspiera transformację, pomaga uwolnić się od blokad i wzmacnia pewność siebie. Chroni przed negatywną energią, dodaje odwagi i wspiera w podejmowaniu ważnych decyzji.",
    signNote: "Tradycyjnie przypisywany Bykom (20.04 - 20.05), ale jego energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Byk",
    element: "ziemia",
    label: DEFAULT_LABEL,
  },
  {
    slug: "jaspis-krajobrazowy",
    name: "Jaspis krajobrazowy",
    image: img("jaspis-krajobrazowy"),
    keywords: "stabilność, odwaga, uziemienie",
    accent: "#966437",
    description:
      "Jaspis krajobrazowy wspiera wytrwałość, pomaga zachować spokój i równowagę. Dodaje siły do działania, ułatwia podejmowanie decyzji i sprzyja realizacji celów. Wzmacnia kontakt z naturą i przynosi poczucie bezpieczeństwa.",
    signNote: "Tradycyjnie przypisywany Pannom (23.08 - 22.09), ale jego energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Panna",
    element: "ziemia",
    label: DEFAULT_LABEL,
  },
  {
    slug: "serpentynit-antygoryt",
    name: "Serpentynit antygoryt",
    image: img("serpentynit-antygoryt"),
    keywords: "spokój, ochrona, równowaga",
    accent: "#557337",
    description:
      "Serpentynit wspiera wyciszenie i wewnętrzną równowagę. Pomaga uwolnić napięcia, zwiększa odporność na stres i sprzyja harmonii w codziennym życiu.",
    signNote: "Tradycyjnie przypisywany Koziorożcom (22.12 - 19.01), ale jego energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Koziorożec",
    element: "ziemia",
    label: DEFAULT_LABEL,
  },
  {
    slug: "lapis-lazuli",
    name: "Lapis lazuli",
    image: img("lapis-lazuli"),
    keywords: "mądrość, intuicja, komunikacja",
    accent: "#283C8C",
    description:
      "Lapis lazuli wspiera jasność myślenia i rozwój intuicji. Pomaga lepiej się komunikować, budować pewność siebie i odnajdywać wewnętrzną harmonię.",
    signNote: "Tradycyjnie przypisywany Pannom (23.08 - 22.09), ale jego energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Panna",
    element: "ziemia",
    label: DEFAULT_LABEL,
  },
  {
    slug: "granat",
    name: "Granat",
    image: img("granat"),
    keywords: "energia, wytrwałość, motywacja",
    accent: "#8C1E32",
    description: "Granat symbolizuje pasję i determinację. Dodaje odwagi, wzmacnia zaangażowanie i motywuje do realizacji celów.",
    signNote: "Tradycyjnie przypisywany Koziorożcom (22.12 - 19.01), ale jego energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Koziorożec",
    element: "ziemia",
    label: DEFAULT_LABEL,
  },

  // ---------- Powietrze ----------
  {
    slug: "apatyt",
    name: "Apatyt",
    image: img("apatyt"),
    keywords: "inspiracja, kreatywność, rozwój",
    accent: "#285AA0",
    description:
      "Apatyt pobudza ciekawość świata, wspiera kreatywność i otwartość na nowe pomysły. Pomaga wyrażać siebie, dodaje motywacji i sprzyja rozwojowi osobistemu.",
    signNote: "Tradycyjnie przypisywany Bliźniętom (21.05 - 20.06), ale jego energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Bliźnięta",
    element: "powietrze",
    label: DEFAULT_LABEL,
  },
  {
    slug: "lawa-wulkaniczna",
    name: "Lawa wulkaniczna",
    image: img("lawa-wulkaniczna"),
    keywords: "stabilność, energia, ochrona",
    accent: "#785C30",
    description:
      "Lawa wulkaniczna uziemia, wzmacnia odporność psychiczną i pomaga w zachowaniu równowagi. Dodaje siły, motywacji i wspiera w trudnych momentach.",
    signNote: "Tradycyjnie przypisywana Wagom (23.09 - 22.10), ale jej energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Waga",
    element: "powietrze",
    label: DEFAULT_LABEL,
  },
  {
    slug: "agat-indyjski",
    name: "Agat indyjski",
    image: img("agat-indyjski"),
    keywords: "harmonia, stabilność, kreatywność",
    accent: "#3C6E46",
    description:
      "Agat indyjski pomaga zachować równowagę emocjonalną i spokój. Dodaje odwagi, wspiera kreatywność i pomaga w podejmowaniu dobrych decyzji.",
    signNote: "Tradycyjnie przypisywany Wodnikom (20.01 - 18.02), ale jego energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Wodnik",
    element: "powietrze",
    label: DEFAULT_LABEL,
  },

  // ---------- Woda ----------
  {
    slug: "jadeit-pink-opal",
    name: "Jadeit pink opal",
    image: img("jadeit-pink-opal"),
    keywords: "miłość, spokój, harmonia",
    accent: "#B95573",
    description:
      "Jadeit pink opal wspiera serdeczność, łagodzi stres i pomaga otworzyć się na pozytywne relacje. Dodaje delikatności, wzmacnia poczucie własnej wartości i przyciąga dobrą energię.",
    signNote: "Tradycyjnie przypisywany Rakom (21.06 - 22.07), ale jego energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Rak",
    element: "woda",
    label: DEFAULT_LABEL,
  },
  {
    slug: "turmalin",
    name: "Turmalin",
    image: img("turmalin"),
    keywords: "ochrona, siła, przemiana",
    accent: "#AF3769",
    description:
      "Turmalin chroni przed negatywną energią, wzmacnia siłę wewnętrzną i pomaga w przechodzeniu przez zmiany. Wspiera odwagę, pewność siebie i równowagę emocjonalną.",
    signNote: "Tradycyjnie przypisywany Skorpionom (23.10 - 21.11), ale jego energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Skorpion",
    element: "woda",
    label: DEFAULT_LABEL,
  },
  {
    slug: "perla-naturalna",
    name: "Perła naturalna",
    image: img("perla-naturalna"),
    keywords: "delikatność, harmonia, spokój",
    accent: "#967855",
    description:
      "Perła wspiera wewnętrzną równowagę, łagodzi stres i wzmacnia intuicję. Pomaga w akceptacji siebie, przynosi spokój i dodaje kobiecej siły.",
    signNote: "Tradycyjnie przypisywana Rakom (21.06 - 22.07), ale jej energia wspiera każdego - bez względu na znak zodiaku.",
    sign: "Rak",
    element: "woda",
    label: "SKARB NATURY",
  },
];

export const stonesByElement = (element: Element) => STONES.filter((s) => s.element === element);

export const getStone = (slug: string) => STONES.find((s) => s.slug === slug);

export const stoneHref = (slug: string) => `/moc-kamieni/${slug}`;

/** Pierwsze zdanie opisu - do metadanych. */
export const firstSentence = (text: string) => {
  const m = text.match(/^.*?[.!?](?=\s|$)/);
  return m ? m[0] : text;
};

/**
 * Typografia: twarda spacja po jednoliterowych słowach (i, z, w, o, a, u), żeby nie zostawały
 * na końcu linii, oraz przed krótkim myślnikiem, żeby nie zaczynał nowej linii.
 */
export const nbsp = (text: string) =>
  text.replace(/(^|[\s ])([aiouwzAIOUWZ]) /g, "$1$2 ").replace(/ - /g, " - ");
