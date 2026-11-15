/**
 * Konwersja zdjęć na WebP dla strony Caramel Jewelry.
 *
 * Uruchomienie (z folderu projektu):
 *   node scripts/zdjecia.mjs
 *   node scripts/zdjecia.mjs "D:\inny\folder\ze\zdjeciami"
 *
 * Pliki źródłowe są tylko czytane - nic w nich nie zmieniam.
 *
 * Każde zdjęcie:
 *   - obrót wg EXIF, bez metadanych, WebP q80;
 *   - 4 rozmiary do srcset: dłuższy bok 480, 800, 1200 i 1600 px
 *     (mniejsze zdjęcia kończą się na swoim własnym rozmiarze);
 *   - nazwa: public/zdjecia/<folder>/<slug>-<nr>-<dłuższy bok>.webp;
 *   - mały rozmyty podgląd (base64) do płynnego wyłaniania się zdjęcia.
 * Wymiary, warianty i podglądy trafiają do lib/zdjecia.generated.ts (nie edytuj go ręcznie).
 *
 * Dodatkowo: tła hero z IMG_8719, obraz Open Graph 1200x630 i ikony do manifestu.
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sharp = createRequire(path.join(ROOT, "package.json"))("sharp");

const SRC = process.argv[2] ?? "E:/MOJE PRACE/GRAFIKA/Firmy/O; Basia Jakim/09_MOJE_ZDJECIA";
const PUB = path.join(ROOT, "public");
const QUALITY = 80;
/** Tła hero są duże i w większości rozmyte (satyna) - nieco mocniejsza kompresja, żeby szybciej się ładowały. */
const HERO_QUALITY = 72;
const SIZES = [480, 800, 1200, 1600];

/**
 * Delikatna korekta zdjęć (jasność, nasycenie, kontrast, ostrość) - bez retuszu i bez zmiany
 * kolorów biżuterii. Ustaw na `false`, żeby zdjęcia były tylko obrócone, przeskalowane i skompresowane.
 */
const KOREKTA = true;

const LEKKO = { brightness: 1.05, saturation: 1.05, contrast: 1.05, sharpen: 0.7 };
const JASNO = { ...LEKKO, brightness: 1.14 };
const BEZ = { brightness: 1, saturation: 1, contrast: 1, sharpen: 0.5 };

const f = (file, korekta = LEKKO) => ({ file, korekta });
const seria = (numery, korekta = LEKKO) => numery.map((n) => f(`IMG_${n}.JPG`, korekta));

/** Grupy zdjęć: folder w public/zdjecia, slug i pliki w kolejności (pierwszy = okładka). */
const GROUPS = [
  {
    folder: "prace/poziomka",
    slug: "poziomka",
    files: [
      f("b8319a9c-6680-44a2-b52a-e473bb6678fc.png", BEZ),
      // wcześniejsze zdjęcie Poziomki - oryginał leży w archiwum projektu
      { abs: path.join(PUB, "_archiwum/zdjecia/prace/praca-01-poziomka.webp"), file: "praca-01-poziomka.webp", korekta: null },
    ],
  },
  {
    folder: "prace/czern-i-perla",
    slug: "czern-i-perla",
    files: [...seria([8719, 8692, 8696], JASNO), f("IMG_8706.JPG"), ...seria([8709, 8713, 8732], JASNO)],
  },
  { folder: "prace/skorpion", slug: "skorpion", files: seria([8735, 8741]) },
  { folder: "prace/kolory-natury", slug: "kolory-natury", files: seria([8747, 8750, 8753, 8757, 8766, 8769, 8773, 8786, 8791, 8796]) },
  { folder: "prace/kolorowy-polksiezyc", slug: "kolorowy-polksiezyc", files: [f("IMG_8802.JPG"), f("IMG_8805.JPG", JASNO), f("IMG_8807.JPG"), f("IMG_8814.JPG")] },
  { folder: "prace/blisko-serca", slug: "blisko-serca", files: [f("IMG_8818.JPG"), f("IMG_8820.JPG"), f("IMG_8826.JPG", JASNO)] },
  { folder: "prace/dalmatynskie-serce", slug: "dalmatynskie-serce", files: seria([8830, 8840, 8845]) },
  { folder: "prace/czarny-polksiezyc", slug: "czarny-polksiezyc", files: seria([8207, 8211, 8217]) },
  { folder: "prace/serce-i-kluczyk", slug: "serce-i-kluczyk", files: [f("IMG_8225.JPG"), f("IMG_8227.JPG"), f("IMG_8233.JPG", JASNO), f("IMG_8234.JPG")] },
  { folder: "prace/kolorowy-medalion", slug: "kolorowy-medalion", files: seria([8242, 8244, 8296, 8299]) },
  { folder: "prace/szary-medalion", slug: "szary-medalion", files: [f("IMG_8257.JPG"), f("IMG_8259.JPG", JASNO)] },
  { folder: "prace/zielono-bialy", slug: "zielono-bialy", files: seria([8270, 8273, 8301, 8302]) },
  { folder: "prace/fioletowe-bransoletki", slug: "fioletowe-bransoletki", files: seria([8279, 8280], JASNO) },
  { folder: "prace/perla-i-braz", slug: "perla-i-braz", files: seria([8294]) },
  { folder: "prace/dlugi-naszyjnik", slug: "dlugi-naszyjnik", files: [f("378d9b93-5edc-408b-b96d-22493c948d31.png", BEZ)] },
  { folder: "prace/trzy-bransoletki", slug: "trzy-bransoletki", files: [f("43e01138-fe56-4876-a88b-91632b208740.png", BEZ)] },
  { folder: "klimat", slug: "klimat", files: seria([9812, 9843]) },
  // zdjęcia pracowni - pokazywane tylko, gdy w lib/site.ts POKAZ_PRACOWNIE = true
  { folder: "pracownia", slug: "pracownia", files: seria([8506, 8526, 8530, 8534, 8537, 8541, 8853]) },
];

const enhance = (img, k) => {
  if (!KOREKTA || !k) return img;
  return img
    .modulate({ brightness: k.brightness, saturation: k.saturation })
    .linear(k.contrast, -(128 * k.contrast - 128))
    .sharpen({ sigma: k.sharpen });
};

const open = (entry) => sharp(entry.abs ?? path.join(SRC, entry.file)).rotate();
const load = (file) => sharp(path.join(SRC, file)).rotate();

async function dims(img) {
  const m = await img.metadata();
  return { w: m.autoOrient?.width ?? m.width, h: m.autoOrient?.height ?? m.height };
}

/** Rozmyty podgląd: 16 px po dłuższym boku, WebP w base64. */
async function blurOf(img) {
  const buf = await img.resize(16, 16, { fit: "inside" }).blur(1.2).webp({ quality: 45 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function run() {
  if (!fs.existsSync(SRC)) throw new Error(`Brak folderu ze zdjęciami: ${SRC}`);
  const manifest = {};
  const written = new Set();

  for (const g of GROUPS) {
    const dir = path.join(PUB, "zdjecia", g.folder);
    fs.mkdirSync(dir, { recursive: true });
    manifest[g.slug] = [];
    for (const [i, entry] of g.files.entries()) {
      const nr = String(i + 1).padStart(2, "0");
      const src = await dims(open(entry));
      const long = Math.max(src.w, src.h);
      const targets = [...new Set(SIZES.map((s) => Math.min(s, long)))];
      const warianty = [];
      for (const t of targets) {
        const name = `${g.slug}-${nr}-${t}.webp`;
        const info = await enhance(open(entry).resize(t, t, { fit: "inside", withoutEnlargement: true }), entry.korekta)
          .webp({ quality: QUALITY })
          .toFile(path.join(dir, name));
        written.add(path.join(dir, name));
        warianty.push({ dluzszy: t, w: info.width, h: info.height });
      }
      const top = warianty[warianty.length - 1];
      manifest[g.slug].push({
        zrodlo: entry.file,
        baza: `/zdjecia/${g.folder}/${g.slug}-${nr}`,
        w: top.w,
        h: top.h,
        warianty: warianty.map((v) => ({ dluzszy: v.dluzszy, w: v.w })),
        blur: await blurOf(enhance(open(entry), entry.korekta)),
      });
      process.stdout.write(".");
    }
    // usuń pliki z poprzednich uruchomień, których już nie generuję
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      if (name.endsWith(".webp") && name.startsWith(`${g.slug}-`) && !written.has(p)) fs.unlinkSync(p);
    }
  }

  const heroBlur = await hero();
  await og();
  await ikony();
  await logo();

  const ts =
    "/* Plik generowany przez scripts/zdjecia.mjs - nie edytuj ręcznie. */\n\n" +
    "export type ZdjecieGen = {\n  zrodlo: string;\n  /** Ścieżka bez końcówki: `${baza}-${dluzszy}.webp`. */\n  baza: string;\n  w: number;\n  h: number;\n  warianty: { dluzszy: number; w: number }[];\n  blur: string;\n};\n\n" +
    `export const ZDJECIA: Record<string, ZdjecieGen[]> = ${JSON.stringify(manifest, null, 2)};\n\n` +
    `/** Rozmyte podglądy slajdów hero: [poziomy, pionowy na telefon]. */\nexport const HERO_BLUR: Record<string, { wide: string; mobile: string }> = ${JSON.stringify(heroBlur, null, 2)};\n`;
  fs.writeFileSync(path.join(ROOT, "lib", "zdjecia.generated.ts"), ts);
  console.log("\nGotowe.");
}

/**
 * Hero z IMG_8719 (pionowe zdjęcie). Na komputer składam poziomy kadr 16:10:
 * zdjęcie po prawej, a po lewej - pod tekstem - rozmyta satyna z krawędzi tego samego zdjęcia,
 * płynnie przechodząca w ostre zdjęcie. Biżuteria nie jest ruszana ani ucinana.
 * Na telefon: całe zdjęcie w dolnej części kadru, nad nim satyna pod tekst.
 */
async function hero() {
  const file = "IMG_8719.JPG";
  const dir = path.join(PUB, "zdjecia", "hero");
  fs.mkdirSync(dir, { recursive: true });
  const W = 2400;
  const H = 1500;
  const photo = await enhance(load(file).resize({ height: H }), JASNO).toBuffer({ resolveWithObject: true });
  const pw = photo.info.width;
  const px = W - pw;
  const src = await dims(load(file));
  const strip = await load(file).extract({ left: 0, top: 0, width: Math.round(src.w * 0.16), height: src.h }).toBuffer();
  const bg = await enhance(sharp(strip).resize(W, H, { fit: "fill" }), JASNO).blur(28).toBuffer();
  // miękka lewa krawędź zdjęcia
  const feather = 220;
  const mask = Buffer.from(
    `<svg width="${pw}" height="${H}"><defs><linearGradient id="g" x1="0" x2="1">` +
      `<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="${feather / pw}" stop-color="#fff"/>` +
      `<stop offset="1" stop-color="#fff"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );
  const masked = await sharp(photo.data).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  const wide = await sharp(bg).composite([{ input: masked, left: px, top: 0 }]).toBuffer();
  await sharp(wide).webp({ quality: HERO_QUALITY }).toFile(path.join(dir, "hero-czern-i-perla-2400.webp"));
  await sharp(wide).resize(1440).webp({ quality: HERO_QUALITY }).toFile(path.join(dir, "hero-czern-i-perla-1440.webp"));

  // telefon (760x1500)
  const MW = 760;
  const MH = 1500;
  const mPhoto = await enhance(load(file).resize({ width: MW }), JASNO).toBuffer({ resolveWithObject: true });
  const mh = mPhoto.info.height;
  const mFeather = 160;
  const mMask = Buffer.from(
    `<svg width="${MW}" height="${mh}"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1">` +
      `<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="${mFeather / mh}" stop-color="#fff"/>` +
      `<stop offset="1" stop-color="#fff"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );
  const mMasked = await sharp(mPhoto.data).composite([{ input: mMask, blend: "dest-in" }]).png().toBuffer();
  const mBg = await enhance(sharp(strip).resize(MW, MH, { fit: "fill" }), JASNO).blur(28).toBuffer();
  const mobile = await sharp(mBg)
    .composite([{ input: mMasked, left: 0, top: MH - mh - 120 }])
    .toBuffer();
  await sharp(mobile).webp({ quality: HERO_QUALITY }).toFile(path.join(dir, "hero-czern-i-perla-mobile.webp"));
  // lżejsze wersje na telefony o mniejszej gęstości ekranu (pierwszy slajd = najważniejsze zdjęcie strony)
  for (const w of [520, 680]) {
    await sharp(mobile).resize({ width: w }).webp({ quality: HERO_QUALITY }).toFile(path.join(dir, `hero-czern-i-perla-mobile-${w}.webp`));
  }

  // rozmyte podglądy wszystkich slajdów hero (także wcześniejszych hero-1..4)
  const out = {};
  for (const name of ["hero-czern-i-perla", "hero-1", "hero-2", "hero-3", "hero-4"]) {
    const wideFile = path.join(dir, `${name}-1440.webp`);
    const mobileFile = path.join(dir, `${name}-mobile.webp`);
    if (!fs.existsSync(wideFile) || !fs.existsSync(mobileFile)) continue;
    out[name] = { wide: await blurOf(sharp(wideFile)), mobile: await blurOf(sharp(mobileFile)) };
  }
  process.stdout.write("H");
  return out;
}

/** Obraz Open Graph 1200x630: kremowe tło, oryginalne logo z oddechem, zdjęcie Poziomki. */
async function og() {
  const W = 1200;
  const H = 630;
  const dir = path.join(PUB, "og");
  fs.mkdirSync(dir, { recursive: true });
  const side = H - 96; // zdjęcie z marginesem
  const radius = 36;
  const photo = await load("b8319a9c-6680-44a2-b52a-e473bb6678fc.png").resize(side, side, { fit: "cover" }).toBuffer();
  const round = Buffer.from(`<svg width="${side}" height="${side}"><rect width="${side}" height="${side}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`);
  const photoRound = await sharp(photo).composite([{ input: round, blend: "dest-in" }]).png().toBuffer();
  const logoW = 440;
  const logo = await sharp(path.join(PUB, "brand", "caramel-logo.webp")).resize({ width: logoW }).png().toBuffer({ resolveWithObject: true });
  const leftArea = W - side - 48; // wolne pole po lewej
  await sharp({ create: { width: W, height: H, channels: 3, background: { r: 246, g: 236, b: 224 } } })
    .composite([
      { input: logo.data, left: Math.round((leftArea - logoW) / 2), top: Math.round((H - logo.info.height) / 2) },
      { input: photoRound, left: W - side - 48, top: 48 },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(dir, "caramel-jewelry-og.jpg"));
  process.stdout.write("O");
}

/** Ikony do manifestu (192 i 512 px): litera „C” z oryginalnego logo na kremowym, zaokrąglonym polu. */
async function ikony() {
  const dir = path.join(PUB, "ikony");
  fs.mkdirSync(dir, { recursive: true });
  const logoPath = path.join(PUB, "brand", "caramel-logo.webp");
  const m = await sharp(logoPath).metadata();
  const c = await sharp(logoPath)
    .extract({ left: 0, top: Math.round(m.height * 0.13), width: Math.round(m.width * 0.272), height: Math.round(m.height * 0.87) })
    .toBuffer();
  for (const size of [192, 512]) {
    const mark = await sharp(c).resize({ height: Math.round(size * 0.7), width: Math.round(size * 0.7), fit: "inside" }).png().toBuffer({ resolveWithObject: true });
    const bg = Buffer.from(
      `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.22}" ry="${size * 0.22}" fill="rgb(248,242,234)"/></svg>`,
    );
    await sharp(bg)
      .composite([{ input: mark.data, left: Math.round((size - mark.info.width) / 2), top: Math.round((size - mark.info.height) / 2) }])
      .png()
      .toFile(path.join(dir, `ikona-${size}.png`));
  }
  process.stdout.write("I");
}

/**
 * Mniejsze kopie oryginalnego logo (to samo logo z przezroczystym tłem, tylko przeskalowane)
 * do nagłówka i stopki - oryginał ma 1626 px i ponad 120 KB, a wyświetla się w 150-220 px.
 */
async function logo() {
  const src = path.join(PUB, "brand", "caramel-logo.webp");
  for (const w of [320, 640]) {
    await sharp(src).resize({ width: w }).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(PUB, "brand", `caramel-logo-${w}.webp`));
  }
  process.stdout.write("L");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
