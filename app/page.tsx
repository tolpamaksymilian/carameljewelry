import { BrandLogo } from "@/components/BrandLogo";
import { Ornament } from "@/components/Ornament";
import { Stage } from "@/components/Stage";
import t from "@/components/Typography.module.css";
import styles from "./page.module.css";

const delay = (s: number) => ({ "--delay": `${s}s` }) as React.CSSProperties;

export default function HomePage() {
  return (
    <Stage>
      <div className={styles.logo}>
        <BrandLogo as="h1" size="lg" delay={0.15} />
      </div>

      <div className={styles.ornament}>
        <Ornament delay={0.9} />
      </div>

      <p className={`${t.eyebrow} ${styles.eyebrow} reveal`} style={delay(1.1)}>
        Coś wyjątkowego
      </p>

      <h2 className={`${t.display} ${styles.display} reveal`} style={delay(1.3)}>
        już wkrótce
      </h2>

      <p className={`${t.lead} reveal`} style={delay(1.65)}>
        Tworzymy miejsce, w&nbsp;którym naturalne piękno spotyka się z&nbsp;ponadczasową elegancją.
        Już niedługo zaprosimy Cię do świata Caramel Handmade Jewelry.
      </p>
    </Stage>
  );
}
