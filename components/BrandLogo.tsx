import Image from "next/image";
import styles from "./BrandLogo.module.css";

type BrandLogoProps = {
  /** Rozmiar logo: `lg` - strona „już wkrótce”, `sm` - 404, `nav` - nagłówek, `footer` - stopka. */
  size?: "lg" | "sm" | "nav" | "footer";
  /** Element opakowujący (np. `h1` na stronie głównej). */
  as?: "h1" | "div";
  /** Opóźnienie animacji wejścia w sekundach. */
  delay?: number;
  /** Animacja wejścia (wyłączona w nagłówku i stopce). */
  animate?: boolean;
  /** Ładowanie z priorytetem (logo widoczne od razu po wejściu). */
  priority?: boolean;
};

/** Oryginalne logo Caramel (WebP z przezroczystym tłem) z migoczącą gwiazdką. */
export function BrandLogo({ size = "lg", as: Tag = "div", delay = 0, animate = true, priority = true }: BrandLogoProps) {
  return (
    <Tag className={`${styles.logo} ${styles[size]} ${animate ? "reveal" : ""}`} style={{ "--delay": `${delay}s` } as React.CSSProperties}>
      <Image
        src="/brand/caramel-logo.webp"
        alt="Caramel Handmade Jewelry"
        width={1626}
        height={814}
        priority={priority}
        sizes={size === "nav" ? "180px" : size === "footer" ? "240px" : undefined}
        className={styles.image}
      />
      {/* błysk nałożony na gwiazdkę z logo */}
      <span className={styles.glint} aria-hidden="true" />
    </Tag>
  );
}
