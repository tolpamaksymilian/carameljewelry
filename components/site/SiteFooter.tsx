import Link from "next/link";
import { BeadDivider } from "@/components/BeadDivider";
import { SiteLogo } from "./SiteLogo";
import { FacebookIcon, GlobeIcon, InstagramIcon } from "@/components/icons";
import { navItems, siteConfig } from "@/config/site";
import { O_MNIE } from "@/lib/site";
import { nbsp } from "@/lib/typografia";
import { BeadCorners } from "./Ornaments";
import ui from "./ui.module.css";
import styles from "./SiteFooter.module.css";

const CONTACT = [
  {
    href: siteConfig.social.instagram,
    label: "Instagram",
    value: siteConfig.social.instagramHandle,
    icon: <InstagramIcon />,
    external: true,
  },
  {
    href: siteConfig.social.facebook,
    label: "Facebook",
    value: siteConfig.social.facebookName,
    icon: <FacebookIcon />,
    external: true,
  },
  {
    href: siteConfig.homeHref,
    label: "Strona",
    value: siteConfig.domain,
    icon: <GlobeIcon />,
    external: false,
  },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.divider}>
        <BeadDivider className={styles.dividerSvg} />
      </div>

      <div className={styles.inner}>
        <BeadCorners corners={["tl", "tr", "bl", "br"]} />

        <div className={styles.brand}>
          <Link href={siteConfig.homeHref} aria-label="Caramel Handmade Jewelry - strona główna" className={styles.logoLink}>
            <SiteLogo size="footer" />
          </Link>
          {/* krótko i rzeczowo: kim jestem i co robię (ten sam opis trafia do danych strukturalnych) */}
          <p className={styles.about}>{nbsp(O_MNIE)}</p>
        </div>

        <nav className={styles.col} aria-label="Menu w stopce">
          <h2 className={ui.eyebrow}>Menu</h2>
          <ul className={styles.list}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={ui.eyebrow}>Znajdziesz mnie tutaj</h2>
          <ul className={styles.list}>
            {CONTACT.map((c) => {
              const content = (
                <>
                  <span className={ui.copperIcon}>{c.icon}</span>
                  <span className={styles.contactText}>
                    <span className={styles.contactLabel}>{c.label}</span>
                    <span className={styles.contactValue}>{c.value}</span>
                  </span>
                </>
              );
              return (
                <li key={c.label}>
                  {c.external ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className={styles.contact}>
                      {content}
                      <span className="visually-hidden"> (otwiera się w nowej karcie)</span>
                    </a>
                  ) : (
                    <Link href={c.href} className={styles.contact}>
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <p className={styles.copy}>
          <span>© Caramel Jewelry</span>
          <span className={styles.copyDot} aria-hidden="true" />
          <span>Ręcznie robione z&nbsp;myślą o&nbsp;Tobie</span>
        </p>
      </div>
    </footer>
  );
}
