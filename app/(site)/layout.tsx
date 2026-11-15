import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/site/JsonLd";
import { RevealOnScroll } from "@/components/site/RevealOnScroll";
import { SiteEnhancements } from "@/components/site/SiteEnhancements";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { organizacjaLd, witrynaLd } from "@/lib/seo";
import { OG_IMAGE, SITE_NAME, SITE_PUBLIC, SITE_URL } from "@/lib/site";
import "./site.css";
import styles from "./site.module.css";

/**
 * Wspólne metadane pełnej strony. Indeksowanie włącza jedna flaga: SITE_PUBLIC w lib/site.ts.
 * Tytuły, opisy i adresy kanoniczne ustawia każda podstrona (lib/seo.ts → meta()).
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  robots: SITE_PUBLIC
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { type: "website", locale: "pl_PL", siteName: SITE_NAME, images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F6ECE0",
  colorScheme: "light",
};

/** Układ pełnej strony (podgląd nowej strony głównej i podstrony): nagłówek + treść + stopka. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={styles.shell} data-site>
      <a href="#tresc" className={styles.skip}>
        Przejdź do treści
      </a>
      <SiteHeader />
      <main id="tresc" className={styles.main}>
        {children}
      </main>
      <SiteFooter />
      <SiteEnhancements />
      <RevealOnScroll />
      <JsonLd data={[organizacjaLd(), witrynaLd()]} />
    </div>
  );
}
