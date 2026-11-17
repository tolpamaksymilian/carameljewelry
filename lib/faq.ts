/**
 * Częste pytania (kontakt) - treść pochodzi z panelu /admin (Teksty → Kontakt).
 * Nie ma tu cen, wysyłki, terminów ani zwrotów: tych danych nie ma w projekcie.
 * TODO: gdy będą znane, dopisz pytania o cenę, wysyłkę, czas realizacji, płatność, zwroty i pielęgnację.
 */
import { nbsp } from "@/lib/stones";
import { czysty } from "@/lib/teksty";

export type Pytanie = { pytanie: string; odpowiedz: string };

/** Pytania i odpowiedzi edytowane w panelu (/admin → Teksty → Kontakt); puste pary są pomijane. */
export const FAQ: Pytanie[] = [1, 2, 3, 4, 5, 6]
  .map((n) => ({ pytanie: czysty(`kontakt.faq${n}.pytanie`), odpowiedz: czysty(`kontakt.faq${n}.odpowiedz`) }))
  .filter((q) => q.pytanie.trim() && q.odpowiedz.trim())
  .map((q) => ({ pytanie: nbsp(q.pytanie), odpowiedz: nbsp(q.odpowiedz) }));
