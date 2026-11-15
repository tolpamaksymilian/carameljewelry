import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import { BeadCorners } from "@/components/site/Ornaments";
import { Foto } from "@/components/site/Foto";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import ui from "@/components/site/ui.module.css";
import { NA_ZAMOWIENIE } from "@/lib/prace";
import styles from "./DuoCards.module.css";

export function DuoCards() {
  return (
    <section className={`${ui.section} ${styles.grid}`} aria-label="Na zamówienie i moc kamieni">
      <article className={`${ui.card} ${ui.lift} ${styles.card}`} data-reveal>
        <BeadCorners corners={["tl"]} />
        <div className={styles.copy}>
          <p className={ui.eyebrow}>Biżuteria na zamówienie</p>
          <h2 className={ui.cardTitle}>
            Zaprojektuj ze mną <em className={ui.accent}>swoją biżuterię</em>
          </h2>
          <Link href="/kontakt" className={`${ui.round} ${ui.roundDark} ${styles.arrow}`} aria-label="Zaprojektuj ze mną swoją biżuterię - napisz do mnie">
            <ArrowUpRightIcon />
          </Link>
        </div>
        <div className={styles.circle}>
          <Foto zdjecie={NA_ZAMOWIENIE} ratio="1 / 1" shape="circle" sizes="230px" />
        </div>
      </article>

      <article
        className={`${ui.card} ${ui.lift} ${styles.card} ${styles.honey}`}
        data-reveal
        style={{ "--reveal-delay": "0.12s" } as React.CSSProperties}
      >
        <BeadCorners corners={["br"]} />
        <div className={styles.copy}>
          <p className={ui.eyebrow}>Moc kamieni</p>
          <h2 className={ui.cardTitle}>
            Znajdź <em className={ui.accent}>swój kamień</em>
          </h2>
          <p className={styles.text}>Sprawdź, jaki kamień przypisany jest Twojemu znakowi zodiaku</p>
          <Link href="/moc-kamieni" className={`${ui.round} ${ui.roundDark} ${styles.arrow}`} aria-label="Znajdź swój kamień - przejdź do Mocy kamieni">
            <ArrowUpRightIcon />
          </Link>
        </div>
        <div className={styles.stack}>
          {[1, 2, 3].map((n) => (
            <div key={n} className={styles.stone}>
              <PhotoSlot
                label={`kamień ${n}`}
                shape="circle"
                src={`/zdjecia/kamien-mini/kamien-${n}.webp`}
                alt="Zbliżenie kamienia w bransoletce z koralików"
                sizes="120px"
                compact
              />
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
