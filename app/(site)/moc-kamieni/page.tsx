import type { Metadata } from "next";
import { BeadRow } from "@/components/site/Ornaments";
import ui from "@/components/site/ui.module.css";
import { HelpCard } from "@/components/stones/HelpCard";
import { StoneList } from "@/components/stones/StoneList";
import { JsonLd } from "@/components/site/JsonLd";
import { kolekcjaKamieniLd, meta, okruszkiLd } from "@/lib/seo";
import { STONES } from "@/lib/stones";
import styles from "./moc-kamieni.module.css";

const OPIS = "Każdy kamień, który nawlekam, ma swoje znaczenie. Zajrzyj, poznaj je bliżej i znajdź ten, który najbardziej do Ciebie pasuje.";

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
          Każdy kamień, który nawlekam, ma swoje znaczenie. Zajrzyj, poznaj je bliżej i&nbsp;znajdź ten, który najbardziej do
          Ciebie pasuje.
        </p>
      </header>

      <StoneList />

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
