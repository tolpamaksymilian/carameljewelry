import type { Metadata } from "next";
import { BeadRow } from "@/components/site/Ornaments";
import ui from "@/components/site/ui.module.css";
import { HelpCard } from "@/components/stones/HelpCard";
import { StoneList } from "@/components/stones/StoneList";
import { JsonLd } from "@/components/site/JsonLd";
import { kolekcjaKamieniLd, meta, okruszkiLd } from "@/lib/seo";
import { nbsp, STONES, ZRODLA } from "@/lib/stones";
import styles from "./moc-kamieni.module.css";

const OPIS =
  "Każdy kamień, który nawlekam, ma swoje znaczenie. Znajdź kamień na to, czego szukasz, albo dla swojego znaku zodiaku.";

export const metadata: Metadata = meta({
  title: "Moc kamieni - znaczenie i znaki zodiaku | Caramel Jewelry",
  description: OPIS,
  path: "/moc-kamieni",
});

export default function StonesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <p className={`${ui.eyebrow} reveal`} style={{ "--delay": "0.05s" } as React.CSSProperties}>
          Caramel Jewelry
        </p>
        <h1 className={`${ui.title} ${styles.title} reveal`} style={{ "--delay": "0.15s" } as React.CSSProperties}>
          <span className={styles.pillWord}>Moc</span> kamieni
        </h1>
        <BeadRow className={`${styles.beads} reveal`} />
        <p className={`${ui.text} ${styles.lead} reveal`} style={{ "--delay": "0.3s" } as React.CSSProperties}>
          Każdy kamień, który nawlekam, ma swoje znaczenie. Znajdź kamień na to, czego szukasz, albo dla swojego znaku
          zodiaku.
        </p>
      </header>

      <StoneList />

      <aside className={styles.about} aria-labelledby="o-kartach" data-reveal>
        <h2 id="o-kartach" className={styles.aboutTitle}>
          Jak czytać <em>karty kamieni</em>
        </h2>
        <p className={styles.aboutText}>
          {nbsp(
            "Symbolikę, znaki zodiaku, czakry i numerologię traktuję jak tradycję i inspirację - nie jak właściwości lecznicze. Ciekawostki i rady o pielęgnacji opieram na materiałach edukacyjnych z listy poniżej.",
          )}
        </p>
        <details className={styles.sources}>
          <summary className={styles.sourcesSummary}>Źródła ciekawostek</summary>
          <ul className={styles.sourcesList}>
            {ZRODLA.map((z) => (
              <li key={z.url}>
                <a href={z.url} target="_blank" rel="noopener noreferrer">
                  {z.name}
                  <span className="visually-hidden"> (otwiera się w nowej karcie)</span>
                </a>
                <span className={styles.sourceTopic}> - {z.topic}</span>
              </li>
            ))}
          </ul>
        </details>
      </aside>

      <HelpCard
        text={
          <>
            Nie wiesz, który kamień wybrać? <em>Napisz do mnie&nbsp;- pomogę.</em>
          </>
        }
      />

      <JsonLd
        data={[
          okruszkiLd([
            ["Start", "/"],
            ["Moc kamieni", "/moc-kamieni"],
          ]),
          kolekcjaKamieniLd(STONES, OPIS),
        ]}
      />
    </div>
  );
}
