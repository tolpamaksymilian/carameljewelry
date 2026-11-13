import styles from "./BrandLogo.module.css";

type BrandLogoProps = {
  /** Rozmiar logo: `lg` — strona główna, `sm` — strony podrzędne. */
  size?: "lg" | "sm";
  /** Element nagłówka dla nazwy marki (np. `h1` na stronie głównej). */
  as?: "h1" | "p" | "div";
  /** Opóźnienie animacji wejścia w sekundach. */
  delay?: number;
};

/** Typograficzne logo: złote CARAMEL z podpisem HANDMADE JEWELRY. */
export function BrandLogo({ size = "lg", as: Tag = "div", delay = 0 }: BrandLogoProps) {
  return (
    <Tag className={`${styles.logo} ${styles[size]}`} aria-label="Caramel Handmade Jewelry">
      <span
        className={`${styles.wordmark} reveal`}
        style={{ "--delay": `${delay}s` } as React.CSSProperties}
        aria-hidden="true"
      >
        Caramel
      </span>
      <span
        className={`${styles.tagline} reveal`}
        style={{ "--delay": `${delay + 0.35}s` } as React.CSSProperties}
        aria-hidden="true"
      >
        Handmade Jewelry
      </span>
    </Tag>
  );
}
