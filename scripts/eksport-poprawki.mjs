/**
 * Poprawka statycznego eksportu Next.js (uruchamia się po `npm run build`).
 *
 * Przeglądarka przy wstępnym ładowaniu podstron prosi o pliki o nazwach z kropkami, np.
 *   /kontakt/__next.!KHNpdGUp.kontakt.__PAGE__.txt
 * a eksport zapisuje je w zagnieżdżonych folderach:
 *   /kontakt/__next.!KHNpdGUp/kontakt/__PAGE__.txt
 * Na zwykłym hostingu plików (Netlify) kończyło się to błędami 404 w konsoli i wolniejszym
 * przechodzeniem między podstronami. Skrypt dokłada kopie pod nazwami, o które prosi przeglądarka.
 * Niczego nie usuwa i nie zmienia istniejących plików.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), "out");
if (!fs.existsSync(OUT)) process.exit(0);

let dodane = 0;

function pliki(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? pliki(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

function przejdz(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const full = path.join(dir, e.name);
    if (e.name.startsWith("__next.")) {
      for (const f of pliki(full)) {
        const dotted = `${e.name}.${path.relative(full, f).split(path.sep).join(".")}`;
        const target = path.join(dir, dotted);
        if (!fs.existsSync(target)) {
          fs.copyFileSync(f, target);
          dodane++;
        }
      }
    } else if (e.name !== "_next") {
      przejdz(full);
    }
  }
}

przejdz(OUT);
console.log(`eksport-poprawki: dodano ${dodane} plików wstępnego ładowania podstron.`);
