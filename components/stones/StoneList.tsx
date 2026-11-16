"use client";

import { useEffect, useRef, useState } from "react";
import ui from "@/components/site/ui.module.css";
import { GROUPS, kamienie, nbsp, STONES, stonesByGroup, stonesBySign, ZODIAK, type GroupId, type Znak } from "@/lib/stones";
import { StoneCard } from "./StoneCard";
import styles from "./StoneList.module.css";

type Tryb = "cel" | "znak";

/**
 * Lista kamieni (/moc-kamieni) - dwa sposoby szukania:
 *  - „Czego szukasz?”: grupy według symboliki i intencji (spokój, miłość, radość, siła, przemiana, intuicja),
 *  - „Twój znak”: 12 znaków zodiaku, a pod spodem kamienie, które się im przypisuje.
 */
export function StoneList() {
  const [tryb, setTryb] = useState<Tryb>("cel");
  const [grupa, setGrupa] = useState<GroupId | "wszystkie">("wszystkie");
  const [znak, setZnak] = useState<Znak | null>(null);
  const wrap = useRef<HTMLDivElement>(null);

  // kotwice z innych stron: #znak-baran albo #cel-spokoj
  useEffect(() => {
    const zKotwicy = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      const z = ZODIAK.find((x) => `znak-${x.slug}` === h);
      const g = GROUPS.find((x) => `cel-${x.id}` === h);
      if (!z && !g) return;
      if (z) {
        setTryb("znak");
        setZnak(z.name);
      } else if (g) {
        setTryb("cel");
        setGrupa(g.id);
      }
      requestAnimationFrame(() => wrap.current?.scrollIntoView({ block: "start" }));
    };
    zKotwicy();
    window.addEventListener("hashchange", zKotwicy);
    return () => window.removeEventListener("hashchange", zKotwicy);
  }, []);

  /** Zapamiętuję wybór w adresie (bez przewijania i bez nowego wpisu w historii). */
  const kotwica = (h: string) => window.history.replaceState(null, "", h ? `#${h}` : window.location.pathname);

  const grupy = grupa === "wszystkie" ? GROUPS : GROUPS.filter((g) => g.id === grupa);
  const wybranyZnak = znak ? ZODIAK.find((z) => z.name === znak)! : null;
  const dlaZnaku = znak ? stonesBySign(znak) : [];
  const liczba = tryb === "cel" ? (grupa === "wszystkie" ? STONES.length : stonesByGroup(grupa).length) : dlaZnaku.length;

  return (
    <div ref={wrap} className={styles.wrap}>
      {/* ---------- przełącznik sposobu szukania ---------- */}
      <div className={styles.modes} role="group" aria-label="Jak chcesz szukać kamienia?">
        <button type="button" className={styles.mode} aria-pressed={tryb === "cel"} onClick={() => {
            setTryb("cel");
            kotwica(grupa === "wszystkie" ? "" : `cel-${grupa}`);
          }}>
          <span className={styles.modeTitle}>Czego szukasz?</span>
          <span className={styles.modeHint}>spokoju, miłości, odwagi…</span>
        </button>
        <button type="button" className={styles.mode} aria-pressed={tryb === "znak"} onClick={() => {
            setTryb("znak");
            kotwica(znak ? `znak-${ZODIAK.find((z) => z.name === znak)!.slug}` : "");
          }}>
          <span className={styles.modeTitle}>Twój znak zodiaku</span>
          <span className={styles.modeHint}>kamienie dla Twojego znaku</span>
        </button>
      </div>

      <p className="visually-hidden" aria-live="polite">
        {tryb === "znak" && !znak ? "Wybierz znak zodiaku" : `Pokazuję: ${kamienie(liczba)}`}
      </p>

      {tryb === "cel" ? (
        <>
          <ul className={`${ui.filters} ${styles.filters}`} aria-label="Pokaż kamienie z grupy">
            <li>
              <button type="button" className={ui.filter} aria-pressed={grupa === "wszystkie"} onClick={() => {
                  setGrupa("wszystkie");
                  kotwica("");
                }}>
                Wszystkie
              </button>
            </li>
            {GROUPS.map((g) => (
              <li key={g.id}>
                <button type="button" className={ui.filter} aria-pressed={grupa === g.id} onClick={() => {
                    setGrupa(g.id);
                    kotwica(`cel-${g.id}`);
                  }}>
                  {g.short}
                </button>
              </li>
            ))}
          </ul>

          <div key={grupa} className={styles.groups}>
            {grupy.map((g, gi) => {
              const lista = stonesByGroup(g.id);
              return (
                <section key={g.id} className={styles.group} aria-labelledby={`grupa-${g.id}`}>
                  <header className={styles.groupHead}>
                    <span className={styles.groupNr} aria-hidden="true">
                      {String(GROUPS.indexOf(g) + 1).padStart(2, "0")}
                    </span>
                    <div className={styles.groupText}>
                      <h2 id={`grupa-${g.id}`} className={styles.groupTitle}>
                        {g.title}
                      </h2>
                      <p className={styles.groupLead}>{nbsp(g.lead)}</p>
                    </div>
                    <span className={styles.groupCount}>{kamienie(lista.length)}</span>
                  </header>
                  <ul className={styles.grid}>
                    {lista.map((s, i) => (
                      <li key={s.slug} className={styles.item} style={{ "--i": gi * 2 + i } as React.CSSProperties}>
                        <StoneCard stone={s} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <ul className={styles.signs} aria-label="Wybierz swój znak zodiaku">
            {ZODIAK.map((z) => (
              <li key={z.name}>
                <button type="button" className={styles.sign} aria-pressed={znak === z.name} onClick={() => {
                    setZnak(z.name);
                    kotwica(`znak-${z.slug}`);
                  }}>
                  <span className={styles.signName}>{z.name}</span>
                  <span className={styles.signDates}>{z.dates}</span>
                </button>
              </li>
            ))}
          </ul>

          {wybranyZnak ? (
            <section key={wybranyZnak.name} className={styles.group} aria-labelledby="kamienie-znaku">
              <header className={styles.groupHead}>
                <div className={styles.groupText}>
                  <h2 id="kamienie-znaku" className={styles.groupTitle}>
                    {wybranyZnak.name} <em>{wybranyZnak.dates}</em>
                  </h2>
                  <p className={styles.groupLead}>
                    Te kamienie tradycyjnie przypisuje się Twojemu znakowi. Nosić możesz każdy&nbsp;- wybierz ten, który
                    najbardziej do Ciebie pasuje.
                  </p>
                </div>
                <span className={styles.groupCount}>{kamienie(dlaZnaku.length)}</span>
              </header>
              <ul className={styles.grid}>
                {dlaZnaku.map((s, i) => (
                  <li key={s.slug} className={styles.item} style={{ "--i": i } as React.CSSProperties}>
                    <StoneCard stone={s} highlight={wybranyZnak.name} />
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <p className={styles.hint}>Wybierz swój znak, a&nbsp;pokażę Ci kamienie, które się mu przypisuje.</p>
          )}
        </>
      )}
    </div>
  );
}
