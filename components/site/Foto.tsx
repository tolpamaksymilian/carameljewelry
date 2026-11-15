"use client";

import type { Zdjecie } from "@/lib/prace-typy";
import styles from "./Foto.module.css";

type FotoProps = {
  zdjecie: Zdjecie;
  /** Proporcje ramki, np. "4 / 5" albo "1 / 1". Pomiń, by użyć proporcji zdjęcia. */
  ratio?: string;
  /** Atrybut sizes - szerokość ramki na stronie. */
  sizes: string;
  /** Zdjęcie widoczne od razu po wejściu (bez lazy-loadingu i bez wyłaniania). */
  priority?: boolean;
  /** Kadrowanie inne niż zapisane w zdjęciu. */
  pozycja?: string;
  /** Kształt ramki. */
  shape?: "rounded" | "square" | "circle";
  className?: string;
};

/**
 * Zdjęcie w ramce o stałych proporcjach (zero przeskoków układu):
 * pod spodem rozmyty podgląd, a właściwe zdjęcie łagodnie się z niego wyłania.
 * Bez JavaScriptu zdjęcie jest po prostu widoczne.
 */
export function Foto({ zdjecie, ratio, sizes, priority = false, pozycja, shape = "rounded", className = "" }: FotoProps) {
  const position = pozycja ?? zdjecie.pozycja;
  return (
    <span
      className={`${styles.frame} ${styles[shape]} ${className}`}
      style={{ aspectRatio: ratio ?? `${zdjecie.w} / ${zdjecie.h}`, backgroundImage: `url(${zdjecie.blur})`, backgroundPosition: position }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- statyczny eksport: własne rozmiary w srcset */}
      <img
        ref={priority ? undefined : wylanianie}
        src={zdjecie.src}
        srcSet={zdjecie.srcset}
        sizes={sizes}
        alt={zdjecie.alt}
        width={zdjecie.w}
        height={zdjecie.h}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={styles.img}
        style={position ? { objectPosition: position } : undefined}
      />
    </span>
  );
}

/** Zdjęcie jeszcze niezaładowane: ukryj je i pokaż łagodnie po załadowaniu. */
function wylanianie(img: HTMLImageElement | null) {
  if (!img || img.complete) return;
  img.dataset.fade = "";
  const show = () => {
    img.dataset.loaded = "";
  };
  img.addEventListener("load", show, { once: true });
  img.addEventListener("error", show, { once: true });
}
