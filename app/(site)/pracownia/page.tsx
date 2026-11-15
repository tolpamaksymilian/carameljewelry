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
    tytul: "Dobieram kolory",
    tekst: "Zaczynam od koralików i kamieni. Układam je obok siebie tak długo, aż kolory zaczną do siebie pasować.",
    zdjecie: PRACOWNIA.uklad,
  },
  {
    nr: "02",
    tytul: "Nawlekam ręcznie",
    tekst: "Każdy koralik nawlekam ręcznie, jeden po drugim. Nic tu nie powstaje masowo.",
    zdjecie: PRACOWNIA.nawlekanie,
  },
  {
    nr: "03",
    tytul: "Dopracowuję detale",
    tekst: "Dopinam zapięcia i sprawdzam każdy detal, zanim praca opuści moje biurko.",
    zdjecie: PRACOWNIA.zapiecia,
  },
  {
    nr: "04",
    tytul: "Pakuję z troską",
    tekst: "Gotową biżuterię pakuję w papierowe torebki z logo Caramel.",
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
          Tu powstaje <span className={styles.pillWord}>Twoja</span> biżuteria
        </h1>
        <BeadRow className={`${styles.beads} reveal`} />
        <p className={`${ui.text} ${styles.lead} reveal`} style={{ "--delay": "0.3s" } as React.CSSProperties}>
          {POKAZ_PRACOWNIE ? (
            <>
              W&nbsp;mojej pracowni dobieram kolory, nawlekam każdy koralik i&nbsp;pakuję gotowe prace. Zobacz, jak pracuję,
              i&nbsp;obejrzyj wszystkie moje naszyjniki i&nbsp;bransoletki.
            </>
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
              <figcaption className={styles.caption}>Moje biurko - tu powstaje każda praca</figcaption>
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
            Biżuteria, która <em>jest z&nbsp;Tobą</em>
          </h2>
          <p className={ui.text}>
            Przy porannej kawie i&nbsp;w&nbsp;towarzystwie kota&nbsp;- moje bransoletki najlepiej wyglądają w&nbsp;codziennych
            chwilach.
          </p>
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
          Podoba Ci się któraś praca? <em>Napisz do mnie</em>
        </h2>
        <p className={ui.text}>Zapytaj o&nbsp;dostępność albo o&nbsp;biżuterię zrobioną specjalnie dla Ciebie.</p>
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
