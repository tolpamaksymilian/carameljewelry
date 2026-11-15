import styles from "./GoldRule.module.css";

/** Cienka złota linia z rombem pośrodku. */
export function GoldRule({ className = "", align = "start" }: { className?: string; align?: "start" | "center" }) {
  return (
    <span className={`${styles.rule} ${align === "center" ? styles.center : ""} ${className}`} aria-hidden="true">
      <span className={styles.line} />
      <span className={styles.diamond} />
      <span className={styles.line} />
    </span>
  );
}
