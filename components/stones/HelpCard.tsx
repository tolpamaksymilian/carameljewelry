import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import { BeadCorners, SparkleField } from "@/components/site/Ornaments";
import ui from "@/components/site/ui.module.css";
import styles from "./HelpCard.module.css";

/** Karta zachęcająca do kontaktu (lista kamieni i strona kamienia). */
export function HelpCard({ text, cta = "Napisz do mnie" }: { text: React.ReactNode; cta?: string }) {
  return (
    <aside className={`${ui.card} ${styles.card}`} data-reveal>
      <BeadCorners corners={["tl", "br"]} />
      <SparkleField items={[{ left: "92%", top: "24%", size: 13, d: 1.4 }]} />
      <p className={styles.text}>{text}</p>
      <Link href="/kontakt" className={ui.pill}>
        {cta}
        <ArrowUpRightIcon />
      </Link>
    </aside>
  );
}
