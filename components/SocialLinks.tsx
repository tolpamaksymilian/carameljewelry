import { siteConfig } from "@/config/site";
import styles from "./SocialLinks.module.css";

const LINKS = [
  {
    href: siteConfig.social.instagram,
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5.2" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.3" cy="6.7" r="0.9" className={styles.dot} />
      </svg>
    ),
  },
  {
    href: siteConfig.social.facebook,
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M13.6 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21" />
      </svg>
    ),
  },
].filter((l) => l.href);

/** Linki do profili Caramel — otwierane w nowej karcie. */
export function SocialLinks({ delay = 0 }: { delay?: number }) {
  if (LINKS.length === 0) return null;
  return (
    <ul className={`${styles.list} reveal`} style={{ "--delay": `${delay}s` } as React.CSSProperties} aria-label="Caramel w mediach społecznościowych">
      {LINKS.map((l) => (
        <li key={l.label}>
          <a className={styles.link} href={l.href} target="_blank" rel="noopener noreferrer">
            <span className={styles.icon}>{l.icon}</span>
            <span className={styles.label}>{l.label}</span>
            <span className="visually-hidden"> (otwiera się w nowej karcie)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
