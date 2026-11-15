import logo from "@/components/BrandLogo.module.css";

/**
 * Oryginalne logo Caramel (przezroczyste tło) w nagłówku i stopce - lekkie, przeskalowane kopie
 * oryginalnego pliku (scripts/zdjecia.mjs). Wygląd i błysk gwiazdki jak w components/BrandLogo.
 */
export function SiteLogo({ size, priority = false }: { size: "nav" | "footer"; priority?: boolean }) {
  return (
    <div className={`${logo.logo} ${logo[size]}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- statyczny eksport: własne rozmiary w srcset */}
      <img
        src="/brand/caramel-logo-320.webp"
        srcSet="/brand/caramel-logo-320.webp 320w, /brand/caramel-logo-640.webp 640w"
        sizes={size === "nav" ? "150px" : "220px"}
        alt="Caramel Handmade Jewelry"
        width={1626}
        height={814}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={logo.image}
      />
      {/* błysk nałożony na gwiazdkę z logo */}
      <span className={logo.glint} aria-hidden="true" />
    </div>
  );
}
