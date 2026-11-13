import { BeadGarland } from "./BeadGarland";
import { Sparkles } from "./Sparkles";
import styles from "./Stage.module.css";

type StageProps = {
  children: React.ReactNode;
  /** Naszyjnik u góry strony (strona główna). */
  garland?: boolean;
};

/**
 * Pełnoekranowa „scena” z delikatną miedzianą ramką — wspólna dla wszystkich stron.
 * Zawartość jest wyśrodkowana w pionie i poziomie.
 */
export function Stage({ children, garland = false }: StageProps) {
  return (
    <div className={`${styles.stage} ${garland ? styles.withGarland : ""}`}>
      <div className={`${styles.frame} reveal-fade`} style={{ "--delay": "0.1s" } as React.CSSProperties} aria-hidden="true">
        <span className={`${styles.corner} ${styles.tl}`} />
        <span className={`${styles.corner} ${styles.tr}`} />
        <span className={`${styles.corner} ${styles.bl}`} />
        <span className={`${styles.corner} ${styles.br}`} />
      </div>
      {garland && <BeadGarland />}
      <Sparkles />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
