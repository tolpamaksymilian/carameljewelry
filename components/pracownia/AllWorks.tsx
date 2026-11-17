"use client";

import { useState } from "react";
import { Lightbox } from "@/components/site/Lightbox";
import { Foto } from "@/components/site/Foto";
import ui from "@/components/site/ui.module.css";
import { etykietaTypu, liczbaPrac, liczbaZdjec, maBransoletke, maNaszyjnik, type Praca } from "@/lib/prace-typy";
import styles from "./AllWorks.module.css";

type Filtr = "wszystkie" | "naszyjniki" | "bransoletki" | "zestawy";

const FILTERS: { id: Filtr; label: string }[] = [
  { id: "wszystkie", label: "Wszystkie" },
  { id: "naszyjniki", label: "Naszyjniki" },
  { id: "bransoletki", label: "Bransoletki" },
  { id: "zestawy", label: "Zestawy" },
];

const pasuje = (p: Praca, f: Filtr) =>
  f === "wszystkie" || (f === "naszyjniki" ? maNaszyjnik(p) : f === "bransoletki" ? maBransoletke(p) : p.typ === "zestaw");

/** Wszystkie moje prace pogrupowane po pracy: nazwa i opis, pod nimi zdjęcia. Kliknięcie otwiera galerię. */
export function AllWorks({ prace }: { prace: Praca[] }) {
  const [filter, setFilter] = useState<Filtr>("wszystkie");
  const [gallery, setGallery] = useState<{ praca: Praca; index: number } | null>(null);
  const items = prace.filter((p) => pasuje(p, filter));

  return (
    <section id="wszystkie-prace" className={styles.section} aria-labelledby="wszystkie-prace-title">
      <div className={styles.head} data-reveal>
        <div>
          <p className={ui.eyebrow}>{liczbaPrac(prace.length)}</p>
          <h2 id="wszystkie-prace-title" className={ui.title}>
            Wszystkie <em>moje prace</em>
          </h2>
        </div>
        <ul className={ui.filters} aria-label="Filtruj prace">
          {FILTERS.map((f) => (
            <li key={f.id}>
              <button type="button" className={ui.filter} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ol className={styles.list}>
        {items.map((p) => (
          <li key={p.slug} id={p.slug} className={`${ui.card} ${styles.work}`}>
            <div className={styles.info}>
              <span className={ui.tag}>{etykietaTypu(p)}</span>
              <h3 className={styles.name}>{p.nazwa}</h3>
              <p className={styles.desc}>{p.opis}</p>
              <p className={styles.count}>{liczbaZdjec(p.zdjecia.length)}</p>
            </div>
            <ul className={`${styles.photos} ${p.zdjecia.length === 1 ? styles.single : ""}`}>
              {p.zdjecia.map((z, i) => (
                <li key={z.src}>
                  <button
                    type="button"
                    className={styles.open}
                    onClick={() => setGallery({ praca: p, index: i })}
                    aria-label={`${p.nazwa} - powiększ zdjęcie ${i + 1} z ${p.zdjecia.length}`}
                  >
                    <Foto zdjecie={z} ratio="4 / 5" sizes="(max-width: 600px) 46vw, (max-width: 820px) 24vw, 250px" />
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <Lightbox
        title={gallery?.praca.nazwa ?? ""}
        subtitle={gallery ? etykietaTypu(gallery.praca) : undefined}
        images={gallery?.praca.zdjecia ?? []}
        index={gallery?.index ?? null}
        onChange={(index) => setGallery((g) => (g ? { ...g, index } : g))}
        onClose={() => setGallery(null)}
      />
    </section>
  );
}
