"use client";

import { useState } from "react";
import ui from "@/components/site/ui.module.css";
import { ELEMENTS, STONES, type Element } from "@/lib/stones";
import { StoneCard } from "./StoneCard";
import styles from "./StoneList.module.css";

const FILTERS: { id: Element | "wszystkie"; label: string }[] = [{ id: "wszystkie", label: "Wszystkie" }, ...ELEMENTS];

/** Lista kamieni z filtrami żywiołów (/moc-kamieni). */
export function StoneList() {
  const [filter, setFilter] = useState<Element | "wszystkie">("wszystkie");
  const list = filter === "wszystkie" ? STONES : STONES.filter((s) => s.element === filter);

  return (
    <div className={styles.wrap}>
      <ul className={`${ui.filters} ${styles.filters}`} aria-label="Filtruj kamienie według żywiołu">
        {FILTERS.map((f) => (
          <li key={f.id}>
            <button type="button" className={ui.filter} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          </li>
        ))}
      </ul>

      <p className="visually-hidden" aria-live="polite">
        Liczba kamieni: {list.length}
      </p>

      <ul key={filter} className={styles.grid}>
        {list.map((s, i) => (
          <li key={s.slug} className={styles.item} style={{ "--i": i } as React.CSSProperties}>
            <StoneCard stone={s} />
          </li>
        ))}
      </ul>
    </div>
  );
}
