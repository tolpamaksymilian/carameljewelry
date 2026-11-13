import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { BeadDivider } from "@/components/BeadDivider";
import { Stage } from "@/components/Stage";
import t from "@/components/Typography.module.css";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Nie znaleziono strony",
};

const delay = (s: number) => ({ "--delay": `${s}s` }) as React.CSSProperties;

export default function NotFound() {
  return (
    <Stage>
      <Link href="/" className={styles.logo} aria-label="Caramel Handmade Jewelry — strona główna">
        <BrandLogo size="sm" delay={0.1} />
      </Link>

      <p className={`${t.display} ${styles.code} reveal`} style={delay(0.45)} aria-hidden="true">
        404
      </p>

      <h1 className={`${t.eyebrow} ${styles.eyebrow} reveal`} style={delay(0.7)}>
        Nie znaleziono strony
      </h1>

      <div className={styles.ornament}>
        <BeadDivider delay={0.85} />
      </div>

      <p className={`${t.lead} ${styles.lead} reveal`} style={delay(1)}>
        Wygląda na to, że ta strona nie istnieje lub została przeniesiona.
      </p>

      <div className="reveal" style={delay(1.25)}>
        <Link href="/" className={t.button}>
          <span className={t.arrow} aria-hidden="true">←</span>
          Wróć na stronę główną
        </Link>
      </div>
    </Stage>
  );
}
