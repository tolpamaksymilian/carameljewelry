import { ArrowUpRightIcon } from "@/components/icons";
import { BeadCorners, SparkleField } from "@/components/site/Ornaments";
import { Foto } from "@/components/site/Foto";
import ui from "@/components/site/ui.module.css";
import { siteConfig } from "@/config/site";
import { PASEK_INSTAGRAM } from "@/lib/prace";
import styles from "./Studio.module.css";

export function Studio() {
  return (
    <section className={`${ui.section} ${ui.card} ${styles.section}`} aria-labelledby="pracownia-title" data-reveal>
      <BeadCorners corners={["tl", "br"]} />
      <SparkleField
        items={[
          { left: "8%", top: "22%", size: 13, d: 0.6 },
          { left: "92%", top: "18%", size: 11, d: 2.8 },
        ]}
      />
      <div className={styles.head}>
        <p className={ui.eyebrow}>{siteConfig.social.instagramHandle}</p>
        <h2 id="pracownia-title" className={ui.title}>
          Zajrzyj do <em>mojej pracowni</em>
        </h2>
      </div>

      <ul className={styles.grid}>
        {PASEK_INSTAGRAM.map((z) => (
          <li key={z.src} className={styles.post}>
            <Foto zdjecie={z} ratio="1 / 1" shape="square" sizes="(max-width: 720px) 45vw, 240px" />
          </li>
        ))}
      </ul>

      <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className={ui.pill}>
        Obserwuj na Instagramie
        <ArrowUpRightIcon />
        <span className="visually-hidden"> (otwiera się w nowej karcie)</span>
      </a>
    </section>
  );
}
