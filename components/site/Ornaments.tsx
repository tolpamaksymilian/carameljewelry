import styles from "./Ornaments.module.css";

/** Miedziane romby w rogach - te same, co w ramce strony „już wkrótce”. */
export function CopperCorners({ inset = 14 }: { inset?: number }) {
  return (
    <span className={styles.corners} style={{ "--inset": `${inset}px` } as React.CSSProperties} aria-hidden="true">
      <span className={`${styles.diamond} ${styles.tl}`} />
      <span className={`${styles.diamond} ${styles.tr}`} />
      <span className={`${styles.diamond} ${styles.bl}`} />
      <span className={`${styles.diamond} ${styles.br}`} />
    </span>
  );
}

type Corner = "tl" | "tr" | "bl" | "br";

/** Drobne koraliki (perła + miedź) w wybranych rogach sekcji. */
export function BeadCorners({ corners = ["tl", "br"] }: { corners?: Corner[] }) {
  return (
    <>
      {corners.map((c) => (
        <span key={c} className={`${styles.beadCorner} ${styles[`bc_${c}`]}`} aria-hidden="true">
          <span className={`${styles.bead} ${styles.copper}`} />
          <span className={`${styles.bead} ${styles.pearl}`} />
          <span className={`${styles.bead} ${styles.copper} ${styles.small}`} />
          <span className={`${styles.bead} ${styles.pearl} ${styles.small}`} />
        </span>
      ))}
    </>
  );
}

/** Rząd trzech kół-koralików (perła, miedź, perła). */
export function BeadRow({ className = "" }: { className?: string }) {
  return (
    <span className={`${styles.beadRow} ${className}`} aria-hidden="true">
      <span className={`${styles.ball} ${styles.ballPearl}`} />
      <span className={`${styles.ball} ${styles.ballCopper}`} />
      <span className={`${styles.ball} ${styles.ballGold}`} />
    </span>
  );
}

/** Wachlarz promieni - jak promienie z gwiazdki logo. */
export function FanOrnament({ className = "" }: { className?: string }) {
  const rays = Array.from({ length: 11 }, (_, i) => -75 + i * 15);
  return (
    <svg className={`${styles.fan} ${className}`} viewBox="0 0 120 64" aria-hidden="true" focusable="false">
      {rays.map((deg, i) => (
        <line
          key={deg}
          x1="60"
          y1="60"
          x2="60"
          y2={i % 2 === 0 ? 6 : 18}
          transform={`rotate(${deg} 60 60)`}
          stroke="currentColor"
          strokeWidth={i % 2 === 0 ? 1.2 : 0.9}
          strokeLinecap="round"
        />
      ))}
      <circle cx="60" cy="60" r="3.6" className={styles.fanBead} />
    </svg>
  );
}

const DEFAULT_SPARKLES = [
  { left: "6%", top: "18%", size: 14, d: 0.4 },
  { left: "94%", top: "30%", size: 11, d: 2.2 },
  { left: "88%", top: "86%", size: 15, d: 3.6 },
];

type SparkleSpec = { left: string; top: string; size: number; d: number };

/** Kilka migoczących gwiazdek - z umiarem. */
export function SparkleField({ items = DEFAULT_SPARKLES }: { items?: SparkleSpec[] }) {
  return (
    <span className={styles.sparkles} aria-hidden="true">
      {items.map((s, i) => (
        <svg
          key={i}
          className={styles.sparkle}
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, "--d": `${s.d}s` } as React.CSSProperties}
          viewBox="0 0 20 20"
          focusable="false"
        >
          <path d="M10 0 C10.8 6.6 13.4 9.2 20 10 C13.4 10.8 10.8 13.4 10 20 C9.2 13.4 6.6 10.8 0 10 C6.6 9.2 9.2 6.6 10 0Z" />
        </svg>
      ))}
    </span>
  );
}

/** Ozdobnik między sekcjami: cienka złota linia z perłą i dwoma złotymi koralikami. */
export function SectionDivider({ pull = false }: { pull?: boolean }) {
  return (
    <div className={`${styles.sectionDivider} ${pull ? styles.dividerPull : ""}`} aria-hidden="true" data-reveal>
      <span className={styles.dividerBeads}>
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}
