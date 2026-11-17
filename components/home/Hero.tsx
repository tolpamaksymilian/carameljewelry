"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, PlusIcon } from "@/components/icons";
import { CopperCorners, SparkleField } from "@/components/site/Ornaments";
import { Foto } from "@/components/site/Foto";
import ui from "@/components/site/ui.module.css";
import type { Zdjecie } from "@/lib/prace-typy";
import { rich, t } from "@/lib/teksty";
import styles from "./Hero.module.css";

type Slide = {
  /** Nazwa pliku w public/zdjecia/hero (bez końcówki): powstają z niej wersje -2400, -1440 i -mobile. */
  file: string;
  alt: string;
  /** Kadrowanie na komputerze i tablecie (object-position): gdzie leży motyw. */
  position: string;
  /** Kadrowanie pionowej wersji na telefon. */
  mobilePosition: string;
  /** Dodatkowe, lżejsze szerokości pionowej wersji (pliki -mobile-<szer>.webp); pełna ma 760 px. */
  mobileWidths?: number[];
  /** Ciemne zdjęcie - jasny tekst. */
  tone?: "light" | "dark";
  /** Mały podpis wersalikami nad nagłówkiem. */
  eyebrow: string;
  /** Nagłówek slajdu - fragment w <em> pisany kursywą. */
  title: React.ReactNode;
};

/**
 * Slajdy tła hero. Każde zdjęcie ma 3 wersje w public/zdjecia/hero:
 * -2400 i -1440 (poziome, 16:10) oraz -mobile (pionowy kadr wycięty wokół biżuterii).
 */
const CZERN_I_PERLA: Slide = {
  file: "hero-czern-i-perla",
  mobileWidths: [520, 680],
  alt: "Czarno-perłowy naszyjnik i bransoletka Caramel przewieszone przez kryształowy kieliszek, w tle miedziana satyna",
  position: "100% 50%",
  mobilePosition: "50% 50%",
  tone: "dark",
  eyebrow: "Czerń i perła",
  title: (
    <>
      Klasyka, która <em>pasuje do wszystkiego</em>
    </>
  ),
};

const SLIDES_BEZ_PIERWSZEGO: Slide[] = [
  {
    file: "hero-1",
    alt: "Naszyjnik z pereł z zawieszką-truskawką na złotym widelcu, obok talerzyk w truskawki i rozsypane perły",
    position: "72% 50%",
    mobilePosition: "45% 50%",
    eyebrow: t("glowna.hero.poziomka.nadtytul"),
    title: rich("glowna.hero.poziomka.tytul"),
  },
  {
    file: "hero-2",
    alt: "Bransoletki z drewnianych koralików i pereł zawieszone na kryształowym kieliszku, w tle brązowa satyna",
    position: "74% 50%",
    mobilePosition: "40% 50%",
    tone: "dark",
    eyebrow: t("glowna.hero.bransoletki.nadtytul"),
    title: rich("glowna.hero.bransoletki.tytul"),
  },
  {
    file: "hero-3",
    alt: "Naszyjnik z miodowych koralików i pereł oraz złoty łańcuszek z medalikiem na modelce w beżowej marynarce",
    position: "80% 50%",
    mobilePosition: "50% 50%",
    eyebrow: t("glowna.hero.naszyjniki.nadtytul"),
    title: rich("glowna.hero.naszyjniki.tytul"),
  },
  {
    file: "hero-4",
    alt: "Naszyjnik i bransoletka z niebieskich kamieni na modelce w beżowej marynarce",
    position: "78% 50%",
    mobilePosition: "45% 50%",
    eyebrow: t("glowna.hero.komplet.nadtytul"),
    title: rich("glowna.hero.komplet.tytul"),
  },
];

/**
 * Pierwszy slajd hero. Żeby zacząć od Poziomki, ustaw "poziomka"
 * (slajd hero-1 z naszyjnikiem Poziomka przejdzie na początek).
 */
const PIERWSZY_SLAJD: "czern-i-perla" | "poziomka" = "czern-i-perla";

const KOLEJNOSC: Slide[] =
  PIERWSZY_SLAJD === "czern-i-perla" ? [CZERN_I_PERLA, ...SLIDES_BEZ_PIERWSZEGO] : [...SLIDES_BEZ_PIERWSZEGO, CZERN_I_PERLA];

/** Pierwszy slajd zawsze niesie główne hasło marki. */
const SLIDES: Slide[] = KOLEJNOSC.map((s, i) =>
  i === 0
    ? {
        ...s,
        eyebrow: t("glowna.hero.haslo.nadtytul"),
        title: rich("glowna.hero.haslo.tytul"),
      }
    : s,
);

const BASE = "/zdjecia/hero";

const pad = (n: number) => String(n).padStart(2, "0");

type HeroProps = {
  /** Zdjęcie w karcie „Wyróżniona praca”. */
  wyrozniona: Zdjecie;
  /** Wyróżniona praca (wybierana w panelu) - nazwa i kotwica w /pracownia. */
  praca: { slug: string; nazwa: string };
  /** Rozmyte podglądy slajdów (lib/zdjecia.generated.ts → HERO_BLUR). */
  blur: Record<string, { wide: string; mobile: string }>;
};

export function Hero({ wyrozniona, praca, blur }: HeroProps) {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const dark = SLIDES[index].tone === "dark";
  // po pierwszej zmianie slajdu tekst podmienia się krótszą animacją (bez opóźnienia wejścia strony)
  const [changed, setChanged] = useState(false);
  // zdjęcia kolejnych slajdów pobieram dopiero, gdy są potrzebne (pierwszy od razu)
  const [wanted, setWanted] = useState<ReadonlySet<number>>(() => new Set([0]));
  const want = (...ids: number[]) =>
    setWanted((prev) => (ids.every((i) => prev.has(i)) ? prev : new Set([...prev, ...ids])));
  const wrap = (i: number) => (i + SLIDES.length) % SLIDES.length;
  /** Zanim ktoś kliknie strzałkę - przygotuj sąsiednie slajdy. */
  const warm = () => want(wrap(index + 1), wrap(index - 1));
  const go = (dir: 1 | -1) => {
    const next = wrap(index + dir);
    setChanged(true);
    want(next, wrap(next + dir));
    setIndex(next);
  };
  const slide = SLIDES[index];
  const textAnim = (delay: number) =>
    changed
      ? { className: styles.swap, style: { "--swap-delay": `${delay * 0.4}s` } as React.CSSProperties }
      : { className: "reveal", style: { "--delay": `${delay}s` } as React.CSSProperties };

  return (
    <section
      className={`${styles.hero} ${dark ? styles.dark : ""}`}
      aria-labelledby="hero-title"
      aria-roledescription="karuzela"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        warm();
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className={styles.media}>
        {SLIDES.map((s, i) => (
          <picture
            key={s.file}
            className={`${styles.slide} ${i === index ? styles.active : ""}`}
            style={
              {
                "--pos": s.position,
                "--pos-m": s.mobilePosition,
                "--blur": blur[s.file] ? `url(${blur[s.file].wide})` : undefined,
                "--blur-m": blur[s.file] ? `url(${blur[s.file].mobile})` : undefined,
              } as React.CSSProperties
            }
          >
            {wanted.has(i) && (
              <>
                <source
                  media="(max-width: 600px)"
                  srcSet={[...(s.mobileWidths ?? []).map((w) => `${BASE}/${s.file}-mobile-${w}.webp ${w}w`), `${BASE}/${s.file}-mobile.webp 760w`].join(", ")}
                  sizes="calc(100vw - 28px)"
                  type="image/webp"
                />
                <source
                  srcSet={`${BASE}/${s.file}-1440.webp 1440w, ${BASE}/${s.file}-2400.webp 2400w`}
                  sizes="(max-width: 1360px) 100vw, 1320px"
                  type="image/webp"
                />
                {/* zwykły <img>: statyczny eksport - własne wersje i kadr na telefon zamiast optymalizacji next/image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${BASE}/${s.file}-1440.webp`}
                  alt={i === index ? s.alt : ""}
                  className={styles.photo}
                  width={2400}
                  height={1500}
                  loading="eager"
                  fetchPriority={i === 0 ? "high" : "low"}
                  decoding="async"
                />
              </>
            )}
          </picture>
        ))}
      </div>
      <div className={styles.veil} aria-hidden="true" />
      <CopperCorners inset={16} />
      <SparkleField
        items={[
          { left: "44%", top: "14%", size: 15, d: 0.8 },
          { left: "6%", top: "82%", size: 11, d: 2.6 },
        ]}
      />

      <div className={styles.content}>
        <p key={`e${index}`} className={`${ui.eyebrow} ${textAnim(0.1).className}`} style={textAnim(0.1).style}>
          {slide.eyebrow}
        </p>
        <h1 key={`t${index}`} id="hero-title" className={`${styles.title} ${textAnim(0.25).className}`} style={textAnim(0.25).style}>
          {slide.title}
        </h1>
        <div className={`${styles.ctas} reveal`} style={{ "--delay": "0.45s" } as React.CSSProperties}>
          <Link href="/pracownia#wszystkie-prace" className={ui.pill}>
            Zobacz moje prace
          </Link>
          <Link href="/moc-kamieni" className={`${ui.pill} ${ui.pillOutline}`}>
            Znajdź swój kamień
            <ArrowUpRightIcon />
          </Link>
        </div>

        <div className={styles.slider}>
          <span className={ui.counter} aria-live="polite">
            <strong className={styles.current}>{pad(index + 1)}</strong>
            <span className={styles.track} aria-hidden="true">
              <span className={styles.progress} style={{ width: `${((index + 1) / SLIDES.length) * 100}%` }} />
            </span>
            <span>{pad(SLIDES.length)}</span>
            <span className="visually-hidden">
              Slajd {index + 1} z {SLIDES.length}
            </span>
          </span>
          <span className={styles.arrows} onPointerEnter={warm} onFocus={warm}>
            <button type="button" className={ui.round} onClick={() => go(-1)} aria-label="Poprzedni slajd">
              <ArrowLeftIcon />
            </button>
            <button type="button" className={ui.round} onClick={() => go(1)} aria-label="Następny slajd">
              <ArrowRightIcon />
            </button>
          </span>
        </div>
      </div>

      {/* telefon: te same przyciski pod zdjęciem (w hero są ukryte, żeby nie zasłaniały biżuterii) */}
      <div className={styles.ctasBelow}>
        <Link href="/pracownia#wszystkie-prace" className={ui.pill}>
          Zobacz moje prace
        </Link>
        <Link href="/moc-kamieni" className={`${ui.pill} ${ui.pillOutline}`}>
          Znajdź swój kamień
          <ArrowUpRightIcon />
        </Link>
      </div>

      <aside className={styles.side} aria-label="Wyróżnione">
        <article className={`${styles.featured} ${ui.lift}`} data-reveal style={{ "--reveal-delay": "0.5s" } as React.CSSProperties}>
          <div className={styles.featuredPhoto}>
            {/* bez priorytetu: pierwszeństwo ma zdjęcie tła hero */}
            <Foto zdjecie={wyrozniona} ratio="4 / 5" sizes="100px" />
          </div>
          <div className={styles.featuredBody}>
            <p className={styles.featuredKicker}>Wyróżniona praca</p>
            <h2 className={styles.featuredName}>{praca.nazwa}</h2>
            <p className={styles.featuredText}>{t("glowna.hero.wyrozniona.podpis")}</p>
          </div>
          <Link href={`/pracownia#${praca.slug}`} className={`${ui.round} ${ui.roundDark} ${styles.featuredLink}`} aria-label={`${praca.nazwa} - zobacz pracę`}>
            <ArrowUpRightIcon />
          </Link>
        </article>

        <article className={`${styles.custom} ${ui.lift}`} data-reveal style={{ "--reveal-delay": "0.65s" } as React.CSSProperties}>
          <p className={styles.customText}>{rich("glowna.hero.zamowienie")}</p>
          <Link href="/kontakt" className={`${ui.round} ${styles.plus}`} aria-label="Zaprojektujmy razem - napisz do mnie">
            <PlusIcon />
          </Link>
        </article>
      </aside>
    </section>
  );
}
