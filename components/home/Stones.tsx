"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRightIcon } from "@/components/icons";
import { BeadCorners, BeadRow, SparkleField } from "@/components/site/Ornaments";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import ui from "@/components/site/ui.module.css";
import { GoldRule } from "@/components/stones/GoldRule";
import { ELEMENTS, nbsp, stoneHref, stonesByElement, type Element } from "@/lib/stones";
import styles from "./Stones.module.css";

/** „Odkryj moc kamieni” - dane z lib/stones.ts (to samo źródło co podstrony /moc-kamieni). */
export function Stones() {
  const [element, setElement] = useState<Element>("ogien");
  const [active, setActive] = useState(0);
  const list = stonesByElement(element);

  return (
    <section className={`${ui.section} ${styles.section}`} aria-labelledby="kamienie-title">
      <div className={styles.head} data-reveal>
        <h2 id="kamienie-title" className={ui.title}>
          Odkryj <span className={styles.pillWord}>moc</span> kamieni
        </h2>
        <BeadRow />
      </div>

      <div className={styles.grid}>
        <article className={`${ui.card} ${styles.intro}`} data-reveal>
          <BeadCorners corners={["tr"]} />
          <SparkleField items={[{ left: "84%", top: "70%", size: 14, d: 1.2 }]} />
          <p className={ui.eyebrow}>Moc kamieni</p>
          <p className={styles.introText}>
            Każdy kamień ma swoje znaczenie i&nbsp;znak zodiaku. Zajrzyj i&nbsp;znajdź ten, który najbardziej do Ciebie pasuje.
          </p>
          <Link href="/moc-kamieni" className={ui.pill}>
            Przejdź do Mocy kamieni
            <ArrowUpRightIcon />
          </Link>
        </article>

        <div className={styles.browser} data-reveal style={{ "--reveal-delay": "0.12s" } as React.CSSProperties}>
          <ul className={ui.filters} aria-label="Wybierz żywioł">
            {ELEMENTS.map((el) => (
              <li key={el.id}>
                <button
                  type="button"
                  className={ui.filter}
                  aria-pressed={element === el.id}
                  onClick={() => {
                    setElement(el.id);
                    setActive(0);
                  }}
                >
                  {el.label}
                </button>
              </li>
            ))}
          </ul>

          <ul key={element} className={styles.cards} aria-label="Kamienie">
            {list.map((s, i) => {
              const open = i === active;
              return (
                <li
                  key={s.slug}
                  className={`${styles.stone} ${open ? styles.open : ""}`}
                  style={{ "--accent": s.accent } as React.CSSProperties}
                >
                  {/* wąska karta: zdjęcie w tle, nazwa pionowo, znak na dole */}
                  <button
                    type="button"
                    className={styles.narrow}
                    onClick={() => setActive(i)}
                    aria-label={`Pokaż kamień: ${s.name}`}
                    aria-hidden={open}
                    tabIndex={open ? -1 : 0}
                  >
                    <PhotoSlot label={s.name} src={s.image} alt="" fill sizes="(max-width: 900px) 100vw, 110px" className={styles.narrowPhoto} />
                    <span className={styles.narrowName}>{s.name}</span>
                    <span className={styles.narrowSign}>{s.sign}</span>
                  </button>

                  {/* szeroka (aktywna) karta */}
                  <article className={styles.wide} inert={!open} aria-hidden={!open}>
                    <div className={styles.wideBody}>
                      <p className={styles.label}>{s.label}</p>
                      <h3 className={styles.name}>{s.name}</h3>
                      <p className={styles.keywords}>{nbsp(s.keywords)}</p>
                      <GoldRule className={styles.rule} />
                      <p className={styles.text}>{nbsp(s.description)}</p>
                      <p className={styles.signNote}>{nbsp(s.signNote)}</p>
                      <Link href={stoneHref(s.slug)} className={`${ui.round} ${ui.roundDark} ${styles.go}`} aria-label={`${s.name} - poznaj kamień`}>
                        <ArrowUpRightIcon />
                      </Link>
                    </div>
                    <div className={styles.widePhoto}>
                      <PhotoSlot
                        label={s.name}
                        src={s.image}
                        alt={`${s.name} - ilustracja kamienia`}
                        ratio="1/1"
                        sizes="(max-width: 900px) 90vw, 340px"
                      />
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
