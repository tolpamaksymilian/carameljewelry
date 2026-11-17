"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Admin.module.css";

/** Klient Supabase w panelu (panel renderuje się tylko, gdy konfiguracja istnieje). */
export const sb = (): SupabaseClient => supabase()!;

export const MAX_ROZMIAR = 10 * 1024 * 1024;

/** Adres publiczny pliku w buckecie. */
export function adresPliku(bucket: "prace" | "kamienie", plik: string) {
  return sb().storage.from(bucket).getPublicUrl(plik).data.publicUrl;
}

/** „Poziomka Łąka” → „poziomka-laka”. */
export function zrobAdres(tekst: string) {
  const mapa: Record<string, string> = { ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z" };
  return tekst
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (z) => mapa[z])
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export const ADRES_OK = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Sprawdza, czy plik to prawdziwy obraz WebP (rozszerzenie, typ i nagłówek pliku) do 10 MB. */
export async function sprawdzWebp(plik: File): Promise<string | null> {
  if (!/\.webp$/i.test(plik.name)) return `„${plik.name}” - dozwolone są tylko pliki .webp.`;
  if (plik.type && plik.type !== "image/webp") return `„${plik.name}” - to nie jest obraz WebP.`;
  if (plik.size > MAX_ROZMIAR) return `„${plik.name}” jest za duży (maks. 10 MB).`;
  const naglowek = new Uint8Array(await plik.slice(0, 12).arrayBuffer());
  const tekst = String.fromCharCode(...naglowek);
  if (!tekst.startsWith("RIFF") || tekst.slice(8, 12) !== "WEBP") return `„${plik.name}” nie jest poprawnym plikiem WebP.`;
  return null;
}

export const nowaNazwaPliku = () => `${crypto.randomUUID()}.webp`;

/** Przenosi element listy o jedną pozycję w górę/dół. */
export function przesun<T>(lista: T[], i: number, kierunek: -1 | 1): T[] {
  const j = i + kierunek;
  if (j < 0 || j >= lista.length) return lista;
  const nowa = [...lista];
  [nowa[i], nowa[j]] = [nowa[j], nowa[i]];
  return nowa;
}

/** Zapisuje kolejność (1, 2, 3…) tylko tam, gdzie się zmieniła. */
export async function zapiszKolejnosc(tabela: string, lista: { id: string }[], pole: string, obecne: (id: string) => number) {
  const zmiany = lista.map((r, i) => ({ id: r.id, nr: i + 1 })).filter((r) => obecne(r.id) !== r.nr);
  for (const z of zmiany) {
    const { error } = await sb().from(tabela).update({ [pole]: z.nr }).eq("id", z.id);
    if (error) throw error;
  }
}

/** Kontekst panelu: komunikaty i informacja „są zmiany do zapisania na stronie”. */
type Panel = { info: (tekst: string, blad?: boolean) => void; zmiana: () => void };
export const PanelContext = createContext<Panel>({ info: () => {}, zmiana: () => {} });
export const usePanel = () => useContext(PanelContext);

/** Tłumaczy błędy Supabase na zrozumiałe komunikaty. */
export function opisBledu(e: unknown): string {
  const m = (e as { message?: string })?.message ?? String(e);
  if (/duplicate key.*slug/i.test(m)) return "Ten adres jest już zajęty - wpisz inny.";
  if (/row-level security|permission|not authorized|403/i.test(m)) return "Brak uprawnień - zaloguj się ponownie.";
  if (/mime type|invalid_mime/i.test(m)) return "Dozwolone są tylko pliki .webp.";
  if (/exceeded the maximum|too large|413/i.test(m)) return "Plik jest za duży (maks. 10 MB).";
  if (/fetch|network/i.test(m)) return "Brak połączenia z internetem.";
  return `Nie udało się zapisać (${m}).`;
}

/** Pole formularza z etykietą i podpowiedzią. */
export function Pole({ etykieta, podpowiedz, children, szerokie }: { etykieta: string; podpowiedz?: string; children: React.ReactNode; szerokie?: boolean }) {
  return (
    <label className={`${styles.field} ${szerokie ? styles.fieldWide : ""}`}>
      <span>{etykieta}</span>
      {children}
      {podpowiedz && <small className={styles.hint}>{podpowiedz}</small>}
    </label>
  );
}

export function Strzalki({ onGora, onDol, gora, dol, nazwa }: { onGora: () => void; onDol: () => void; gora: boolean; dol: boolean; nazwa: string }) {
  return (
    <span className={styles.arrows}>
      <button type="button" className={styles.iconBtn} onClick={onGora} disabled={!gora} aria-label={`${nazwa} - wyżej`}>
        ↑
      </button>
      <button type="button" className={styles.iconBtn} onClick={onDol} disabled={!dol} aria-label={`${nazwa} - niżej`}>
        ↓
      </button>
    </span>
  );
}
