/**
 * Częste pytania - wyłącznie na podstawie informacji, które są już na stronie.
 * Nie ma tu cen, wysyłki, terminów ani zwrotów: tych danych nie ma w projekcie.
 * TODO: gdy będą znane, dopisz pytania o cenę, wysyłkę, czas realizacji, płatność, zwroty i pielęgnację.
 */
import { siteConfig } from "@/config/site";

export type Pytanie = { pytanie: string; odpowiedz: string };

export const FAQ: Pytanie[] = [
  {
    pytanie: "Jak zamówić biżuterię Caramel?",
    odpowiedz: `Napisz do mnie w\u00A0wiadomości prywatnej na Instagramie (${siteConfig.social.instagramHandle}) albo na Facebooku (${siteConfig.social.facebookName}). Innego kontaktu nie prowadzę.`,
  },
  {
    pytanie: "Czy robisz biżuterię na zamówienie?",
    odpowiedz:
      "Tak. Biżuterię na zamówienie projektuję razem z\u00A0Tobą\u00A0- napisz do mnie, a\u00A0razem znajdziemy biżuterię, która będzie naprawdę Twoja.",
  },
  {
    pytanie: "Jaką biżuterię robisz?",
    odpowiedz:
      "Naszyjniki, bransoletki i\u00A0zestawy z\u00A0koralików i\u00A0kamieni naturalnych. Każdy koralik nawlekam ręcznie\u00A0- nie znajdziesz tu masowej produkcji.",
  },
  {
    pytanie: "Jak sprawdzić, czy wybrana praca jest dostępna?",
    odpowiedz:
      "Napisz do mnie i\u00A0podaj nazwę pracy, na przykład „Poziomka” albo „Czerń i\u00A0perła”. Na stronie nie podaję cen ani stanów\u00A0- o\u00A0dostępność zapytaj w\u00A0wiadomości.",
  },
  {
    pytanie: "Nie wiem, który kamień wybrać. Co wtedy?",
    odpowiedz:
      "Na stronie Moc kamieni opisuję znaczenie 16 kamieni i\u00A0znaki zodiaku, którym są tradycyjnie przypisywane. Jeśli nadal nie wiesz, który wybrać\u00A0- napisz do mnie, pomogę.",
  },
  {
    pytanie: "Gdzie zobaczę wszystkie prace?",
    odpowiedz:
      "Na stronie Moja pracownia jest galeria wszystkich moich prac ze zdjęciami i\u00A0opisami. Nowe prace pokazuję też na Instagramie.",
  },
];
