/**
 * SEO: metadane podstron i dane strukturalne JSON-LD (schema.org).
 * Wszystkie adresy są docelowe (https://carameljewelry.pl/...), także w czasie podglądu.
 * Nie podaję cen, ofert, opinii ani danych adresowych, których nie ma w projekcie.
 */
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Praca } from "./prace-typy";
import { etykietaTypu } from "./prace-typy";
import { adres, GEO, OG_IMAGE, SITE_NAME, SITE_URL } from "./site";
import { czysty } from "./teksty";
import type { Stone } from "./stones";

const bez = (tekst: string) => tekst.replace(/ /g, " ");
const pelny = (sciezka: string) => (sciezka.startsWith("http") ? sciezka : `${SITE_URL}${sciezka}`);

type MetaWejscie = {
  /** Pełny tytuł (do ok. 60 znaków) - bez szablonu. */
  title: string;
  /** Opis (do ok. 155 znaków). */
  description: string;
  /** Docelowa ścieżka strony, np. "/kontakt"; strona główna: "/". */
  path: string;
  /** Własny obraz do udostępniania (domyślnie wspólny obraz OG). */
  image?: { url: string; width: number; height: number; alt: string };
  type?: "website" | "article";
};

/** Komplet metadanych podstrony: title, description, canonical, Open Graph, Twitter Card. */
export function meta({ title, description, path, image = OG_IMAGE, type = "website" }: MetaWejscie): Metadata {
  const url = adres(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type, locale: "pl_PL", siteName: SITE_NAME, url, title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

const ORG_ID = `${SITE_URL}/#organizacja`;
const WEB_ID = `${SITE_URL}/#witryna`;

/** Organization + Brand: nazwa, logo, profile społecznościowe. */
export function organizacjaLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Brand"],
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: "Caramel Handmade Jewelry",
    url: `${SITE_URL}/`,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/caramel-logo.webp`, width: 1626, height: 814 },
    image: OG_IMAGE.url,
    description: czysty("wspolne.o_mnie"),
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook],
    // dane lokalne pojawią się po uzupełnieniu GEO w lib/site.ts
    ...(GEO.miasto
      ? { address: { "@type": "PostalAddress", addressLocality: GEO.miasto, ...(GEO.region ? { addressRegion: GEO.region } : {}), addressCountry: GEO.kraj } }
      : {}),
    ...(GEO.obszarDostaw ? { areaServed: GEO.obszarDostaw } : {}),
  };
}

export function witrynaLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEB_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: "pl-PL",
    description: czysty("wspolne.o_mnie"),
    publisher: { "@id": ORG_ID },
  };
}

/** Okruszki: [["Start", "/"], ["Moc kamieni", "/moc-kamieni"], ...]. */
export function okruszkiLd(sciezka: [nazwa: string, path: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: sciezka.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: adres(path) })),
  };
}

/** Lista prac: ItemList z produktami - nazwa, opis, zdjęcia. Bez ceny i bez ofert. */
export function listaPracLd(prace: Praca[], opcje: { nazwa: string; path: string; kotwice?: boolean }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opcje.nazwa,
    url: adres(opcje.path),
    numberOfItems: prace.length,
    itemListElement: prace.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        "@id": `${SITE_URL}/pracownia#${p.slug}`,
        name: bez(p.nazwa),
        description: bez(p.opis),
        category: etykietaTypu(p),
        url: `${SITE_URL}/pracownia#${p.slug}`,
        image: p.zdjecia.map((z) => pelny(z.srcset.split(", ").pop()!.split(" ")[0])),
        brand: { "@id": ORG_ID },
      },
    })),
  };
}

/** FAQPage - tylko pytania, na które odpowiedź jest w projekcie. */
export function faqLd(pytania: { pytanie: string; odpowiedz: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pytania.map((q) => ({
      "@type": "Question",
      name: bez(q.pytanie),
      acceptedAnswer: { "@type": "Answer", text: bez(q.odpowiedz) },
    })),
  };
}

/** /moc-kamieni: CollectionPage z listą kamieni (tylko istniejące treści). */
export function kolekcjaKamieniLd(kamienie: Stone[], opis: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/moc-kamieni#strona`,
    name: "Moc kamieni",
    description: opis,
    url: adres("/moc-kamieni"),
    inLanguage: "pl-PL",
    isPartOf: { "@id": WEB_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: kamienie.length,
      itemListElement: kamienie.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: adres(`/moc-kamieni/${s.slug}`) })),
    },
  };
}

/** /moc-kamieni/[slug]: Article z karty kamienia. */
export function artykulKamieniaLd(s: Stone) {
  const url = adres(`/moc-kamieni/${s.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#artykul`,
    headline: `${s.name} - znaczenie kamienia`,
    description: [s.symbolism, s.intention].filter(Boolean).join(" "),
    articleBody: [
      s.description,
      `Symbolika: ${s.symbolism}`,
      s.intention && `Intencja: ${s.intention}`,
      `Znaki zodiaku: ${s.zodiac.join(", ")}.`,
      s.element && `Żywioł: ${s.element}.`,
      s.planet && `Planeta: ${s.planet}.`,
      s.chakra && `Czakra: ${s.chakra}.`,
      s.numerology && `Numerologia: ${s.numerology.n} - ${s.numerology.text}.`,
      `Ciekawostka: ${s.fact}`,
      `Pielęgnacja: ${s.care}`,
    ]
      .filter(Boolean)
      .join(" "),
    keywords: s.keywords,
    image: pelny(s.image),
    url,
    mainEntityOfPage: url,
    inLanguage: "pl-PL",
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": `${SITE_URL}/moc-kamieni#strona` },
  };
}
