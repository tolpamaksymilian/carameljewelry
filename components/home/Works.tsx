"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, HeartIcon } from "@/components/icons";
import { FanOrnament } from "@/components/site/Ornaments";
import { Lightbox } from "@/components/site/Lightbox";
import { Foto } from "@/components/site/Foto";
import ui from "@/components/site/ui.module.css";
import { t } from "@/lib/teksty";
import { etykietaTypu, liczbaZdjec, maBransoletke, maNaszyjnik, type Praca } from "@/lib/prace-typy";
import styles from "./Works.module.css";

/** Robię wyłącznie naszyjniki i bransoletki - zestaw pokazuje się w obu filtrach. */
type Filtr = "wszystkie" | "naszyjniki" | "bransoletki";

const FILTERS: { id: Filtr; label: string }[] = [
  { id: "wszystkie", label: "Wszystkie" },
  { id: "naszyjniki", label: "Naszyjniki" },
  { id: "bransoletki", label: "Bransoletki" },
];

const pasuje = (p: Praca, f: Filtr) => f === "wszystkie" || (f === "naszyjniki" ? maNaszyjnik(p) : maBransoletke(p));

/** Sekcja „Ręcznie zrobione - dla Ciebie”: karuzela wybranych prac (dane przekazuje strona). */
export function Works({ prace }: { prace: Praca[] }) {
  const [filter, setFilter] = useState<Filtr>("wszystkie");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [gallery, setGallery] = useState<{ praca: Praca; index: number } | null>(null);
  const [position, setPosition] = useState(1);
  const [edges, setEdges] = useState({ start: true, end: false });
  const trackRef = useRef<HTMLUListElement>(null);

  const items = prace.filter((p) => pasuje(p, filter));

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    const step = first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || "0") : 1;
    setPosition(Math.min(items.length, Math.round(track.scrollLeft / step) + 1));
    setEdges({ start: track.scrollLeft < 4, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4 });
  }, [items.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: 0 });
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, filter]);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;
    track.scrollBy({ left: dir * (first.getBoundingClientRect().width + 16), behavior: "smooth" });
  };

  const toggleLike = (id: string) =>
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section id="prace" className={`${ui.section} ${styles.section}`} aria-labelledby="prace-title">
      <div className={styles.head} data-reveal>
        <h2 id="prace-title" className={`${ui.title} ${styles.heading}`}>
          <span className={styles.line1}>{t("glowna.prace.tytul")}</span>
          <span className={styles.middle} aria-hidden="true">
            <FanOrnament />
          </span>
          <em className={styles.line2}>{t("glowna.prace.tytul_akcent")}</em>
        </h2>
        <Link href="/pracownia#wszystkie-prace" className={`${ui.pill} ${ui.pillOutline} ${styles.all}`}>
          Zobacz wszystkie
          <ArrowUpRightIcon />
        </Link>
      </div>

      <div className={styles.intro} data-reveal>
        <p className={`${ui.text} ${styles.lead}`}>{t("glowna.prace.wstep")}</p>
        <ul className={ui.filters} aria-label="Filtruj prace">
          {FILTERS.map((f) => (
            <li key={f.id}>
              <button type="button" className={ui.filter} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ul ref={trackRef} className={styles.track} aria-label="Prace" data-reveal>
        {items.map((p) => (
          <li key={p.slug} className={styles.item}>
            <article className={`${ui.card} ${ui.lift} ${styles.card}`}>
              <div className={styles.photo}>
                <button
                  type="button"
                  className={styles.open}
                  onClick={() => setGallery({ praca: p, index: 0 })}
                  aria-label={`${p.nazwa} - zobacz zdjęcia (${p.zdjecia.length})`}
                >
                  <Foto
                    zdjecie={p.okladka}
                    ratio="4 / 5"
                    sizes="(max-width: 600px) 76vw, (max-width: 820px) 46vw, (max-width: 1100px) 31vw, 310px"
                  />
                </button>
                <div className={styles.tags}>
                  <span className={ui.tag}>{etykietaTypu(p)}</span>
                  {p.zdjecia.length > 1 && <span className={`${ui.tag} ${styles.photos}`}>{liczbaZdjec(p.zdjecia.length)}</span>}
                </div>
                <div className={styles.icons}>
                  <button
                    type="button"
                    className={`${ui.round} ${styles.small}`}
                    aria-pressed={liked.has(p.slug)}
                    aria-label={`Polub: ${p.nazwa}`}
                    onClick={() => toggleLike(p.slug)}
                  >
                    <HeartIcon filled={liked.has(p.slug)} />
                  </button>
                  <Link href={`/pracownia#${p.slug}`} className={`${ui.round} ${styles.small}`} aria-label={`${p.nazwa} - więcej w pracowni`}>
                    <ArrowUpRightIcon />
                  </Link>
                </div>
              </div>
              <div className={styles.body}>
                <h3 className={styles.name}>{p.nazwa}</h3>
                <p className={styles.desc}>{p.opis}</p>
                <Link href="/kontakt" className={styles.ask}>
                  Zapytaj o dostępność <ArrowUpRightIcon />
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div className={styles.controls}>
        <span className={ui.counter} aria-live="polite">
          <strong>{position}</strong> / {items.length}
        </span>
        <span className={styles.arrows}>
          <button type="button" className={ui.round} onClick={() => scrollBy(-1)} disabled={edges.start} aria-label="Poprzednie prace">
            <ArrowLeftIcon />
          </button>
          <button type="button" className={ui.round} onClick={() => scrollBy(1)} disabled={edges.end} aria-label="Następne prace">
            <ArrowRightIcon />
          </button>
        </span>
      </div>

      <Lightbox
        title={gallery?.praca.nazwa ?? ""}
        subtitle={gallery ? etykietaTypu(gallery.praca) : undefined}
        images={gallery?.praca.zdjecia ?? []}
        index={gallery?.index ?? null}
        onChange={(index) => setGallery((g) => (g ? { ...g, index } : g))}
        onClose={() => setGallery(null)}
      />
    </section>
  );
}
