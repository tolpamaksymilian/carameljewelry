"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./Admin.module.css";
import { sb, usePanel } from "./wspolne";

const czas = (iso: string) =>
  new Date(iso).toLocaleString("pl-PL", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

/**
 * Pasek „Zapisz stronę”: zmiany w panelu trafiają od razu do bazy, a na stronę - dopiero po tym przycisku
 * (Netlify przebudowuje stronę z aktualnych danych w ok. 2-3 minuty).
 */
export function Publikacja({ zmieniono, onOpublikowano }: { zmieniono: number; onOpublikowano: () => void }) {
  const { info } = usePanel();
  const [ostatnia, setOstatnia] = useState<string | null>(null);
  const [ostatniaZmiana, setOstatniaZmiana] = useState<string | null>(null);
  const [wysylam, setWysylam] = useState(false);

  const wczytaj = useCallback(async () => {
    const [p, a, b, c] = await Promise.all([
      sb().from("publikacje").select("utworzono").eq("status", "wyslano").order("utworzono", { ascending: false }).limit(1),
      sb().from("prace").select("zmieniono").order("zmieniono", { ascending: false }).limit(1),
      sb().from("kamienie").select("zmieniono").order("zmieniono", { ascending: false }).limit(1),
      sb().from("teksty").select("zmieniono").order("zmieniono", { ascending: false }).limit(1),
    ]);
    setOstatnia(p.data?.[0]?.utworzono ?? null);
    const daty = [a, b, c].map((r) => r.data?.[0]?.zmieniono).filter(Boolean) as string[];
    setOstatniaZmiana(daty.sort().at(-1) ?? null);
  }, []);

  useEffect(() => {
    queueMicrotask(wczytaj);
  }, [wczytaj, zmieniono]);

  const saZmiany = zmieniono > 0 || (ostatniaZmiana !== null && (ostatnia === null || ostatniaZmiana > ostatnia));

  async function opublikuj() {
    setWysylam(true);
    try {
      const token = (await sb().auth.getSession()).data.session?.access_token;
      if (!token) {
        info("Sesja wygasła - zaloguj się ponownie.", true);
        return;
      }
      const r = await fetch("/api/publikuj", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      if (r.status === 404) {
        info("Zapisywanie strony działa na carameljewelry.pl (na komputerze w trybie podglądu go nie ma).", true);
        return;
      }
      const dane = (await r.json().catch(() => ({}))) as { blad?: string };
      if (!r.ok) {
        info(dane.blad ?? "Nie udało się zapisać strony.", true);
        return;
      }
      info("Gotowe! Strona się przebudowuje - zmiany będą widoczne za ok. 2-3 minuty.");
      onOpublikowano();
      await wczytaj();
    } catch {
      info("Brak połączenia z internetem.", true);
    } finally {
      setWysylam(false);
    }
  }

  return (
    <div className={`${styles.publish} ${saZmiany ? styles.publishOn : ""}`}>
      <div className={styles.publishText}>
        <strong>{saZmiany ? "Masz zmiany, których nie ma jeszcze na stronie" : "Strona jest aktualna"}</strong>
        <span>{ostatnia ? `Ostatni zapis strony: ${czas(ostatnia)}` : "Strona nie była jeszcze zapisywana z panelu."}</span>
      </div>
      <button type="button" className={styles.publishBtn} onClick={opublikuj} disabled={wysylam}>
        {wysylam ? "Zapisywanie…" : "Zapisz stronę"}
      </button>
    </div>
  );
}
