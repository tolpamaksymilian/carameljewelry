/**
 * Moc kamieni - jedno źródło danych dla strony głównej (/podglad) i podstron /moc-kamieni.
 * Opisy (description) to dawne teksty autorki ze strony. Treści kart (znaki, czakry, numerologia, żywioł, planeta, symbolika, intencja, ciekawostka,
 * pielęgnacja) są przepisane z dokumentu autorki „kamienie.docx” - nie zmieniaj ich tutaj bez potrzeby.
 * Pola, których w dokumencie nie ma (albo są oznaczone „-” / „Do ustalenia”), zostają puste
 * i nie pojawiają się na stronie.
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

const img = (slug: string) => `/zdjecia/kamienie/kamien-${slug}.webp`;

/**
 * Kolejność ma znaczenie: grupy jak w GROUPS, a w grupie tak, jak kamienie pojawiają się na kartach.
 * Cała lista wyznacza też „poprzedni / następny kamień”.
 */
export const STONES: Stone[] = [
  // ---------- Spokój i równowaga ----------
  {
    slug: "ametyst",
    name: "Ametyst",
    image: img("ametyst"),
    accent: "#784696",
    group: "spokoj",
    keywords: "spokój, intuicja, mądrość i refleksja",
    zodiac: ["Ryby", "Wodnik", "Strzelec"],
    chakra: "Trzeciego oka, korony",
    numerology: { n: 7, text: "refleksja, intuicja, duchowość" },
    element: "Powietrze i woda",
    planet: "Jowisz lub Neptun",
    description:
      "Ametyst wspiera spokój, wycisza emocje i pomaga w lepszym zrozumieniu siebie. Chroni przed negatywną energią i wspiera rozwój duchowy.",
    symbolism: "Spokój, intuicja, mądrość i refleksja.",
    intention: "Wyciszenie, koncentracja, rozwój wewnętrzny.",
    fact: "Podgrzewanie ametystu może zmienić jego barwę; w odpowiednich warunkach uzyskuje się odcienie żółte lub pomarańczowe. Część cytrynów dostępnych w handlu to ametysty poddane obróbce cieplnej.",
    care: "Unikać długiej ekspozycji na intensywne słońce i wysoką temperaturę; czyścić delikatnie.",
  },
  {
    slug: "agat-indyjski",
    name: "Agat indyjski",
    image: img("agat-indyjski"),
    accent: "#3C6E46",
    group: "spokoj",
    keywords: "stabilizacja, cierpliwość i harmonia",
    zodiac: ["Byk", "Bliźnięta", "Skorpion"],
    chakra: "Serca, podstawy",
    numerology: { n: 4, text: "stabilność, porządek, bezpieczeństwo" },
    element: "Ziemia",
    planet: "Merkury",
    description:
      "Agat indyjski pomaga zachować równowagę emocjonalną i spokój. Dodaje odwagi, wspiera kreatywność i pomaga w podejmowaniu dobrych decyzji.",
    symbolism: "Stabilizacja, cierpliwość i harmonia.",
    intention: "Spokój, równowaga i ugruntowanie.",
    fact: "Pasmowe wzory agatu powstają w wyniku kolejnego osadzania się krzemionki w pustkach skał. Warstwy mogą różnić się barwą i zawartością domieszek.",
    care: "Czyścić miękką ściereczką lub delikatnie; unikać uderzeń i silnych środków chemicznych.",
  },
  {
    slug: "jaspis-krajobrazowy",
    name: "Jaspis krajobrazowy",
    image: img("jaspis-krajobrazowy"),
    accent: "#966437",
    group: "spokoj",
    keywords: "kontakt z naturą, cierpliwość, stabilność",
    zodiac: ["Byk", "Panna", "Koziorożec"],
    chakra: "Podstawy",
    numerology: { n: 4, text: "ugruntowanie, porządek" },
    element: "Ziemia",
    planet: "Saturn",
    description:
      "Jaspis krajobrazowy wspiera wytrwałość, pomaga zachować spokój i równowagę. Dodaje siły do działania, ułatwia podejmowanie decyzji i sprzyja realizacji celów. Wzmacnia kontakt z naturą i przynosi poczucie bezpieczeństwa.",
    symbolism: "Kontakt z naturą, cierpliwość, stabilność.",
    intention: "Spokój, cierpliwość, zakorzenienie i harmonia z naturą.",
    fact: "Naturalne pasma, plamy i domieszki mineralne mogą po przecięciu i wypolerowaniu przypominać góry, pustynie lub horyzonty. „Krajobraz” nie jest nadrukiem.",
    care: "Czyścić miękką ściereczką; unikać uderzeń i silnej chemii.",
  },
  {
    slug: "jaspis-cesarski",
    name: "Jaspis cesarski",
    image: img("jaspis-cesarski"),
    accent: "#965032",
    group: "spokoj",
    keywords: "równowaga, spokój i stabilność",
    zodiac: ["Baran"],
    // TODO: czakra, numerologia, żywioł, planeta i intencja - w dokumencie „-” / „Do ustalenia”
    description:
      "Jaspis cesarski wspiera stabilność i wewnętrzną siłę. Jego unikalne wzory podkreślają indywidualny charakter i pomagają zachować równowagę w codziennym życiu.",
    symbolism: "Równowaga, spokój i stabilność.",
    fact: "W handlu kamieniami określenia „cesarski”, „królewski” lub „imperial” mogą opisywać wygląd albo klasę handlową, a nie formalną nazwę minerału.",
    care: "Do czasu identyfikacji czyścić delikatnie miękką ściereczką; unikać moczenia i chemii.",
  },

  // ---------- Miłość i czułość ----------
  {
    slug: "turmalin-rozowy",
    name: "Turmalin różowy",
    image: img("turmalin"),
    accent: "#AF3769",
    group: "milosc",
    keywords: "miłość, empatia, czułość i życzliwość",
    zodiac: ["Waga", "Byk", "Skorpion"],
    chakra: "Serca",
    numerology: { n: 6, text: "troska, miłość, odpowiedzialność" },
    element: "Woda",
    planet: "Wenus",
    description:
      "Turmalin chroni przed negatywną energią, wzmacnia siłę wewnętrzną i pomaga w przechodzeniu przez zmiany. Wspiera odwagę, pewność siebie i równowagę emocjonalną.",
    symbolism: "Miłość, empatia, czułość i życzliwość.",
    intention: "Akceptacja siebie, otwartość na uczucia, pielęgnowanie relacji.",
    fact: "Turmalin wykazuje piroelektryczność - zmiana temperatury może prowadzić do powstania ładunków elektrycznych - oraz piezoelektryczność, czyli powstawanie ładunku pod wpływem nacisku.",
    care: "Czyścić delikatnie; unikać silnych uderzeń i gwałtownych zmian temperatury.",
  },
  {
    slug: "opal-rozowy",
    name: "Opal różowy",
    alias: "Pink Opal",
    image: img("jadeit-pink-opal"),
    accent: "#B95573",
    group: "milosc",
    keywords: "czułość, łagodność, miłość własna",
    zodiac: ["Rak", "Waga", "Ryby"],
    chakra: "Serca",
    numerology: { n: 6, text: "troska, miłość, harmonia" },
    element: "Woda",
    planet: "Wenus",
    description:
      "Opal różowy wspiera serdeczność, łagodzi stres i pomaga otworzyć się na pozytywne relacje. Dodaje delikatności, wzmacnia poczucie własnej wartości i przyciąga dobrą energię.",
    symbolism: "Czułość, łagodność, miłość własna i emocjonalne ukojenie.",
    intention: "Akceptacja siebie, otwartość na uczucia, łagodność.",
    fact: "Opal nie ma uporządkowanej struktury krystalicznej typowej dla większości minerałów. Zawartość wody jest zmienna; opal pospolity nie musi wykazywać gry barw znanej z opalu szlachetnego.",
    care: "Chronić przed uderzeniami, wysoką temperaturą, przesuszeniem i gwałtownymi zmianami temperatury; czyścić miękką ściereczką.",
  },
  {
    slug: "perla",
    name: "Perła",
    image: img("perla-naturalna"),
    accent: "#967855",
    group: "milosc",
    keywords: "czystość, łagodność, mądrość i elegancja",
    zodiac: ["Rak", "Ryby"],
    chakra: "Serca, korony (symbolicznie)",
    numerology: { n: 2, text: "współpraca, łagodność, harmonia" },
    element: "Woda",
    planet: "Księżyc",
    description:
      "Perła wspiera wewnętrzną równowagę, łagodzi stres i wzmacnia intuicję. Pomaga w akceptacji siebie, przynosi spokój i dodaje kobiecej siły.",
    symbolism: "Czystość, łagodność, mądrość i elegancja.",
    intention: "Delikatność, miłość własna, harmonia emocjonalna.",
    fact: "Połysk perłowy powstaje dzięki oddziaływaniu światła z mikroskopijnymi warstwami masy perłowej. Perła nie jest minerałem, powstaje w organizmie mięczaka.",
    care: "Chronić przed perfumami, kosmetykami, potem, detergentami i wysoką temperaturą. Po noszeniu przetrzeć miękką ściereczką.",
  },

  // ---------- Radość i optymizm ----------
  {
    slug: "cytryn",
    name: "Cytryn",
    image: img("cytryn"),
    accent: "#B06C18",
    group: "radosc",
    keywords: "radość, obfitość, optymizm i sukces",
    zodiac: ["Bliźnięta", "Lew", "Panna"],
    chakra: "Splotu słonecznego",
    numerology: { n: 3, text: "kreatywność, optymizm, ekspresja" },
    element: "Ogień",
    planet: "Słońce lub Jowisz",
    description:
      "Cytryn dodaje energii, wzmacnia motywację i wspiera realizację celów. Przyciąga obfitość, pomaga zachować pozytywne nastawienie i dodaje pewności siebie. Wspiera kreatywność i otwiera na nowe możliwości.",
    symbolism: "Radość, obfitość, optymizm i sukces.",
    intention: "Pewność siebie, motywacja, powodzenie i dobrobyt - w znaczeniu symbolicznym.",
    fact: "Wiele intensywnie pomarańczowych „cytrynów” w sprzedaży powstaje przez ogrzewanie ametystu. Naturalny cytryn często ma delikatniejszy, bladożółty odcień, ale sam kolor nie wystarcza do rozpoznania.",
    care: "Unikać wysokiej temperatury i długiej ekspozycji na intensywne słońce; czyścić delikatnie.",
  },
  {
    slug: "jaspis-dalmatynski",
    name: "Jaspis dalmatyński",
    image: img("jaspis-dalmatynski"),
    accent: "#5A524B",
    group: "radosc",
    keywords: "radość, równowaga, spontaniczność i lekkość",
    zodiac: ["Baran", "Bliźnięta", "Panna"],
    chakra: "Podstawy",
    numerology: { n: 5, text: "zmiana, swoboda, elastyczność" },
    element: "Ziemia",
    planet: "Merkury",
    description:
      "Jaspis dalmatyński symbolizuje radość, równowagę, spontaniczność i lekkość. Sprzyja optymizmowi, pomaga nabrać dystansu do codziennych trudności i daje poczucie ugruntowania.",
    symbolism: "Radość, równowaga, spontaniczność i lekkość.",
    intention: "Optymizm, dystans do codziennych trudności, ugruntowanie.",
    fact: "Nazwa nawiązuje do umaszczenia dalmatyńczyka, a nie do potwierdzonego miejsca wydobycia. Ciemne plamki są składnikami/inkluzjami odmiennymi od jasnego tła; ich dokładny skład może się różnić.",
    care: "Czyścić miękką ściereczką; unikać uderzeń i agresywnej chemii.",
  },

  // ---------- Siła i odwaga ----------
  {
    slug: "granat",
    name: "Granat",
    image: img("granat"),
    accent: "#8C1E32",
    group: "sila",
    keywords: "pasja, siła, energia i determinacja",
    zodiac: ["Baran", "Lew", "Skorpion", "Koziorożec"],
    chakra: "Podstawy, sakralna",
    numerology: { n: 1, text: "inicjatywa, siła, nowe początki" },
    element: "Ogień",
    planet: "Mars",
    description:
      "Granat symbolizuje pasję i determinację. Dodaje odwagi, wzmacnia zaangażowanie i motywuje do realizacji celów.",
    symbolism: "Pasja, siła, energia i determinacja.",
    intention: "Odwaga, zaangażowanie, motywacja i wytrwałość.",
    fact: "Granaty występują w wielu kolorach - nie tylko czerwonym, lecz także zielonym, pomarańczowym, żółtym, a nawet rzadko niebieskim. Geolodzy badają ich skład, by odtwarzać warunki temperatury i ciśnienia podczas przeobrażania skał.",
    care: "Chronić przed silnymi uderzeniami; czyścić delikatnie.",
  },
  {
    slug: "jaspis-czerwony",
    name: "Jaspis czerwony",
    image: img("jaspis-czerwony"),
    accent: "#AA2D28",
    group: "sila",
    keywords: "siła, stabilność i wytrwałość",
    zodiac: ["Baran", "Lew", "Panna"],
    chakra: "Podstawy",
    numerology: { n: 9, text: "wytrwałość, domykanie cykli" },
    element: "Ziemia i ogień",
    planet: "Mars",
    description:
      "Jaspis czerwony dodaje odwagi, wzmacnia siłę i wytrwałość. Pomaga pokonywać przeszkody i konsekwentnie dążyć do celu.",
    symbolism: "Siła, stabilność i wytrwałość.",
    intention: "Ugruntowanie, motywacja, konsekwencja i pewność siebie.",
    fact: "Czerwone zabarwienie jaspisu jest zwykle związane z obecnością tlenków żelaza. Nawet niewielka ilość barwnych domieszek może wyraźnie zmienić kolor skały.",
    care: "Czyścić miękką ściereczką; unikać uderzeń i agresywnej chemii.",
  },
  {
    slug: "tygrysie-oko",
    name: "Tygrysie oko",
    image: img("tygrysie-oko"),
    accent: "#965F1E",
    group: "sila",
    keywords: "odwaga, ochrona, determinacja i zdecydowanie",
    zodiac: ["Lew", "Bliźnięta", "Koziorożec"],
    chakra: "Splotu słonecznego, podstawy",
    numerology: { n: 4, text: "stabilność, konsekwencja" },
    element: "Ogień i ziemia",
    planet: "Słońce (symbolicznie)",
    description:
      "Tygrysie oko wzmacnia pewność siebie, pomaga zachować spokój i skupienie. Wspiera podejmowanie decyzji, dodaje odwagi i chroni przed negatywnymi wpływami. Pomaga realizować cele i przyciąga pozytywną energię.",
    symbolism: "Odwaga, ochrona, determinacja i zdecydowanie.",
    intention: "Pewność siebie, koncentracja i konsekwentne działanie.",
    fact: "Charakterystyczny ruchomy pas światła nazywa się chatoyancją lub efektem kociego oka. Przesuwa się wraz ze zmianą kąta padania światła albo obróceniem kamienia.",
    care: "Czyścić miękką ściereczką; unikać uderzeń i agresywnej chemii.",
  },

  // ---------- Przemiana i nowe początki ----------
  {
    slug: "malachit",
    name: "Malachit",
    image: img("malachit"),
    accent: "#1E6E50",
    group: "przemiana",
    keywords: "przemiana, odwaga, rozwój i odnowa",
    zodiac: ["Byk", "Skorpion", "Koziorożec"],
    chakra: "Serca",
    numerology: { n: 9, text: "przemiana, dopełnienie" },
    element: "Ziemia",
    planet: "Wenus",
    description:
      "Malachit wspiera transformację, pomaga uwolnić się od blokad i wzmacnia pewność siebie. Chroni przed negatywną energią, dodaje odwagi i wspiera w podejmowaniu ważnych decyzji.",
    symbolism: "Przemiana, odwaga, rozwój i odnowa.",
    intention: "Rozwój osobisty, zmiana, symboliczne uwalnianie przeszłości.",
    fact: "Malachit powstaje w strefach utleniania złóż miedzi. Jego zielone pasma tworzą charakterystyczne koncentryczne i faliste wzory; minerał jest także rudą miedzi.",
    care: "Nie moczyć długo; unikać kwasów, detergentów, soli i czyszczenia ultradźwiękami. Czyścić miękką ściereczką.",
  },
  {
    slug: "serpentynit-antygoryt",
    name: "Serpentynit - antygoryt",
    image: img("serpentynit-antygoryt"),
    accent: "#557337",
    group: "przemiana",
    keywords: "odnowa, równowaga i transformacja",
    zodiac: ["Byk", "Skorpion", "Panna"],
    chakra: "Serca, podstawy",
    numerology: { n: 5, text: "zmiana i rozwój" },
    element: "Ziemia",
    planet: "Merkury",
    description:
      "Serpentynit wspiera wyciszenie i wewnętrzną równowagę. Pomaga uwolnić napięcia, zwiększa odporność na stres i sprzyja harmonii w codziennym życiu.",
    symbolism: "Odnowa, równowaga i transformacja.",
    intention: "Ugruntowanie, równowaga i nowe początki.",
    fact: "Serpentynizacja zachodzi, gdy skały bogate w magnez reagują z wodą w głębi skorupy ziemskiej. W określonych warunkach procesowi temu może towarzyszyć powstawanie wodoru.",
    care: "Chronić przed zarysowaniem, uderzeniami, kwasami i agresywną chemią; czyścić miękką ściereczką.",
  },
  {
    slug: "lawa-wulkaniczna",
    name: "Lawa wulkaniczna",
    image: img("lawa-wulkaniczna"),
    accent: "#785C30",
    group: "przemiana",
    keywords: "siła, odrodzenie, transformacja",
    zodiac: ["Baran", "Skorpion", "Koziorożec"],
    chakra: "Podstawy",
    numerology: { n: 8, text: "wytrwałość, sprawczość" },
    element: "Ogień i ziemia",
    planet: "Mars",
    description:
      "Lawa wulkaniczna uziemia, wzmacnia odporność psychiczną i pomaga w zachowaniu równowagi. Dodaje siły, motywacji i wspiera w trudnych momentach.",
    symbolism: "Siła, odrodzenie, transformacja.",
    intention: "Odwaga, odporność, nowe początki.",
    fact: "Małe otworki w porowatej lawie to pęcherzyki (wakuole). Powstają, gdy gazy wydzielają się z lawy podczas jej stygnięcia i krzepnięcia.",
    care: "Porowata powierzchnia może chłonąć kosmetyki i zabrudzenia. Czyścić delikatnie, nie moczyć długo.",
  },

  // ---------- Intuicja i wyrażanie siebie ----------
  {
    slug: "lapis-lazuli",
    name: "Lapis lazuli",
    image: img("lapis-lazuli"),
    accent: "#283C8C",
    group: "intuicja",
    keywords: "mądrość, prawda, szczerość i świadomość",
    zodiac: ["Strzelec", "Wodnik", "Panna"],
    chakra: "Gardła, trzeciego oka",
    numerology: { n: 3, text: "komunikacja, wiedza, ekspresja" },
    element: "Powietrze",
    planet: "Jowisz",
    description:
      "Lapis lazuli wspiera jasność myślenia i rozwój intuicji. Pomaga lepiej się komunikować, budować pewność siebie i odnajdywać wewnętrzną harmonię.",
    symbolism: "Mądrość, prawda, szczerość i świadomość.",
    intention: "Szczerość, wyrażanie siebie, refleksja i intuicja.",
    fact: "Lazuryt był źródłem ultramaryny - bardzo cenionego niebieskiego pigmentu używanego w malarstwie. Lapis lazuli z historycznych złóż Sar-e-Sang w Afganistanie był ceniony już w starożytności.",
    care: "Unikać kwasów, kosmetyków, długiego moczenia i silnych detergentów; czyścić miękką ściereczką.",
  },
  {
    slug: "apatyt",
    name: "Apatyt",
    image: img("apatyt"),
    accent: "#285AA0",
    group: "intuicja",
    keywords: "inspiracja, komunikacja i motywacja",
    zodiac: ["Bliźnięta", "Waga", "Strzelec"],
    chakra: "Gardła, trzeciego oka",
    numerology: { n: 3, text: "ekspresja, komunikacja, kreatywność" },
    element: "Powietrze",
    planet: "Merkury (symbolicznie)",
    description:
      "Apatyt pobudza ciekawość świata, wspiera kreatywność i otwartość na nowe pomysły. Pomaga wyrażać siebie, dodaje motywacji i sprzyja rozwojowi osobistemu.",
    symbolism: "Inspiracja, komunikacja i motywacja.",
    intention: "Kreatywność, rozwój, odwaga w wyrażaniu siebie.",
    fact: "Nazwa apatytu pochodzi od greckiego „apate”, czyli zwodzenie lub oszustwo - minerał bywał mylony z innymi kamieniami ze względu na podobieństwo wyglądu. Apatyty są też ważnym składnikiem wielu skał.",
    care: "Łatwiej go zarysować niż kwarc. Przechowywać oddzielnie od twardszych kamieni i chronić przed uderzeniami.",
  },
];

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
