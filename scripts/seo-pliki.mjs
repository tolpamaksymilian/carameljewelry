/**
 * Pliki dla wyszukiwarek i asystentów AI: sitemap.xml, robots.txt i llms.txt.
 * Uruchamia się samo po `npm run build` (skrypt „postbuild”).
 *
 * Steruje tym flaga SITE_PUBLIC w lib/site.ts:
 *   - false: nic nie powstaje (strona nie jest jeszcze publiczna, folder out/ zostaje jak był);
 *   - true:  w out/ powstają sitemap.xml, robots.txt i llms.txt.
 *
 * Treść llms.txt składam z danych strukturalnych wygenerowanych stron (JSON-LD),
 * więc zawsze zgadza się z tym, co jest na stronie.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const site = fs.readFileSync(path.join(ROOT, "lib", "site.ts"), "utf8");

const PUBLIC = /export const SITE_PUBLIC\s*=\s*true\b/.test(site);
const URL_BASE = site.match(/export const SITE_URL\s*=\s*"([^"]+)"/)?.[1];
const NAME = site.match(/export const SITE_NAME\s*=\s*"([^"]+)"/)?.[1] ?? "Caramel Jewelry";

const PLIKI = ["sitemap.xml", "robots.txt", "llms.txt"];

if (!fs.existsSync(OUT)) {
  console.log("seo-pliki: brak folderu out/ - najpierw `npm run build`.");
  process.exit(0);
}

if (!PUBLIC) {
  // przed startem nie zostawiam żadnego z tych plików (także po wcześniejszym, próbnym buildzie)
  for (const f of PLIKI) fs.rmSync(path.join(OUT, f), { force: true });
  console.log("seo-pliki: SITE_PUBLIC = false - bez sitemap.xml, robots.txt i llms.txt (strona nie jest indeksowana).");
  process.exit(0);
}

if (!URL_BASE) throw new Error("seo-pliki: nie znalazłem SITE_URL w lib/site.ts");

/** Strony, których nie zgłaszam wyszukiwarkom. */
const POMIN = new Set(["/404", "/_not-found", "/podglad"]);

function strony(dir = OUT, prefix = "") {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith("_") || e.name === "zdjecia" || e.name === "brand" || e.name === "og" || e.name === "ikony") continue;
    if (e.isDirectory()) out.push(...strony(path.join(dir, e.name), `${prefix}/${e.name}`));
    else if (e.name.endsWith(".html")) {
      const p = e.name === "index.html" ? prefix || "/" : `${prefix}/${e.name.slice(0, -5)}`;
      if (!POMIN.has(p)) out.push({ path: p, file: path.join(dir, e.name) });
    }
  }
  return out;
}

const lista = strony().sort((a, b) => a.path.localeCompare(b.path, "pl"));
const adres = (p) => `${URL_BASE}${p === "/" ? "/" : p}`;
const xml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// strony z noindex nie trafiają do mapy
const indeksowane = lista.filter(({ file }) => !/<meta name="robots" content="noindex/.test(fs.readFileSync(file, "utf8")));

// ---------- sitemap.xml ----------
const dzis = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    indeksowane.map(({ path: p }) => `  <url><loc>${xml(adres(p))}</loc><lastmod>${dzis}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`,
);

// ---------- robots.txt ----------
fs.writeFileSync(
  path.join(OUT, "robots.txt"),
  ["User-agent: *", "Allow: /", "Disallow: /_archiwum/", "Disallow: /podglad", "", `Sitemap: ${URL_BASE}/sitemap.xml`, ""].join("\n"),
);

// ---------- llms.txt ----------
function jsonLd(p) {
  const hit = lista.find((s) => s.path === p);
  if (!hit) return [];
  const html = fs.readFileSync(hit.file, "utf8");
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
}
const typ = (items, t) => items.find((i) => (Array.isArray(i["@type"]) ? i["@type"].includes(t) : i["@type"] === t));

const glowna = jsonLd("/");
const org = typ(glowna, "Organization");
const prace = typ(jsonLd("/pracownia"), "ItemList");
const kamienie = typ(jsonLd("/moc-kamieni"), "CollectionPage");
const faq = typ(jsonLd("/kontakt"), "FAQPage");

const linie = [`# ${NAME}`, ""];
if (org?.description) linie.push(`> ${org.description}`, "");
linie.push(
  "Strona jest po polsku. Teksty są pisane w pierwszej osobie.",
  "Na stronie nie ma cen, sklepu ani koszyka - o dostępność prac i zamówienia trzeba zapytać w wiadomości prywatnej.",
  "",
  "## Strony",
  "",
  `- [Strona główna](${adres("/")}): wybrane prace, moc kamieni, zdjęcia z Instagrama`,
  `- [Moja pracownia](${adres("/pracownia")}): galeria wszystkich prac ze zdjęciami i opisami`,
  `- [Moc kamieni](${adres("/moc-kamieni")}): znaczenie kamieni i znaki zodiaku`,
  `- [Napisz do mnie](${adres("/kontakt")}): kontakt i częste pytania`,
  "",
);
if (org?.sameAs?.length) {
  linie.push("## Kontakt", "", ...org.sameAs.map((u) => `- ${u.includes("instagram") ? "Instagram" : "Facebook"}: ${u}`), "");
}
if (prace?.itemListElement?.length) {
  linie.push("## Prace", "");
  for (const { item } of prace.itemListElement) linie.push(`- [${item.name}](${item.url}) (${item.category.toLowerCase()}): ${item.description}`);
  linie.push("");
}
if (kamienie?.mainEntity?.itemListElement?.length) {
  linie.push("## Kamienie opisane na stronie", "");
  for (const k of kamienie.mainEntity.itemListElement) linie.push(`- [${k.name}](${k.url})`);
  linie.push("");
}
if (faq?.mainEntity?.length) {
  linie.push("## Częste pytania", "");
  for (const q of faq.mainEntity) linie.push(`### ${q.name}`, "", q.acceptedAnswer.text, "");
}
fs.writeFileSync(path.join(OUT, "llms.txt"), linie.join("\n"));

console.log(`seo-pliki: zapisano sitemap.xml (${indeksowane.length} adresów), robots.txt i llms.txt.`);
