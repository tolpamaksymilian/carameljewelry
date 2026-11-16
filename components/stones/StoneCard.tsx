import Link from "next/link";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import { firstSentence, nbsp, stoneHref, type Stone } from "@/lib/stones";
import styles from "./StoneCard.module.css";

/** Mała karta kamienia (lista /moc-kamieni i „Inne kamienie z tej grupy”) - cała karta jest linkiem. */
export function StoneCard({
  stone,
  sizes = "(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 25vw",
  highlight,
}: {
  stone: Stone;
  sizes?: string;
  /** Znak zodiaku do wyróżnienia na liście znaków. */
  highlight?: string;
}) {
  return (
    <Link href={stoneHref(stone.slug)} className={styles.card} style={{ "--accent": stone.accent } as React.CSSProperties}>
      <PhotoSlot label={stone.name} shape="square" src={stone.image} alt={`${stone.name} - ilustracja kamienia`} sizes={sizes} className={styles.photo} />
      <span className={styles.body}>
        <span className={styles.name}>{stone.name}</span>
        <span className={styles.keywords}>{nbsp(stone.keywords)}</span>
        <span className={styles.teaser}>{nbsp(firstSentence(stone.description ?? stone.intention ?? stone.symbolism))}</span>
        <span className={styles.sign}>
          <span className="visually-hidden">Znaki zodiaku: </span>
          {stone.zodiac.map((z, i) => (
            <span key={z}>
              {i > 0 && <span aria-hidden="true"> · </span>}
              {z === highlight ? <strong className={styles.signOn}>{z}</strong> : z}
            </span>
          ))}
        </span>
      </span>
    </Link>
  );
}
