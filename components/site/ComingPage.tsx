import Link from "next/link";
import { BeadDivider } from "@/components/BeadDivider";
import { ArrowLeftIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { CopperCorners, SparkleField } from "./Ornaments";
import ui from "./ui.module.css";
import styles from "./ComingPage.module.css";

type ComingPageProps = {
  eyebrow: string;
  title: React.ReactNode;
};

/** Prosta podstrona „Ta strona jest w przygotowaniu” w stylu pełnej strony. */
export function ComingPage({ eyebrow, title }: ComingPageProps) {
  return (
    <section className={`${ui.card} ${styles.card}`}>
      <CopperCorners inset={16} />
      <SparkleField />
      <p className={`${ui.eyebrow} reveal`} style={{ "--delay": "0.1s" } as React.CSSProperties}>
        {eyebrow}
      </p>
      <h1 className={`${ui.title} ${styles.title} reveal`} style={{ "--delay": "0.25s" } as React.CSSProperties}>
        {title}
      </h1>
      <BeadDivider delay={0.4} />
      <p className={`${ui.text} reveal`} style={{ "--delay": "0.6s" } as React.CSSProperties}>
        Ta strona jest w przygotowaniu.
      </p>
      <div className="reveal" style={{ "--delay": "0.75s" } as React.CSSProperties}>
        <Link href={siteConfig.homeHref} className={`${ui.pill} ${ui.pillOutline}`}>
          <ArrowLeftIcon />
          Wróć na start
        </Link>
      </div>
    </section>
  );
}
