import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon, InstagramIcon } from "@/components/icons";
import { AllWorks } from "@/components/pracownia/AllWorks";
import { Foto } from "@/components/site/Foto";
import { JsonLd } from "@/components/site/JsonLd";
import { BeadCorners, BeadRow, SectionDivider, SparkleField } from "@/components/site/Ornaments";
import ui from "@/components/site/ui.module.css";
import { siteConfig } from "@/config/site";
import { KLIMAT, PRACOWNIA, PRACE } from "@/lib/prace";
import { listaPracLd, meta, okruszkiLd } from "@/lib/seo";
import { POKAZ_PRACOWNIE } from "@/lib/site";
import { rich, t } from "@/lib/teksty";
import styles from "./pracownia.module.css";

export const metadata: Metadata = meta({
  title: "Moja pracownia i wszystkie prace | Caramel Jewelry",
  description: POKAZ_PRACOWNIE
    ? "Zobacz, jak powstaje moja biżuteria, i obejrzyj wszystkie prace: naszyjniki, bransoletki i zestawy z koralików - każda ze zdjęciami i opisem."
    : "Obejrzyj wszystkie moje prace: naszyjniki, bransoletki i zestawy z koralików - każda ze zdjęciami i opisem.",
  path: "/pracownia",
});

const KROKI = [
  {
    nr: "01",
    tytul: t("pracownia.krok1.tytul"),
    tekst: t("pracownia.krok1.tekst"),
    zdjecie: PRACOWNIA.uklad,
  },
  {
    nr: "02",
    tytul: t("pracownia.krok2.tytul"),
    tekst: t("pracownia.krok2.tekst"),
    zdjecie: PRACOWNIA.nawlekanie,
  },
  {
    nr: "03",
    tytul: t("pracownia.krok3.tytul"),
    tekst: t("pracownia.krok3.tekst"),
    zdjecie: PRACOWNIA.zapiecia,
  },
  {
    nr: "04",
    tytul: t("pracownia.krok4.tytul"),
    tekst: t("pracownia.krok4.tekst"),
    zdjecie: PRACOWNIA.pakowanie,
  },
];

export default function StudioPage() {
  return (
    <div className={styles.page}>
      {/* ---------- Nagłówek ---------- */}
      <header className={styles.head}>
        <p className={`${ui.eyebrow} reveal`} style={{ "--delay": "0.05s" } as React.CSSProperties}>
          Moja pracownia
        </p>
        <h1 className={`${ui.title} ${styles.title} reveal`} style={{ "--delay": "0.15s" } as React.CSSProperties}>
          {rich("pracownia.tytul", styles.pillWord)}
        </h1>
        <BeadRow className={`${styles.beads} reveal`} />
        <p className={`${ui.text} ${styles.lead} reveal`} style={{ "--delay": "0.3s" } as React.CSSProperties}>
          {POKAZ_PRACOWNIE ? (
            t("pracownia.wstep")
          ) : (
            <>
              Każdy koralik nawlekam ręcznie. Obejrzyj wszystkie moje naszyjniki, bransoletki i&nbsp;zestawy&nbsp;- każdą pracę
              zobaczysz na kilku zdjęciach.
            </>
          )}
        </p>
        <div className={`${styles.headLinks} reveal`} style={{ "--delay": "0.4s" } as React.CSSProperties}>
          <a href="#wszystkie-prace" className={ui.pill}>
            Zobacz wszystkie prace
          </a>
          {POKAZ_PRACOWNIE && (
            <a href="#jak-pracuje" className={`${ui.pill} ${ui.pillOutline}`}>
              Jak pracuję
            </a>
          )}
        </div>
      </header>

      {POKAZ_PRACOWNIE && (
        <>
          {/* ---------- Zdjęcia pracowni ---------- */}
          <section className={styles.mosaic} aria-label="Moja pracownia na zdjęciach" data-reveal>
            <figure className={`${styles.tile} ${styles.tileWide}`}>
              <Foto zdjecie={PRACOWNIA.biurko} ratio="4 / 3" sizes="(max-width: 820px) 100vw, 640px" priority />
              <figcaption className={styles.caption}>{t("pracownia.biurko.podpis")}</figcaption>
            </figure>
            <figure className={styles.tile}>
              <Foto zdjecie={PRACOWNIA.narzedzia} ratio="3 / 4" sizes="(max-width: 820px) 50vw, 320px" />
            </figure>
            <figure className={styles.tile}>
              <Foto zdjecie={PRACOWNIA.wykonczenie} ratio="3 / 4" sizes="(max-width: 820px) 50vw, 320px" />
            </figure>
          </section>

          {/* ---------- Jak pracuję ---------- */}
          <section id="jak-pracuje" className={styles.steps} aria-labelledby="jak-pracuje-title">
            <div className={styles.sectionHead} data-reveal>
              <p className={ui.eyebrow}>Krok po kroku</p>
              <h2 id="jak-pracuje-title" className={ui.title}>
                Jak <em>pracuję</em>
              </h2>
            </div>
            <ol className={styles.stepList}>
              {KROKI.map((k, i) => (
                <li
                  key={k.nr}
                  className={`${ui.card} ${styles.step}`}
                  data-reveal
                  style={{ "--reveal-delay": `${i * 0.08}s` } as React.CSSProperties}
                >
                  <Foto zdjecie={k.zdjecie} ratio="4 / 3" sizes="(max-width: 520px) 92vw, (max-width: 1100px) 46vw, 300px" />
                  <div className={styles.stepBody}>
                    <span className={styles.stepNr} aria-hidden="true">
                      {k.nr}
                    </span>
                    <h3 className={styles.stepTitle}>{k.tytul}</h3>
                    <p className={styles.stepText}>{k.tekst}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <SectionDivider pull />
        </>
      )}

      {/* ---------- Wszystkie prace ---------- */}
      <AllWorks prace={PRACE} />

      <SectionDivider pull />

      {/* ---------- Na co dzień ---------- */}
      <section className={`${ui.card} ${styles.everyday}`} aria-labelledby="na-co-dzien-title" data-reveal>
        <BeadCorners corners={["tl"]} />
        <SparkleField items={[{ left: "92%", top: "16%", size: 13, d: 1.4 }]} />
        <div className={styles.everydayText}>
          <p className={ui.eyebrow}>Na co dzień</p>
          <h2 id="na-co-dzien-title" className={ui.title}>
            {rich("pracownia.na_co_dzien.tytul")}
          </h2>
          <p className={ui.text}>{t("pracownia.na_co_dzien.tekst")}</p>
        </div>
        <ul className={styles.everydayPhotos}>
          {KLIMAT.map((z) => (
            <li key={z.src}>
              <Foto zdjecie={z} ratio="3 / 4" sizes="(max-width: 820px) 44vw, 320px" />
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Kontakt ---------- */}
      <section className={styles.cta} aria-labelledby="cta-title" data-reveal>
        <h2 id="cta-title" className={styles.ctaTitle}>
          {rich("pracownia.cta.tytul")}
        </h2>
        <p className={ui.text}>{t("pracownia.cta.tekst")}</p>
        <div className={styles.headLinks}>
          <Link href="/kontakt" className={ui.pill}>
            Napisz do mnie
            <ArrowUpRightIcon />
          </Link>
          <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className={`${ui.pill} ${ui.pillOutline}`}>
            <InstagramIcon />
            {siteConfig.social.instagramHandle}
            <span className="visually-hidden"> (otwiera się w nowej karcie)</span>
          </a>
        </div>
      </section>

      <JsonLd
        data={[
          okruszkiLd([
            ["Start", "/"],
            ["Moja pracownia", "/pracownia"],
          ]),
          listaPracLd(PRACE, { nazwa: "Wszystkie moje prace", path: "/pracownia" }),
        ]}
      />
    </div>
  );
}
