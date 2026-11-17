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
import { getGroup, getStone, grupaHref, nbsp, stoneHref, stoneSummary, STONES, znakHref } from "@/lib/stones";
import { JsonLd } from "@/components/site/JsonLd";
import { artykulKamieniaLd, meta, okruszkiLd } from "@/lib/seo";
import styles from "./stone.module.css";

type Props = { params: Promise<{ slug: string }> };

/** Opis do wyszukiwarki: opis kamienia (albo symbolika i intencja), maks. 155 znaków - całymi zdaniami. */
function opisMeta(stone: NonNullable<ReturnType<typeof getStone>>) {
  const t = stone.description ?? stoneSummary(stone);
  if (t.length <= 155) return t;
  let out = "";
  for (const z of t.match(/[^.!?]+[.!?]/g) ?? [t]) {
    if ((out + z).trim().length > 155) break;
    out = (out + z).trim() + " ";
  }
  return out.trim() || t.slice(0, 152) + "…";
}

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
    description: opisMeta(stone),
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
  const group = getGroup(stone.group);
  const related = STONES.filter((s) => s.group === stone.group && s.slug !== stone.slug).slice(0, 4);
  const fakty = [
    stone.element && { t: "Żywioł", v: stone.element },
    stone.planet && { t: "Planeta", v: stone.planet },
    stone.chakra && { t: "Czakra", v: stone.chakra },
  ].filter(Boolean) as { t: string; v: string }[];

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
          <Link href={grupaHref(group.id)} className={`${styles.label} reveal`} style={{ "--delay": "0.15s" } as React.CSSProperties}>
            {group.title}
          </Link>
          <h1 className={`${styles.name} reveal`} style={{ "--delay": "0.25s" } as React.CSSProperties}>
            {stone.name}
          </h1>
          {stone.alias && (
            <p className={`${styles.alias} reveal`} style={{ "--delay": "0.3s" } as React.CSSProperties}>
              {stone.alias}
            </p>
          )}
          <p className={`${styles.keywords} reveal`} style={{ "--delay": "0.35s" } as React.CSSProperties}>
            {nbsp(stone.symbolism)}
          </p>
          <GoldRule className={`${styles.rule} reveal`} />
          {stone.description && (
            <p className={`${styles.description} reveal`} style={{ "--delay": "0.5s" } as React.CSSProperties}>
              {nbsp(stone.description)}
            </p>
          )}
          <div className={`${styles.meta} reveal`} style={{ "--delay": "0.6s" } as React.CSSProperties}>
            {stone.intention && (
              <div className={styles.intent}>
                <p className={styles.smallHead}>Intencja</p>
                <p className={styles.intentText}>{nbsp(stone.intention)}</p>
              </div>
            )}
            <div className={styles.signs}>
              <p className={styles.smallHead}>Znaki zodiaku</p>
              <ul className={styles.signList}>
                {stone.zodiac.map((z) => (
                  <li key={z}>
                    <Link href={znakHref(z)} className={styles.signChip}>
                      {z}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </article>

      {/* ---------- Karta kamienia ---------- */}
      {(fakty.length > 0 || stone.numerology) && (
        <section
          className={styles.facts}
          aria-labelledby="karta-kamienia"
          data-reveal
          style={{ "--cols": fakty.length + (stone.numerology ? 1 : 0) } as React.CSSProperties}
        >
          <h2 id="karta-kamienia" className="visually-hidden">
            Karta kamienia
          </h2>
          {stone.numerology && (
            <div className={`${styles.fact} ${styles.factNum}`}>
              <span className={styles.factT}>Numerologia</span>
              <span className={styles.num} aria-hidden="true">
                {stone.numerology.n}
              </span>
              <span className={styles.factV}>
                <span className="visually-hidden">{stone.numerology.n} - </span>
                {nbsp(stone.numerology.text)}
              </span>
            </div>
          )}
          {fakty.map((f) => (
            <div key={f.t} className={styles.fact}>
              <span className={styles.factT}>{f.t}</span>
              <span className={styles.factV}>{nbsp(f.v)}</span>
            </div>
          ))}
        </section>
      )}

      {/* ---------- Ciekawostka i pielęgnacja ---------- */}
      <div className={styles.notes}>
        <section className={`${ui.card} ${styles.note} ${styles.noteFact}`} aria-labelledby="ciekawostka" data-reveal>
          <SparkleField items={[{ left: "90%", top: "14%", size: 12, d: 0.6 }]} />
          <p className={styles.smallHead}>Fakt, nie magia</p>
          <h2 id="ciekawostka" className={styles.noteTitle}>
            Ciekawostka
          </h2>
          <p className={styles.noteText}>{nbsp(stone.fact)}</p>
        </section>
        <section
          className={`${ui.card} ${styles.note}`}
          aria-labelledby="pielegnacja"
          data-reveal
          style={{ "--reveal-delay": "0.1s" } as React.CSSProperties}
        >
          <p className={styles.smallHead}>Na długie lata</p>
          <h2 id="pielegnacja" className={styles.noteTitle}>
            Pielęgnacja
          </h2>
          <p className={styles.noteText}>{nbsp(stone.care)}</p>
        </section>
      </div>

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
            Inne kamienie <em>{nbsp(group.na)}</em>
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
