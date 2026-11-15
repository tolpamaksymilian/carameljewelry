import { siteConfig } from "@/config/site";
import { FacebookIcon, InstagramIcon } from "./icons";
import styles from "./SocialLinks.module.css";

const LINKS = [
  { href: siteConfig.social.instagram, label: "Instagram", icon: <InstagramIcon /> },
  { href: siteConfig.social.facebook, label: "Facebook", icon: <FacebookIcon /> },
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
