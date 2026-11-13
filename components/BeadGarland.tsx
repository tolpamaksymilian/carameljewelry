import styles from "./BeadGarland.module.css";

/**
 * Naszyjnik zawieszony u góry strony: sznur pereł przeplatanych miedzianymi koralikami,
 * delikatny łańcuszek z drobnymi koralikami i karmelowa kropla-zawieszka (nawiązanie do logo).
 *
 * Drut to SVG rozciągany na całą szerokość (dowolne proporcje ekranu), a koraliki to elementy
 * pozycjonowane w procentach — dzięki temu zawsze pozostają okrągłe.
 * Geometria liczona jest w czasie budowania — wynik to czysty, statyczny HTML.
 */

const VB_W = 1200;
const VB_H = 210;
const CX = VB_W / 2;

type Pt = { x: number; y: number };
type Strand = { p0: Pt; c: Pt; p2: Pt };

function quad({ p0, c, p2 }: Strand, t: number): Pt {
  const u = 1 - t;
  return { x: u * u * p0.x + 2 * u * t * c.x + t * t * p2.x, y: u * u * p0.y + 2 * u * t * c.y + t * t * p2.y };
}

/** Punkty rozłożone na łuku w równych odstępach (wg długości łuku). */
function alongArc(s: Strand, spacing: number) {
  const STEPS = 2000;
  const pts: Pt[] = [];
  let acc = 0;
  let next = spacing / 2;
  let prev = quad(s, 0);
  for (let i = 1; i <= STEPS; i++) {
    const p = quad(s, i / STEPS);
    acc += Math.hypot(p.x - prev.x, p.y - prev.y);
    if (acc >= next) {
      pts.push(p);
      next += spacing;
    }
    prev = p;
  }
  return pts.filter((p) => p.x > -10 && p.x < VB_W + 10);
}

const pct = (n: number, of: number) => `${Math.round((n / of) * 10000) / 100}%`;
const r2 = (n: number) => Math.round(n * 100) / 100;

// Sznur 1 — perły z miedzianymi przekładkami, perły większe ku środkowi
const S1: Strand = { p0: { x: -60, y: -6 }, c: { x: CX, y: 2 * 128 }, p2: { x: VB_W + 60, y: -6 } };
const s1Beads = alongArc(S1, 17).map((p, i) => {
  const centerness = 1 - Math.min(1, Math.abs(p.x - CX) / (VB_W / 2 + 40));
  const pearl = i % 2 === 0;
  return {
    ...p,
    pearl,
    r: pearl ? 4.6 + 3.4 * centerness : 2.4 + 0.6 * centerness,
    delay: 0.4 + (Math.abs(p.x - CX) / (VB_W / 2)) * 0.9,
  };
});
const bottom = quad(S1, 0.5);

// Sznur 2 — cienki łańcuszek z drobnymi miedzianymi koralikami
const S2: Strand = { p0: { x: -60, y: -6 }, c: { x: CX, y: 2 * 78 }, p2: { x: VB_W + 60, y: -6 } };
const s2Beads = alongArc(S2, 15).map((p) => ({ ...p, delay: 0.2 + (Math.abs(p.x - CX) / (VB_W / 2)) * 0.8 }));

const pathD = (s: Strand) => `M${s.p0.x} ${s.p0.y} Q${s.c.x} ${s.c.y} ${s.p2.x} ${s.p2.y}`;

/** Styl koralika: pozycja w %, średnica jako ułamek wysokości naszyjnika. */
const beadStyle = (x: number, y: number, r: number, delay: number) =>
  ({
    left: pct(x, VB_W),
    top: pct(y, VB_H),
    "--s": r2((2 * r) / VB_H),
    "--d": `${r2(delay)}s`,
  }) as React.CSSProperties;

export function BeadGarland() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      {/* druty — rozciągane, stała grubość linii */}
      <svg className={styles.wires} viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" focusable="false">
        <path className={styles.chain} d={pathD(S2)} vectorEffect="non-scaling-stroke" />
        <path className={styles.wire} d={pathD(S1)} vectorEffect="non-scaling-stroke" />
      </svg>

      {s2Beads.map((b, i) => (
        <span key={`c${i}`} className={`${styles.bead} ${styles.tiny}`} style={beadStyle(b.x, b.y, 1.9, b.delay)} />
      ))}
      {s1Beads.map((b, i) => (
        <span
          key={`p${i}`}
          className={`${styles.bead} ${b.pearl ? styles.pearl : styles.copper}`}
          style={beadStyle(b.x, b.y, b.r, b.delay)}
        />
      ))}

      {/* zawieszka: miedziane kapturki, perła i kropla karmelu */}
      <span className={styles.pendantSlot} style={{ left: pct(bottom.x, VB_W), top: pct(bottom.y, VB_H) }}>
        <svg className={styles.pendant} viewBox="-12 0 24 76" focusable="false">
          <defs>
            <radialGradient id="gp-pearl" cx="36%" cy="32%" r="72%">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset=".42" stopColor="#f7eee6" />
              <stop offset=".78" stopColor="#e4cfbf" />
              <stop offset="1" stopColor="#c7a690" />
            </radialGradient>
            <radialGradient id="gp-copper" cx="34%" cy="30%" r="75%">
              <stop offset="0" stopColor="#f8cf98" />
              <stop offset=".45" stopColor="#c47b3a" />
              <stop offset="1" stopColor="#763c15" />
            </radialGradient>
            <linearGradient id="gp-drop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f6c48a" />
              <stop offset=".35" stopColor="#d08540" />
              <stop offset=".75" stopColor="#9a5220" />
              <stop offset="1" stopColor="#6e3511" />
            </linearGradient>
          </defs>
          <line x1="0" y1="0" x2="0" y2="16" stroke="#a9612a" strokeWidth="1" strokeOpacity=".75" />
          <circle cx="0" cy="13" r="3.2" fill="url(#gp-copper)" />
          <circle cx="0" cy="26" r="9.5" fill="url(#gp-pearl)" />
          <circle cx="-3.2" cy="22.6" r="2.5" fill="#fff" opacity=".9" />
          <circle cx="0" cy="38" r="2.6" fill="url(#gp-copper)" />
          <path d="M0 40 C2 50 9 56 9 64 A9 9 0 0 1 -9 64 C-9 56 -2 50 0 40Z" fill="url(#gp-drop)" />
          <ellipse cx="-3.6" cy="61" rx="1.6" ry="3.6" fill="#fff4e4" opacity=".75" />
        </svg>
      </span>
    </div>
  );
}
