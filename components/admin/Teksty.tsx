"use client";

import { useCallback, useEffect, useState } from "react";
import { STRONY_TEKSTOW, TEKSTY_DOMYSLNE } from "@/lib/teksty-domyslne";
import styles from "./Admin.module.css";
import { opisBledu, sb, usePanel } from "./wspolne";

type Tekst = { klucz: string; strona: string; etykieta: string; tresc: string; kolejnosc: number };

export function Teksty() {
  const { info, zmiana } = usePanel();
  const [teksty, setTeksty] = useState<Tekst[] | null>(null);
  const [edycje, setEdycje] = useState<Record<string, string>>({});
  const [strona, setStrona] = useState<string>(STRONY_TEKSTOW[0]);
  const [zapisuje, setZapisuje] = useState(false);

  const wczytaj = useCallback(async () => {
    const { data, error } = await sb().from("teksty").select("*").order("kolejnosc");
    if (error) return info(opisBledu(error), true);
    const zBazy = data as Tekst[];
    // klucze dopisane w kodzie po imporcie - pokazuję je z wartością domyślną
    const brakujace = Object.entries(TEKSTY_DOMYSLNE)
      .filter(([k]) => !zBazy.some((t) => t.klucz === k))
      .map(([klucz, d], i) => ({ klucz, ...d, kolejnosc: 1000 + i }));
    setTeksty([...zBazy, ...brakujace]);
  }, [info]);

  useEffect(() => {
    queueMicrotask(wczytaj);
  }, [wczytaj]);

  if (!teksty) return <p className={styles.muted}>Wczytywanie tekstów…</p>;

  const naStronie = teksty.filter((t) => t.strona === strona);
  const zmienione = Object.keys(edycje).filter((k) => edycje[k] !== teksty.find((t) => t.klucz === k)?.tresc);

  async function zapisz() {
    setZapisuje(true);
    try {
      const wiersze = zmienione.map((k) => {
        const t = teksty!.find((x) => x.klucz === k)!;
        return { klucz: k, strona: t.strona, etykieta: t.etykieta, kolejnosc: t.kolejnosc, tresc: edycje[k].trim() };
      });
      const { error } = await sb().from("teksty").upsert(wiersze, { onConflict: "klucz" });
      if (error) throw error;
      setEdycje({});
      zmiana();
      info(wiersze.length === 1 ? "Zapisano tekst." : `Zapisano teksty: ${wiersze.length}.`);
      await wczytaj();
    } catch (e) {
      info(opisBledu(e), true);
    } finally {
      setZapisuje(false);
    }
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <h2 className={styles.h2}>Teksty stron</h2>
          <p className={styles.muted}>
            Fragment w gwiazdkach, np. <code>*Twoją historię*</code>, będzie kursywą w kolorze akcentu. Puste pole = tekst domyślny.
          </p>
        </div>
      </div>

      <div className={styles.tabsSmall} role="tablist" aria-label="Strona">
        {STRONY_TEKSTOW.map((s) => (
          <button key={s} type="button" role="tab" aria-selected={strona === s} className={styles.tabSmall} onClick={() => setStrona(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className={styles.form}>
        {naStronie.map((t) => {
          const wartosc = edycje[t.klucz] ?? t.tresc;
          const dlugi = (TEKSTY_DOMYSLNE[t.klucz]?.tresc ?? t.tresc).length > 70;
          return (
            <label key={t.klucz} className={`${styles.field} ${styles.fieldWide}`}>
              <span>{t.etykieta}</span>
              <textarea
                rows={dlugi ? 3 : 1}
                value={wartosc}
                className={wartosc !== t.tresc ? styles.changed : undefined}
                onChange={(e) => setEdycje((s) => ({ ...s, [t.klucz]: e.target.value }))}
              />
            </label>
          );
        })}
      </div>

      <div className={styles.stickySave}>
        <span className={styles.muted}>{zmienione.length ? `Niezapisane zmiany: ${zmienione.length}` : "Wszystko zapisane"}</span>
        <button type="button" className={styles.primary} disabled={!zmienione.length || zapisuje} onClick={zapisz}>
          {zapisuje ? "Zapisywanie…" : "Zapisz teksty"}
        </button>
      </div>
    </div>
  );
}
