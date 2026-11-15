import { useId } from "react";
import styles from "./BeadDivider.module.css";

/** Separator jak w logo: cienki miedziany drut z perłą i miedzianymi kapturkami. */
export function BeadDivider({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg
      className={`${styles.divider} ${className}`}
      style={{ "--delay": `${delay}s` } as React.CSSProperties}
      viewBox="0 0 240 28"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`bd-pearl-${id}`} cx="38%" cy="34%" r="70%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".45" stopColor="#f6ece4" />
          <stop offset=".8" stopColor="#e2cbbb" />
          <stop offset="1" stopColor="#c9a993" />
        </radialGradient>
        <radialGradient id={`bd-copper-${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#f6c78e" />
          <stop offset=".45" stopColor="#c27a3a" />
          <stop offset="1" stopColor="#7a3f17" />
        </radialGradient>
        <linearGradient id={`bd-wire-l-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#b56a2c" stopOpacity="0" />
          <stop offset="1" stopColor="#b56a2c" />
        </linearGradient>
        <linearGradient id={`bd-wire-r-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#b56a2c" />
          <stop offset="1" stopColor="#b56a2c" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className={`${styles.wire} ${styles.left}`} d="M4 18 Q60 10 104 14" stroke={`url(#bd-wire-l-${id})`} />
      <path className={`${styles.wire} ${styles.right}`} d="M136 14 Q180 10 236 18" stroke={`url(#bd-wire-r-${id})`} />
      <g className={styles.beads}>
        <circle cx="103" cy="14" r="3.4" fill={`url(#bd-copper-${id})`} />
        <circle cx="109" cy="14" r="2.4" fill={`url(#bd-copper-${id})`} />
        <circle cx="137" cy="14" r="3.4" fill={`url(#bd-copper-${id})`} />
        <circle cx="131" cy="14" r="2.4" fill={`url(#bd-copper-${id})`} />
        <circle cx="120" cy="14" r="9" fill={`url(#bd-pearl-${id})`} />
        <ellipse cx="116.6" cy="10.6" rx="2.6" ry="1.9" fill="#fff" opacity=".85" />
      </g>
    </svg>
  );
}
