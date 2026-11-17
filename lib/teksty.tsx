import { Fragment, type ReactNode } from "react";
import TEKSTY_JSON from "./dane/teksty.json";
import { STONES, nbsp } from "./stones";
import { TEKSTY_DOMYSLNE } from "./teksty-domyslne";

/**
 * Teksty stron edytowane w panelu /admin (Supabase → scripts/dane.mjs → lib/dane/teksty.json).
 * Gdy w bazie brakuje klucza, używam wartości domyślnej z lib/teksty-domyslne.ts.
 *
 *   t("klucz")    → zwykły tekst (bez kursywy), z twardymi spacjami
 *   rich("klucz") → tekst, w którym *fragment w gwiazdkach* jest kursywą (<em>)
 */
const Z_BAZY = TEKSTY_JSON as Record<string, string>;

const zmienne = (s: string) => s.replace(/\{liczba_kamieni\}/g, String(STONES.length));

/** Surowy tekst (z gwiazdkami), np. do danych strukturalnych. */
export function surowy(klucz: string): string {
  const z = Z_BAZY[klucz];
  return zmienne(z !== undefined && z.trim() !== "" ? z : (TEKSTY_DOMYSLNE[klucz]?.tresc ?? ""));
}

/** Tekst bez znaczników kursywy, z twardymi spacjami po jednoliterowych słowach. */
export function t(klucz: string): string {
  return nbsp(surowy(klucz).replace(/\*/g, ""));
}

/** Tekst bez znaczników i bez twardych spacji - do metadanych i JSON-LD. */
export function czysty(klucz: string): string {
  return surowy(klucz).replace(/\*/g, "");
}

/** Tekst z kursywą: *fragment* → <em className={emClass}>. */
export function rich(klucz: string, emClass?: string): ReactNode {
  const czesci = surowy(klucz).split(/\*([^*]+)\*/g);
  return czesci.map((c, i) =>
    i % 2 === 1 ? (
      <em key={i} className={emClass}>
        {nbsp(c)}
      </em>
    ) : (
      <Fragment key={i}>{nbsp(c)}</Fragment>
    ),
  );
}
