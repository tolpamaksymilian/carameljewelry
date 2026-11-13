import styles from "./Sparkles.module.css";

/** Kilka drobnych, czteroramiennych gwiazdek jak w logo — migoczą powoli, każda w innym rytmie. */
const SPARKLES = [
  { left: "14%", top: "34%", size: 16, d: 0.6 },
  { left: "86%", top: "46%", size: 12, d: 2.4 },
  { left: "10%", top: "78%", size: 10, d: 3.8 },
  { left: "90%", top: "82%", size: 18, d: 1.4 },
];

export function Sparkles() {
  return (
    <div className={styles.layer} aria-hidden="true">
      {SPARKLES.map((s, i) => (
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
    </div>
  );
}
