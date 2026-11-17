/**
 * Ustawienia strony i dane do SEO.
 *
 * SITE_PUBLIC = true (strona publiczna od 2026-11-17):
 *   - strony mają meta robots „index, follow” (panel /admin zawsze „noindex”);
 *   - po `npm run build` powstają out/sitemap.xml, out/robots.txt i out/llms.txt (scripts/seo-pliki.mjs).
 * `false` ukrywa stronę przed wyszukiwarkami (noindex, bez mapy strony).
 */
export const SITE_PUBLIC = true;

/** Docelowy adres strony (canonical, Open Graph, dane strukturalne). */
export const SITE_URL = "https://carameljewelry.pl";

/** Nazwa marki w tytułach i danych strukturalnych. */
export const SITE_NAME = "Caramel Jewelry";

/**
 * Sekcja „Jak pracuję” i zdjęcia pracowni na /pracownia.
 * `false` = na stronie zostaje sama biżuteria (galeria prac).
 */
export const POKAZ_PRACOWNIE = true;

/** Adres strony głównej. */
export const HOME_HREF = "/";

/** Obraz Open Graph (1200x630). */
export const OG_IMAGE = { url: `${SITE_URL}/og/caramel-jewelry-og.jpg`, width: 1200, height: 630, alt: "Caramel Jewelry - ręcznie robiona biżuteria z koralików" };

/**
 * Dane lokalne (GEO). W projekcie nie ma ich jeszcze - nie zgaduję.
 * TODO: uzupełnij, gdy będą znane; wtedy trafią do danych strukturalnych i llms.txt.
 */
export const GEO: { miasto: string | null; region: string | null; kraj: string; obszarDostaw: string | null; wysylka: string | null } = {
  miasto: null, // TODO: miasto pracowni
  region: null, // TODO: województwo
  kraj: "PL",
  obszarDostaw: null, // TODO: np. „cała Polska”
  wysylka: null, // TODO: sposób wysyłki / odbioru
};

/** Pełny adres docelowy podstrony, np. adres("/kontakt"). Strona główna: adres("/"). */
export const adres = (sciezka: string) => `${SITE_URL}${sciezka === "/" ? "/" : sciezka}`;

/** Krótki, rzeczowy opis marki - ten sam na stronie, w danych strukturalnych i llms.txt. */
export const O_MNIE =
  "Caramel Jewelry to ręcznie robiona biżuteria z koralików i kamieni naturalnych. Nawlekam naszyjniki, bransoletki i zestawy, a na zamówienie projektuję biżuterię specjalnie dla Ciebie.";
