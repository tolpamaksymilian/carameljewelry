import styles from "./Ornament.module.css";

/** Złoty separator: cienka linia — romb — cienka linia. */
export function Ornament({ delay = 0 }: { delay?: number }) {
  return (
    <div className={styles.ornament} style={{ "--delay": `${delay}s` } as React.CSSProperties} aria-hidden="true">
      <span className={`${styles.line} ${styles.left}`} />
      <span className={styles.diamond} />
      <span className={`${styles.line} ${styles.right}`} />
    </div>
  );
}
