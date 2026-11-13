/**
 * Centralna konfiguracja serwisu Caramel Handmade Jewelry.
 * Tutaj zmieniasz metadane SEO i włączasz indeksowanie po starcie pełnej strony.
 */
export const siteConfig = {
  name: "Caramel Handmade Jewelry",
  shortName: "Caramel",
  title: "Caramel Handmade Jewelry | Wkrótce",
  description:
    "Caramel Handmade Jewelry – wyjątkowa biżuteria handmade. Nasza strona internetowa już wkrótce.",
  locale: "pl_PL",
  lang: "pl",

  /**
   * Indeksowanie przez wyszukiwarki.
   * `false` = strona tymczasowa („noindex, nofollow”).
   * Po uruchomieniu pełnej strony zmień na `true`.
   */
  allowIndexing: false,

  /**
   * Publiczny adres strony (np. https://twojadomena.pl) — opcjonalny.
   * Ustaw zmienną NEXT_PUBLIC_SITE_URL w Netlify, gdy domena będzie podłączona.
   * Strona działa poprawnie także bez niej (wszystkie linki są względne).
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || undefined,

  /** Profile w mediach społecznościowych. */
  social: {
    instagram: "https://www.instagram.com/cara.mel.jewelry/",
    facebook: "https://www.facebook.com/profile.php?id=61595912694326",
  },
} as const;
