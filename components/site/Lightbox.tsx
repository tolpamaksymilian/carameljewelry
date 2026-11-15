"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/icons";
import type { Zdjecie } from "@/lib/prace-typy";
import ui from "./ui.module.css";
import styles from "./Lightbox.module.css";

type LightboxProps = {
  /** Tytuł galerii (nazwa pracy). */
  title: string;
  subtitle?: string;
  images: Zdjecie[];
  /** Indeks otwartego zdjęcia; null = zamknięty. */
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
};

/**
 * Lekki podgląd zdjęć na pełnym ekranie: strzałki, przesunięcie palcem,
 * klawisze ← → i Esc, miniatury pod spodem. Fokus wraca do przycisku, który otworzył galerię.
 */
export function Lightbox({ title, subtitle, images, index, onChange, onClose }: LightboxProps) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const touchX = useRef<number | null>(null);
  const count = images.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null || count < 2) return;
      onChange((index + dir + count) % count);
    },
    [index, count, onChange],
  );

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      html.style.overflow = prevOverflow;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        // fokus zostaje w oknie
        const items = dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])");
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  if (!open || typeof document === "undefined") return null;
  const img = images[index];

  return createPortal(
    <div
      ref={dialogRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} - galeria zdjęć`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className={styles.bar}>
        <div className={styles.heading}>
          <p className={styles.title}>{title}</p>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {count > 1 && (
          <span className={styles.count} aria-live="polite">
            {index + 1} / {count}
          </span>
        )}
        <button ref={closeRef} type="button" className={`${ui.round} ${styles.btn}`} onClick={onClose} aria-label="Zamknij galerię">
          <CloseIcon />
        </button>
      </div>

      <figure className={styles.stage} onClick={(e) => e.target === e.currentTarget && onClose()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={img.src}
          src={img.src}
          srcSet={img.srcset}
          sizes={`min(100vw, calc((100vh - 190px) * ${(img.w / img.h).toFixed(3)}))`}
          alt={img.alt}
          width={img.w}
          height={img.h}
          className={styles.image}
          style={{ backgroundImage: `url(${img.blur})` }}
          decoding="async"
        />
      </figure>

      {count > 1 && (
        <>
          <button type="button" className={`${ui.round} ${styles.btn} ${styles.prev}`} onClick={() => go(-1)} aria-label="Poprzednie zdjęcie">
            <ArrowLeftIcon />
          </button>
          <button type="button" className={`${ui.round} ${styles.btn} ${styles.next}`} onClick={() => go(1)} aria-label="Następne zdjęcie">
            <ArrowRightIcon />
          </button>
          <ul className={styles.thumbs} aria-label="Wszystkie zdjęcia">
            {images.map((t, i) => (
              <li key={t.src}>
                <button
                  type="button"
                  className={styles.thumb}
                  aria-current={i === index ? "true" : undefined}
                  aria-label={`Zdjęcie ${i + 1} z ${count}`}
                  onClick={() => onChange(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.srcset.split(" ")[0]} alt="" width={54} height={54} loading="lazy" decoding="async" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>,
    document.body,
  );
}
