import Image from "next/image";
import { CameraIcon } from "@/components/icons";
import styles from "./PhotoSlot.module.css";

type PhotoSlotProps = {
  /** Opis zdjęcia, które ma się tu znaleźć, np. „naszyjnik na modelce”. */
  label: string;
  /** Proporcje, np. "4/5", "1/1", "16/9". Pomijane, gdy `fill`. */
  ratio?: string;
  /** Kształt pola. */
  shape?: "rounded" | "circle" | "square";
  /** Pole wypełnia cały element nadrzędny (np. tło karty hero). */
  fill?: boolean;
  /**
   * Ścieżka do prawdziwego zdjęcia, np. "/zdjecia/poziomka.webp" (plik w folderze public).
   * Gdy jest podana, zamiast pustego pola pokazuje się zdjęcie.
   */
  src?: string;
  /** Tekst alternatywny zdjęcia (gdy brak - używany jest `label`). */
  alt?: string;
  /** Ładowanie z priorytetem (zdjęcia widoczne od razu po wejściu). */
  priority?: boolean;
  /** Atrybut sizes dla obrazu. */
  sizes?: string;
  /** Mniejszy podpis (małe pola, np. okrągłe miniatury). */
  compact?: boolean;
  className?: string;
};

/**
 * Pole na zdjęcie. Dopóki nie ma `src`, wyświetla się pusty, jaśniejszy prostokąt
 * z przerywaną miedzianą ramką, ikoną aparatu i podpisem „Zdjęcie: …, 4:5”.
 * Aby podmienić na zdjęcie: wrzuć plik do /public i podaj jego ścieżkę w `src`.
 */
export function PhotoSlot({
  label,
  ratio = "4/5",
  shape = "rounded",
  fill = false,
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  compact = false,
  className = "",
}: PhotoSlotProps) {
  const classes = [styles.slot, styles[shape], fill ? styles.fill : "", src ? styles.hasImage : "", compact ? styles.compact : "", className]
    .filter(Boolean)
    .join(" ");
  const style = fill ? undefined : { aspectRatio: shape === "circle" || shape === "square" ? "1 / 1" : ratio.replace("/", " / ") };
  const ratioLabel = shape === "circle" || shape === "square" ? "1:1" : ratio.replace("/", ":");

  if (src) {
    return (
      <div className={classes} style={style}>
        <Image src={src} alt={alt ?? label} fill priority={priority} fetchPriority={priority ? "high" : undefined} sizes={sizes} className={styles.image} />
      </div>
    );
  }

  return (
    <div className={classes} style={style} role="img" aria-label={`Miejsce na zdjęcie: ${label}`}>
      <div className={styles.placeholder} aria-hidden="true">
        <CameraIcon className={styles.icon} />
        <span className={styles.caption}>
          Zdjęcie: {label}
          {fill ? "" : `, ${ratioLabel}`}
        </span>
      </div>
    </div>
  );
}
