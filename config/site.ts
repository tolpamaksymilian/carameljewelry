/**
 * Centralna konfiguracja serwisu Caramel Handmade Jewelry.
 * Tutaj zmieniasz metadane SEO i włączasz indeksowanie po starcie pełnej strony.
 */
import { HOME_HREF, SITE_PUBLIC } from "@/lib/site";

export const siteConfig = {
  name: "Caramel Handmade Jewelry",
  shortName: "Caramel",
  // do startu: teksty zapowiedzi („/”); po starcie (SITE_PUBLIC = true): domyślne teksty pełnej strony, np. dla 404
  title: SITE_PUBLIC ? "Caramel Jewelry - ręcznie robiona biżuteria z koralików" : "Caramel Handmade Jewelry | Wkrótce",
  description: SITE_PUBLIC
    ? "Ręcznie robiona biżuteria z koralików i kamieni naturalnych: naszyjniki, bransoletki i zestawy. Każdy koralik nawlekam ręcznie."
    : "Caramel Handmade Jewelry – wyjątkowa biżuteria handmade. Nasza strona internetowa już wkrótce.",
  locale: "pl_PL",
  lang: "pl",

  /**
   * Indeksowanie przez wyszukiwarki.
   * `false` = strona tymczasowa („noindex, nofollow”).
   * Steruje tym jedna flaga: SITE_PUBLIC w lib/site.ts.
   */
  allowIndexing: SITE_PUBLIC,

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
    instagramHandle: "@cara.mel.jewelry",
    facebookName: "Caramel Jewelry",
  },

  /** Domena wyświetlana w stopce. */
  domain: "carameljewelry.pl",

  /**
   * Adres strony głównej w menu. Na czas podglądu nowa strona główna
   * działa pod /podglad; po starcie (SITE_PUBLIC = true w lib/site.ts) jest to "/".
   */
  homeHref: HOME_HREF,
} as const;

/** Menu serwisu (nagłówek i stopka). */
export const navItems = [
  { label: "Start", href: siteConfig.homeHref },
  { label: "Moja pracownia", href: "/pracownia" },
  { label: "Moc kamieni", href: "/moc-kamieni" },
  { label: "Napisz do mnie", href: "/kontakt" },
] as const;
