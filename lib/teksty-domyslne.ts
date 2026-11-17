/**
 * Teksty stron, które można zmieniać w panelu (/admin → Teksty).
 * To są wartości domyślne: trafiły do bazy przy pierwszym imporcie, a strona używa ich,
 * gdy w bazie brakuje danego klucza. Zmieniaj teksty w panelu, nie tutaj.
 *
 * Zapis: *tekst w gwiazdkach* = kursywa (akcent), {liczba_kamieni} = aktualna liczba kamieni.
 */
export type TekstDomyslny = { strona: string; etykieta: string; tresc: string };

export const STRONY_TEKSTOW = ["Strona główna", "Moja pracownia", "Kontakt", "Wspólne"] as const;

const GLOWNA = "Strona główna";
const PRACOWNIA = "Moja pracownia";
const KONTAKT = "Kontakt";
const WSPOLNE = "Wspólne";

export const TEKSTY_DOMYSLNE: Record<string, TekstDomyslny> = {
  // ---------- Strona główna: hero ----------
  "glowna.hero.haslo.nadtytul": { strona: GLOWNA, etykieta: "Hero, 1. slajd - mały napis", tresc: "Każdy koralik nawlekam ręcznie" },
  "glowna.hero.haslo.tytul": { strona: GLOWNA, etykieta: "Hero, 1. slajd - tytuł", tresc: "Biżuteria, która opowiada *Twoją historię*" },
  "glowna.hero.poziomka.nadtytul": { strona: GLOWNA, etykieta: "Hero, slajd Poziomka - mały napis", tresc: "Naszyjnik Poziomka" },
  "glowna.hero.poziomka.tytul": { strona: GLOWNA, etykieta: "Hero, slajd Poziomka - tytuł", tresc: "Naszyjnik, który *pachnie latem*" },
  "glowna.hero.bransoletki.nadtytul": { strona: GLOWNA, etykieta: "Hero, slajd bransoletki - mały napis", tresc: "Bransoletki z koralików" },
  "glowna.hero.bransoletki.tytul": { strona: GLOWNA, etykieta: "Hero, slajd bransoletki - tytuł", tresc: "Bransoletki, które *dodadzą Ci blasku*" },
  "glowna.hero.naszyjniki.nadtytul": { strona: GLOWNA, etykieta: "Hero, slajd naszyjniki - mały napis", tresc: "Naszyjniki z koralików" },
  "glowna.hero.naszyjniki.tytul": { strona: GLOWNA, etykieta: "Hero, slajd naszyjniki - tytuł", tresc: "Naszyjnik, który *podkreśli Twoje piękno*" },
  "glowna.hero.komplet.nadtytul": { strona: GLOWNA, etykieta: "Hero, slajd komplet - mały napis", tresc: "Naszyjnik i bransoletka" },
  "glowna.hero.komplet.tytul": { strona: GLOWNA, etykieta: "Hero, slajd komplet - tytuł", tresc: "Komplet, który *dopełni Twój styl*" },
  "glowna.hero.wyrozniona.podpis": { strona: GLOWNA, etykieta: "Hero, karta „Wyróżniona praca” - podpis pod nazwą", tresc: "Naszyjnik z koralików - ręcznie nawlekany" },
  "glowna.hero.zamowienie": { strona: GLOWNA, etykieta: "Hero, karta „na zamówienie”", tresc: "Chcesz coś tylko dla siebie? *Zaprojektujmy to razem.*" },

  // ---------- Strona główna: karty i sekcje ----------
  "glowna.karta_zamowienie.nadtytul": { strona: GLOWNA, etykieta: "Karta „na zamówienie” - mały napis", tresc: "Biżuteria na zamówienie" },
  "glowna.karta_zamowienie.tytul": { strona: GLOWNA, etykieta: "Karta „na zamówienie” - tytuł", tresc: "Zaprojektuj ze mną *swoją biżuterię*" },
  "glowna.karta_kamienie.nadtytul": { strona: GLOWNA, etykieta: "Karta „Moc kamieni” - mały napis", tresc: "Moc kamieni" },
  "glowna.karta_kamienie.tytul": { strona: GLOWNA, etykieta: "Karta „Moc kamieni” - tytuł", tresc: "Znajdź *swój kamień*" },
  "glowna.karta_kamienie.tekst": { strona: GLOWNA, etykieta: "Karta „Moc kamieni” - tekst", tresc: "Sprawdź, jaki kamień przypisany jest Twojemu znakowi zodiaku" },
  "glowna.prace.tytul": { strona: GLOWNA, etykieta: "Sekcja prac - tytuł (1. linia)", tresc: "Ręcznie zrobione" },
  "glowna.prace.tytul_akcent": { strona: GLOWNA, etykieta: "Sekcja prac - tytuł (2. linia, kursywa)", tresc: "dla Ciebie" },
  "glowna.prace.wstep": {
    strona: GLOWNA,
    etykieta: "Sekcja prac - tekst",
    tresc: "Każdy koralik nawlekam z myślą o osobie, która będzie go nosić. Nie znajdziesz tu masowej produkcji - każda praca powstaje w mojej pracowni.",
  },
  "glowna.kamienie.tekst": {
    strona: GLOWNA,
    etykieta: "Sekcja „Odkryj moc kamieni” - tekst w karcie",
    tresc: "Każdy kamień ma swoją symbolikę i znaki zodiaku. Wybierz, czego szukasz, albo znajdź kamień dla swojego znaku.",
  },
  "glowna.instagram.tytul": { strona: GLOWNA, etykieta: "Sekcja Instagram - tytuł", tresc: "Zajrzyj do *mojej pracowni*" },

  // ---------- Moja pracownia ----------
  "pracownia.tytul": { strona: PRACOWNIA, etykieta: "Tytuł strony (słowo w pigułce kursywą)", tresc: "Tu powstaje *Twoja* biżuteria" },
  "pracownia.wstep": {
    strona: PRACOWNIA,
    etykieta: "Tekst pod tytułem",
    tresc: "W mojej pracowni dobieram kolory, nawlekam każdy koralik i pakuję gotowe prace. Zobacz, jak pracuję, i obejrzyj wszystkie moje naszyjniki i bransoletki.",
  },
  "pracownia.biurko.podpis": { strona: PRACOWNIA, etykieta: "Podpis dużego zdjęcia biurka", tresc: "Moje biurko - tu powstaje każda praca" },
  "pracownia.krok1.tytul": { strona: PRACOWNIA, etykieta: "Krok 1 - tytuł", tresc: "Dobieram kolory" },
  "pracownia.krok1.tekst": {
    strona: PRACOWNIA,
    etykieta: "Krok 1 - tekst",
    tresc: "Zaczynam od koralików i kamieni. Układam je obok siebie tak długo, aż kolory zaczną do siebie pasować.",
  },
  "pracownia.krok2.tytul": { strona: PRACOWNIA, etykieta: "Krok 2 - tytuł", tresc: "Nawlekam ręcznie" },
  "pracownia.krok2.tekst": { strona: PRACOWNIA, etykieta: "Krok 2 - tekst", tresc: "Każdy koralik nawlekam ręcznie, jeden po drugim. Nic tu nie powstaje masowo." },
  "pracownia.krok3.tytul": { strona: PRACOWNIA, etykieta: "Krok 3 - tytuł", tresc: "Dopracowuję detale" },
  "pracownia.krok3.tekst": { strona: PRACOWNIA, etykieta: "Krok 3 - tekst", tresc: "Dopinam zapięcia i sprawdzam każdy detal, zanim praca opuści moje biurko." },
  "pracownia.krok4.tytul": { strona: PRACOWNIA, etykieta: "Krok 4 - tytuł", tresc: "Pakuję z troską" },
  "pracownia.krok4.tekst": { strona: PRACOWNIA, etykieta: "Krok 4 - tekst", tresc: "Gotową biżuterię pakuję w papierowe torebki z logo Caramel." },
  "pracownia.na_co_dzien.tytul": { strona: PRACOWNIA, etykieta: "„Na co dzień” - tytuł", tresc: "Biżuteria, która *jest z Tobą*" },
  "pracownia.na_co_dzien.tekst": {
    strona: PRACOWNIA,
    etykieta: "„Na co dzień” - tekst",
    tresc: "Przy porannej kawie i w towarzystwie kota - moje bransoletki najlepiej wyglądają w codziennych chwilach.",
  },
  "pracownia.cta.tytul": { strona: PRACOWNIA, etykieta: "Zachęta na dole - tytuł", tresc: "Podoba Ci się któraś praca? *Napisz do mnie*" },
  "pracownia.cta.tekst": { strona: PRACOWNIA, etykieta: "Zachęta na dole - tekst", tresc: "Zapytaj o dostępność albo o biżuterię zrobioną specjalnie dla Ciebie." },

  // ---------- Kontakt ----------
  "kontakt.wstep": {
    strona: KONTAKT,
    etykieta: "Tekst pod tytułem",
    tresc: "Najłatwiej złapiesz mnie na Instagramie lub Facebooku. Napisz wiadomość, a razem znajdziemy biżuterię, która będzie naprawdę Twoja.",
  },
  "kontakt.instagram.tekst": {
    strona: KONTAKT,
    etykieta: "Karta Instagram - tekst",
    tresc: "Tu pokazuję nowe prace i kulisy mojej pracowni. Napisz do mnie w wiadomości prywatnej.",
  },
  "kontakt.facebook.tekst": { strona: KONTAKT, etykieta: "Karta Facebook - tekst", tresc: "Wolisz Messengera? Napisz do mnie na Facebooku." },
  "kontakt.tematy.tytul": { strona: KONTAKT, etykieta: "„O co zapytać” - tytuł", tresc: "W wiadomości możesz zapytać *na przykład o:*" },
  "kontakt.faq1.pytanie": { strona: KONTAKT, etykieta: "Pytanie 1", tresc: "Jak zamówić biżuterię Caramel?" },
  "kontakt.faq1.odpowiedz": {
    strona: KONTAKT,
    etykieta: "Odpowiedź 1",
    tresc: "Napisz do mnie w wiadomości prywatnej na Instagramie (@cara.mel.jewelry) albo na Facebooku (Caramel Jewelry). Innego kontaktu nie prowadzę.",
  },
  "kontakt.faq2.pytanie": { strona: KONTAKT, etykieta: "Pytanie 2", tresc: "Czy robisz biżuterię na zamówienie?" },
  "kontakt.faq2.odpowiedz": {
    strona: KONTAKT,
    etykieta: "Odpowiedź 2",
    tresc: "Tak. Biżuterię na zamówienie projektuję razem z Tobą - napisz do mnie, a razem znajdziemy biżuterię, która będzie naprawdę Twoja.",
  },
  "kontakt.faq3.pytanie": { strona: KONTAKT, etykieta: "Pytanie 3", tresc: "Jaką biżuterię robisz?" },
  "kontakt.faq3.odpowiedz": {
    strona: KONTAKT,
    etykieta: "Odpowiedź 3",
    tresc: "Naszyjniki, bransoletki i zestawy z koralików i kamieni naturalnych. Każdy koralik nawlekam ręcznie - nie znajdziesz tu masowej produkcji.",
  },
  "kontakt.faq4.pytanie": { strona: KONTAKT, etykieta: "Pytanie 4", tresc: "Jak sprawdzić, czy wybrana praca jest dostępna?" },
  "kontakt.faq4.odpowiedz": {
    strona: KONTAKT,
    etykieta: "Odpowiedź 4",
    tresc: "Napisz do mnie i podaj nazwę pracy, na przykład „Poziomka” albo „Czerń i perła”. Na stronie nie podaję cen ani stanów - o dostępność zapytaj w wiadomości.",
  },
  "kontakt.faq5.pytanie": { strona: KONTAKT, etykieta: "Pytanie 5", tresc: "Nie wiem, który kamień wybrać. Co wtedy?" },
  "kontakt.faq5.odpowiedz": {
    strona: KONTAKT,
    etykieta: "Odpowiedź 5",
    tresc: "Na stronie Moc kamieni opisuję {liczba_kamieni} kamieni: ich symbolikę, znaki zodiaku, ciekawostki i pielęgnację. Kamień możesz wybrać według tego, czego szukasz, albo według swojego znaku. Jeśli nadal nie wiesz, który wybrać - napisz do mnie, pomogę.",
  },
  "kontakt.faq6.pytanie": { strona: KONTAKT, etykieta: "Pytanie 6", tresc: "Gdzie zobaczę wszystkie prace?" },
  "kontakt.faq6.odpowiedz": {
    strona: KONTAKT,
    etykieta: "Odpowiedź 6",
    tresc: "Na stronie Moja pracownia jest galeria wszystkich moich prac ze zdjęciami i opisami. Nowe prace pokazuję też na Instagramie.",
  },

  // ---------- Wspólne ----------
  "wspolne.o_mnie": {
    strona: WSPOLNE,
    etykieta: "Opis marki (stopka, dane dla wyszukiwarek)",
    tresc: "Caramel Jewelry to ręcznie robiona biżuteria z koralików i kamieni naturalnych. Nawlekam naszyjniki, bransoletki i zestawy, a na zamówienie projektuję biżuterię specjalnie dla Ciebie.",
  },
};
