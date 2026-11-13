import Image from "next/image";
import styles from "./BrandLogo.module.css";

type BrandLogoProps = {
  /** Rozmiar logo: `lg` — strona główna, `sm` — strony podrzędne. */
  size?: "lg" | "sm";
  /** Element opakowujący (np. `h1` na stronie głównej). */
  as?: "h1" | "div";
  /** Opóźnienie animacji wejścia w sekundach. */
  delay?: number;
};

/** Oryginalne logo Caramel (WebP z przezroczystym tłem) z migoczącą gwiazdką. */
export function BrandLogo({ size = "lg", as: Tag = "div", delay = 0 }: BrandLogoProps) {
  return (
    <Tag className={`${styles.logo} ${styles[size]} reveal`} style={{ "--delay": `${delay}s` } as React.CSSProperties}>
      <Image
        src="/brand/caramel-logo.webp"
        alt="Caramel Handmade Jewelry"
        width={1626}
        height={814}
        priority
        className={styles.image}
      />
      {/* błysk nałożony na gwiazdkę z logo */}
      <span className={styles.glint} aria-hidden="true" />
    </Tag>
  );
}
