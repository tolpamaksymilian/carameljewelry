import styles from "./Stage.module.css";

/**
 * Pełnoekranowa „scena” z delikatną złotą ramką — wspólna dla strony głównej i 404.
 * Zawartość jest wyśrodkowana w pionie i poziomie.
 */
export function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.stage}>
      <div className={`${styles.frame} reveal-fade`} style={{ "--delay": "0.2s" } as React.CSSProperties} aria-hidden="true">
        <span className={`${styles.corner} ${styles.tl}`} />
        <span className={`${styles.corner} ${styles.tr}`} />
        <span className={`${styles.corner} ${styles.bl}`} />
        <span className={`${styles.corner} ${styles.br}`} />
      </div>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
