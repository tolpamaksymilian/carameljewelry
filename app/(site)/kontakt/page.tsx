import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon, FacebookIcon, InstagramIcon } from "@/components/icons";
import { JsonLd } from "@/components/site/JsonLd";
import { BeadCorners, BeadRow, SectionDivider, SparkleField } from "@/components/site/Ornaments";
import ui from "@/components/site/ui.module.css";
import { siteConfig } from "@/config/site";
import { FAQ } from "@/lib/faq";
import { faqLd, meta, okruszkiLd } from "@/lib/seo";
import styles from "./kontakt.module.css";

export const metadata: Metadata = meta({
  title: "Napisz do mnie - kontakt | Caramel Jewelry",
  description:
    "Napisz do mnie na Instagramie lub Facebooku - zapytaj o dostępność prac, biżuterię na zamówienie albo dobór kamienia. Odpowiedzi na częste pytania.",
  path: "/kontakt",
});

const CHANNELS = [
  {
    id: "instagram",
    label: "Instagram",
    handle: siteConfig.social.instagramHandle,
    href: siteConfig.social.instagram,
    icon: <InstagramIcon />,
    text: "Tu pokazuję nowe prace i kulisy mojej pracowni. Napisz do mnie w wiadomości prywatnej.",
    cta: "Napisz na Instagramie",
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: siteConfig.social.facebookName,
    href: siteConfig.social.facebook,
    icon: <FacebookIcon />,
    text: "Wolisz Messengera? Napisz do mnie na Facebooku.",
    cta: "Napisz na Facebooku",
  },
];

const TOPICS = [
  { label: "Dostępność prac", href: `${siteConfig.homeHref}#prace` },
  { label: "Biżuteria na zamówienie", href: null },
  { label: "Dobór kamienia", href: "/moc-kamieni" },
];

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <p className={`${ui.eyebrow} reveal`} style={{ "--delay": "0.05s" } as React.CSSProperties}>
          Kontakt
        </p>
        <h1 className={`${ui.title} ${styles.title} reveal`} style={{ "--delay": "0.15s" } as React.CSSProperties}>
          Napisz do <span className={styles.pillWord}>mnie</span>
        </h1>
        <BeadRow className={`${styles.beads} reveal`} />
        <p className={`${ui.text} ${styles.lead} reveal`} style={{ "--delay": "0.3s" } as React.CSSProperties}>
          Najłatwiej złapiesz mnie na Instagramie lub Facebooku. Napisz wiadomość, a&nbsp;razem znajdziemy biżuterię, która
          będzie naprawdę Twoja.
        </p>
      </header>

      <ul className={styles.channels}>
        {CHANNELS.map((c, i) => (
          <li key={c.id} className="reveal" style={{ "--delay": `${0.4 + i * 0.12}s` } as React.CSSProperties}>
            <a href={c.href} target="_blank" rel="noopener noreferrer" className={`${ui.card} ${styles.channel}`}>
              <BeadCorners corners={i === 0 ? ["tl"] : ["tr"]} />
              <span className={`${ui.copperIcon} ${styles.icon}`}>{c.icon}</span>
              <span className={styles.label}>{c.label}</span>
              <span className={styles.handle}>{c.handle}</span>
              <span className={styles.text}>{c.text}</span>
              <span className={`${ui.pill} ${styles.cta}`}>
                {c.cta}
                <ArrowUpRightIcon />
              </span>
              <span className="visually-hidden"> (otwiera się w nowej karcie)</span>
            </a>
          </li>
        ))}
      </ul>

      <section className={`${ui.card} ${styles.topics}`} aria-labelledby="o-co-zapytac" data-reveal>
        <SparkleField items={[{ left: "94%", top: "30%", size: 13, d: 1.1 }]} />
        <h2 id="o-co-zapytac" className={styles.topicsTitle}>
          W&nbsp;wiadomości możesz zapytać <em>na przykład o:</em>
        </h2>
        <ul className={styles.topicList}>
          {TOPICS.map((t) => (
            <li key={t.label}>
              {t.href ? (
                <Link href={t.href} className={styles.topic}>
                  {t.label}
                </Link>
              ) : (
                <span className={styles.topic}>{t.label}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <SectionDivider />

      <section className={styles.faq} aria-labelledby="faq-title">
        <div className={styles.faqHead} data-reveal>
          <p className={ui.eyebrow}>Zanim napiszesz</p>
          <h2 id="faq-title" className={ui.title}>
            Częste <em>pytania</em>
          </h2>
        </div>
        <div className={styles.faqList} data-reveal>
          {FAQ.map((q) => (
            <details key={q.pytanie} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                <span>{q.pytanie}</span>
                <span className={styles.faqIcon} aria-hidden="true" />
              </summary>
              <p className={styles.faqAnswer}>{q.odpowiedz}</p>
            </details>
          ))}
        </div>
      </section>

      <JsonLd
        data={[
          okruszkiLd([
            ["Start", "/"],
            ["Napisz do mnie", "/kontakt"],
          ]),
          faqLd(FAQ),
        ]}
      />
    </div>
  );
}
