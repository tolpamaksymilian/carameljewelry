import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { BeadCorners, SparkleField } from "@/components/site/Ornaments";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import ui from "@/components/site/ui.module.css";
import { GoldRule } from "@/components/stones/GoldRule";
import { HelpCard } from "@/components/stones/HelpCard";
import { StoneCard } from "@/components/stones/StoneCard";
import { firstSentence, getStone, nbsp, STONES, stoneHref } from "@/lib/stones";
import { JsonLd } from "@/components/site/JsonLd";
import { artykulKamieniaLd, meta, okruszkiLd } from "@/lib/seo";
import styles from "./stone.module.css";

type Props = { params: Promise<{ slug: string }> };

/** Eksport statyczny: osobna strona dla każdego kamienia. */
export function generateStaticParams() {
  return STONES.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const stone = getStone(slug);
  if (!stone) return {};
  return meta({
    title: `${stone.name} - znaczenie kamienia | Caramel Jewelry`,
    description: firstSentence(stone.description),
    path: stoneHref(stone.slug),
    type: "article",
  });
}

export default async function StonePage({ params }: Props) {
  const { slug } = await params;
  const stone = getStone(slug);
  if (!stone) notFound();

  const index = STONES.findIndex((s) => s.slug === stone.slug);
  const prev = STONES[(index - 1 + STONES.length) % STONES.length];
  const next = STONES[(index + 1) % STONES.length];
  const related = STONES.filter((s) => s.element === stone.element && s.slug !== stone.slug).slice(0, 4);

  return (
    <div className={styles.page} style={{ "--accent": stone.accent } as React.CSSProperties}>
      <Link href="/moc-kamieni" className={styles.back}>
        <ArrowLeftIcon />
        Moc kamieni
      </Link>

      <article className={styles.hero}>
        <div className={`${styles.photo} reveal`} style={{ "--delay": "0.05s" } as React.CSSProperties}>
          <BeadCorners corners={["tl"]} />
          <PhotoSlot
            label={stone.name}
            src={stone.image}
            alt={`${stone.name} - ilustracja kamienia`}
            ratio="1/1"
            sizes="(max-width: 860px) 92vw, 46vw"
            priority
          />
        </div>

        <div className={styles.copy}>
          <SparkleField items={[{ left: "92%", top: "6%", size: 14, d: 0.8 }]} />
          <p className={`${styles.label} reveal`} style={{ "--delay": "0.15s" } as React.CSSProperties}>
            {stone.label}
          </p>
          <h1 className={`${styles.name} reveal`} style={{ "--delay": "0.25s" } as React.CSSProperties}>
            {stone.name}
          </h1>
          <p className={`${styles.keywords} reveal`} style={{ "--delay": "0.35s" } as React.CSSProperties}>
            {nbsp(stone.keywords)}
          </p>
          <GoldRule className={`${styles.rule} reveal`} />
          <p className={`${styles.description} reveal`} style={{ "--delay": "0.5s" } as React.CSSProperties}>
            {nbsp(stone.description)}
          </p>
          <p className={`${styles.signNote} reveal`} style={{ "--delay": "0.6s" } as React.CSSProperties}>
            {nbsp(stone.signNote)}
          </p>
        </div>
      </article>

      <HelpCard
        text={
          <>
            Chcesz biżuterię z&nbsp;tym kamieniem? <em>Napisz do mnie&nbsp;- nawlekę ją specjalnie dla Ciebie.</em>
          </>
        }
      />

      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="inne-kamienie" data-reveal>
          <h2 id="inne-kamienie" className={`${ui.title} ${styles.relatedTitle}`}>
            Inne kamienie <em>tego żywiołu</em>
          </h2>
          <ul className={styles.relatedGrid}>
            {related.map((s) => (
              <li key={s.slug}>
                <StoneCard stone={s} sizes="(max-width: 760px) 50vw, 25vw" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className={styles.pager} aria-label="Pozostałe kamienie">
        <Link href={stoneHref(prev.slug)} className={styles.pagerLink}>
          <span className={`${ui.round} ${styles.pagerIcon}`} aria-hidden="true">
            <ArrowLeftIcon />
          </span>
          <span className={styles.pagerText}>
            <span className={styles.pagerHint}>Poprzedni kamień</span>
            <span className={styles.pagerName}>{prev.name}</span>
          </span>
        </Link>
        <Link href={stoneHref(next.slug)} className={`${styles.pagerLink} ${styles.pagerNext}`}>
          <span className={styles.pagerText}>
            <span className={styles.pagerHint}>Następny kamień</span>
            <span className={styles.pagerName}>{next.name}</span>
          </span>
          <span className={`${ui.round} ${styles.pagerIcon}`} aria-hidden="true">
            <ArrowRightIcon />
          </span>
        </Link>
      </nav>

      <JsonLd
        data={[
          okruszkiLd([
            ["Start", "/"],
            ["Moc kamieni", "/moc-kamieni"],
            [stone.name, stoneHref(stone.slug)],
          ]),
          artykulKamieniaLd(stone),
        ]}
      />
    </div>
  );
}
