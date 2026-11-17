"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TYP_ETYKIETA, type TypPracy } from "@/lib/prace-typy";
import styles from "./Admin.module.css";
import {
  ADRES_OK,
  adresPliku,
  nowaNazwaPliku,
  opisBledu,
  Pole,
  przesun,
  sb,
  sprawdzWebp,
  Strzalki,
  usePanel,
  zapiszKolejnosc,
  zrobAdres,
} from "./wspolne";

type Zdj = { id: string; praca_id: string; plik: string; alt: string | null; pozycja: string | null; kolejnosc: number };
type PracaRow = {
  id: string;
  slug: string;
  nazwa: string;
  typ: TypPracy;
  typ_etykieta: string | null;
  opis: string;
  alt: string;
  kolejnosc: number;
  kolejnosc_glowna: number;
  na_glownej: boolean;
  wyrozniona: boolean;
  widoczna: boolean;
  prace_zdjecia: Zdj[];
};

const KADRY: { wartosc: string; etykieta: string }[] = [
  { wartosc: "", etykieta: "Środek" },
  { wartosc: "50% 15%", etykieta: "Góra" },
  { wartosc: "50% 35%", etykieta: "Lekko w górę" },
  { wartosc: "50% 65%", etykieta: "Lekko w dół" },
  { wartosc: "50% 85%", etykieta: "Dół" },
  { wartosc: "25% 50%", etykieta: "Lewa strona" },
  { wartosc: "75% 50%", etykieta: "Prawa strona" },
];

const posortuj = (z: Zdj[]) => [...z].sort((a, b) => a.kolejnosc - b.kolejnosc);

export function Prace() {
  const { info, zmiana } = usePanel();
  const [prace, setPrace] = useState<PracaRow[] | null>(null);
  const [edytowana, setEdytowana] = useState<PracaRow | "nowa" | null>(null);
  const [zajete, setZajete] = useState(false);

  const wczytaj = useCallback(async () => {
    const { data, error } = await sb().from("prace").select("*, prace_zdjecia(*)").order("kolejnosc").order("nazwa");
    if (error) info(opisBledu(error), true);
    else setPrace(data as PracaRow[]);
  }, [info]);

  useEffect(() => {
    queueMicrotask(wczytaj);
  }, [wczytaj]);

  async function zmienKolejnosc(lista: PracaRow[], pole: "kolejnosc" | "kolejnosc_glowna") {
    setZajete(true);
    try {
      await zapiszKolejnosc("prace", lista, pole, (id) => prace!.find((p) => p.id === id)![pole]);
      zmiana();
      await wczytaj();
    } catch (e) {
      info(opisBledu(e), true);
    } finally {
      setZajete(false);
    }
  }

  if (edytowana) {
    return (
      <PracaEdytor
        praca={edytowana === "nowa" ? null : edytowana}
        wszystkie={prace ?? []}
        onZamknij={async () => {
          setEdytowana(null);
          await wczytaj();
        }}
        onZapisano={async (id) => {
          const { data } = await sb().from("prace").select("*, prace_zdjecia(*)").eq("id", id).single();
          if (data) setEdytowana(data as PracaRow);
          await wczytaj();
        }}
      />
    );
  }

  if (!prace) return <p className={styles.muted}>Wczytywanie prac…</p>;

  const naGlownej = prace.filter((p) => p.na_glownej).sort((a, b) => a.kolejnosc_glowna - b.kolejnosc_glowna);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <h2 className={styles.h2}>Moje prace</h2>
          <p className={styles.muted}>Kolejność jak w „Mojej pracowni”. Strzałkami zmieniasz miejsce pracy na liście.</p>
        </div>
        <button type="button" className={styles.primary} onClick={() => setEdytowana("nowa")}>
          + Dodaj pracę
        </button>
      </div>

      <ul className={styles.list} aria-busy={zajete}>
        {prace.map((p, i) => {
          const okladka = posortuj(p.prace_zdjecia)[0];
          return (
            <li key={p.id} className={styles.row}>
              <button type="button" className={styles.rowMain} onClick={() => setEdytowana(p)}>
                <span className={styles.thumb}>
                  {okladka ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={adresPliku("prace", okladka.plik)} alt="" loading="lazy" />
                  ) : (
                    <span className={styles.thumbEmpty}>brak zdjęć</span>
                  )}
                </span>
                <span className={styles.rowText}>
                  <strong>{p.nazwa}</strong>
                  <span className={styles.rowMeta}>
                    {p.typ_etykieta || TYP_ETYKIETA[p.typ]} · {p.prace_zdjecia.length} zdj.
                  </span>
                  <span className={styles.badges}>
                    {!p.widoczna && <span className={`${styles.badge} ${styles.badgeOff}`}>ukryta</span>}
                    {p.na_glownej && <span className={styles.badge}>na głównej</span>}
                    {p.wyrozniona && <span className={styles.badge}>wyróżniona</span>}
                  </span>
                </span>
              </button>
              <Strzalki
                nazwa={p.nazwa}
                gora={i > 0 && !zajete}
                dol={i < prace.length - 1 && !zajete}
                onGora={() => zmienKolejnosc(przesun(prace, i, -1), "kolejnosc")}
                onDol={() => zmienKolejnosc(przesun(prace, i, 1), "kolejnosc")}
              />
            </li>
          );
        })}
      </ul>

      <div className={styles.sectionHead}>
        <div>
          <h2 className={styles.h2}>Kolejność na stronie głównej</h2>
          <p className={styles.muted}>Tylko prace z zaznaczonym „Pokaż na stronie głównej”.</p>
        </div>
      </div>
      {naGlownej.length ? (
        <ol className={styles.miniList}>
          {naGlownej.map((p, i) => (
            <li key={p.id} className={styles.miniRow}>
              <span>
                {i + 1}. {p.nazwa}
              </span>
              <Strzalki
                nazwa={p.nazwa}
                gora={i > 0 && !zajete}
                dol={i < naGlownej.length - 1 && !zajete}
                onGora={() => zmienKolejnosc(przesun(naGlownej, i, -1), "kolejnosc_glowna")}
                onDol={() => zmienKolejnosc(przesun(naGlownej, i, 1), "kolejnosc_glowna")}
              />
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles.muted}>Żadna praca nie jest teraz na stronie głównej.</p>
      )}
    </div>
  );
}

function PracaEdytor({
  praca,
  wszystkie,
  onZamknij,
  onZapisano,
}: {
  praca: PracaRow | null;
  wszystkie: PracaRow[];
  onZamknij: () => void;
  onZapisano: (id: string) => void;
}) {
  const { info, zmiana } = usePanel();
  const [f, setF] = useState(() => ({
    nazwa: praca?.nazwa ?? "",
    slug: praca?.slug ?? "",
    typ: praca?.typ ?? ("naszyjnik" as TypPracy),
    typ_etykieta: praca?.typ_etykieta ?? "",
    opis: praca?.opis ?? "",
    alt: praca?.alt ?? "",
    widoczna: praca?.widoczna ?? true,
    na_glownej: praca?.na_glownej ?? false,
    wyrozniona: praca?.wyrozniona ?? false,
  }));
  const [adresRecznie, setAdresRecznie] = useState(Boolean(praca));
  const [zapisuje, setZapisuje] = useState(false);
  const [wgrywam, setWgrywam] = useState<string | null>(null);
  const plikRef = useRef<HTMLInputElement>(null);
  const zdjecia = posortuj(praca?.prace_zdjecia ?? []);

  const ustaw = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));

  async function zapisz(e: React.FormEvent) {
    e.preventDefault();
    const nazwa = f.nazwa.trim();
    const slug = f.slug.trim();
    if (!nazwa) return info("Wpisz nazwę pracy.", true);
    if (!ADRES_OK.test(slug)) return info("Adres może mieć tylko małe litery bez polskich znaków, cyfry i myślniki (np. czarna-perla).", true);
    if (wszystkie.some((p) => p.slug === slug && p.id !== praca?.id)) return info("Ten adres ma już inna praca - wpisz inny.", true);

    setZapisuje(true);
    try {
      const dane = {
        nazwa,
        slug,
        typ: f.typ,
        typ_etykieta: f.typ_etykieta.trim() || null,
        opis: f.opis.trim(),
        alt: f.alt.trim() || nazwa,
        widoczna: f.widoczna,
        na_glownej: f.na_glownej,
        wyrozniona: f.wyrozniona,
      };
      if (f.wyrozniona) {
        const { error } = await sb().from("prace").update({ wyrozniona: false }).eq("wyrozniona", true).neq("id", praca?.id ?? "00000000-0000-0000-0000-000000000000");
        if (error) throw error;
      }
      let id = praca?.id;
      const maxGlowna = Math.max(0, ...wszystkie.map((p) => p.kolejnosc_glowna));
      if (praca) {
        const { error } = await sb()
          .from("prace")
          .update({ ...dane, ...(f.na_glownej && !praca.na_glownej ? { kolejnosc_glowna: maxGlowna + 1 } : {}) })
          .eq("id", praca.id);
        if (error) throw error;
      } else {
        // nowa praca trafia na początek listy
        const minKolejnosc = Math.min(1, ...wszystkie.map((p) => p.kolejnosc));
        const { data, error } = await sb()
          .from("prace")
          .insert({ ...dane, kolejnosc: minKolejnosc - 1, kolejnosc_glowna: f.na_glownej ? maxGlowna + 1 : 0 })
          .select("id")
          .single();
        if (error) throw error;
        id = data.id;
      }
      zmiana();
      info(praca ? "Zapisano pracę." : "Dodano pracę - teraz wgraj zdjęcia.");
      onZapisano(id!);
    } catch (err) {
      info(opisBledu(err), true);
    } finally {
      setZapisuje(false);
    }
  }

  async function dotknijPrace() {
    if (praca) await sb().from("prace").update({ zmieniono: new Date().toISOString() }).eq("id", praca.id);
  }

  async function wgraj(pliki: FileList | null) {
    if (!praca || !pliki?.length) return;
    let nr = Math.max(0, ...zdjecia.map((z) => z.kolejnosc));
    let ok = 0;
    for (const [i, plik] of [...pliki].entries()) {
      setWgrywam(`Wgrywam ${i + 1} z ${pliki.length}…`);
      const blad = await sprawdzWebp(plik);
      if (blad) {
        info(blad, true);
        continue;
      }
      const sciezka = `${praca.id}/${nowaNazwaPliku()}`;
      const up = await sb().storage.from("prace").upload(sciezka, plik, { contentType: "image/webp", upsert: false });
      if (up.error) {
        info(opisBledu(up.error), true);
        continue;
      }
      const { error } = await sb()
        .from("prace_zdjecia")
        .insert({ praca_id: praca.id, plik: sciezka, kolejnosc: ++nr });
      if (error) {
        await sb().storage.from("prace").remove([sciezka]);
        info(opisBledu(error), true);
        continue;
      }
      ok++;
    }
    setWgrywam(null);
    if (plikRef.current) plikRef.current.value = "";
    if (ok) {
      await dotknijPrace();
      zmiana();
      info(ok === 1 ? "Dodano zdjęcie." : `Dodano zdjęcia: ${ok}.`);
      onZapisano(praca.id);
    }
  }

  async function zmienZdjecie(z: Zdj, dane: Partial<Zdj>) {
    const { error } = await sb().from("prace_zdjecia").update(dane).eq("id", z.id);
    if (error) return info(opisBledu(error), true);
    await dotknijPrace();
    zmiana();
    onZapisano(z.praca_id);
  }

  async function przesunZdjecie(i: number, kierunek: -1 | 1) {
    try {
      await zapiszKolejnosc("prace_zdjecia", przesun(zdjecia, i, kierunek), "kolejnosc", (id) => zdjecia.find((z) => z.id === id)!.kolejnosc);
      await dotknijPrace();
      zmiana();
      onZapisano(praca!.id);
    } catch (e) {
      info(opisBledu(e), true);
    }
  }

  async function usunZdjecie(z: Zdj) {
    if (!confirm("Usunąć to zdjęcie? Tej operacji nie da się cofnąć.")) return;
    const { error } = await sb().from("prace_zdjecia").delete().eq("id", z.id);
    if (error) return info(opisBledu(error), true);
    await sb().storage.from("prace").remove([z.plik]);
    await dotknijPrace();
    zmiana();
    info("Usunięto zdjęcie.");
    onZapisano(z.praca_id);
  }

  async function usunPrace() {
    if (!praca) return;
    if (!confirm(`Usunąć pracę „${praca.nazwa}” razem ze wszystkimi zdjęciami? Tej operacji nie da się cofnąć.`)) return;
    const pliki = praca.prace_zdjecia.map((z) => z.plik);
    const { error } = await sb().from("prace").delete().eq("id", praca.id);
    if (error) return info(opisBledu(error), true);
    if (pliki.length) await sb().storage.from("prace").remove(pliki);
    zmiana();
    info("Usunięto pracę.");
    onZamknij();
  }

  return (
    <div className={styles.section}>
      <button type="button" className={styles.back} onClick={onZamknij}>
        ← Wszystkie prace
      </button>
      <h2 className={styles.h2}>{praca ? `Edycja: ${praca.nazwa}` : "Nowa praca"}</h2>

      <form className={styles.form} onSubmit={zapisz}>
        <Pole etykieta="Nazwa">
          <input
            value={f.nazwa}
            required
            onChange={(e) => {
              ustaw("nazwa", e.target.value);
              if (!adresRecznie) ustaw("slug", zrobAdres(e.target.value));
            }}
          />
        </Pole>
        <Pole etykieta="Adres (w linku)" podpowiedz={`carameljewelry.pl/pracownia#${f.slug || "adres"}`}>
          <input
            value={f.slug}
            required
            inputMode="url"
            autoCapitalize="none"
            onChange={(e) => {
              setAdresRecznie(true);
              ustaw("slug", e.target.value.toLowerCase());
            }}
          />
        </Pole>
        <Pole etykieta="Rodzaj">
          <select value={f.typ} onChange={(e) => ustaw("typ", e.target.value as TypPracy)}>
            {(Object.keys(TYP_ETYKIETA) as TypPracy[]).map((t) => (
              <option key={t} value={t}>
                {TYP_ETYKIETA[t]}
              </option>
            ))}
          </select>
        </Pole>
        <Pole etykieta="Własny podpis rodzaju (opcjonalnie)" podpowiedz="Np. „Kolekcja bransoletek”. Puste = podpis z rodzaju.">
          <input value={f.typ_etykieta} onChange={(e) => ustaw("typ_etykieta", e.target.value)} />
        </Pole>
        <Pole etykieta="Opis" szerokie podpowiedz="Krótko, jedno-dwa zdania.">
          <textarea rows={3} value={f.opis} onChange={(e) => ustaw("opis", e.target.value)} />
        </Pole>
        <Pole etykieta="Opis zdjęć dla niewidomych (alt)" szerokie podpowiedz="Co widać na zdjęciach, np. „Naszyjnik z pereł z zawieszką-sercem”.">
          <input value={f.alt} onChange={(e) => ustaw("alt", e.target.value)} />
        </Pole>

        <fieldset className={`${styles.checks} ${styles.fieldWide}`}>
          <legend>Gdzie pokazać</legend>
          <label>
            <input type="checkbox" checked={f.widoczna} onChange={(e) => ustaw("widoczna", e.target.checked)} /> Widoczna na stronie
          </label>
          <label>
            <input type="checkbox" checked={f.na_glownej} onChange={(e) => ustaw("na_glownej", e.target.checked)} /> Pokaż na stronie głównej
          </label>
          <label>
            <input type="checkbox" checked={f.wyrozniona} onChange={(e) => ustaw("wyrozniona", e.target.checked)} /> Wyróżniona (karta na
            górze strony głównej)
          </label>
        </fieldset>

        <div className={`${styles.formActions} ${styles.fieldWide}`}>
          <button type="submit" className={styles.primary} disabled={zapisuje}>
            {zapisuje ? "Zapisywanie…" : praca ? "Zapisz zmiany" : "Utwórz pracę"}
          </button>
          {praca && (
            <button type="button" className={styles.danger} onClick={usunPrace}>
              Usuń pracę
            </button>
          )}
        </div>
      </form>

      {praca ? (
        <div className={styles.photos}>
          <div className={styles.sectionHead}>
            <div>
              <h3 className={styles.h3}>Zdjęcia ({zdjecia.length})</h3>
              <p className={styles.muted}>Pierwsze zdjęcie jest okładką. Tylko pliki .webp, do 10 MB.</p>
            </div>
            <label className={styles.primary}>
              {wgrywam ?? "+ Dodaj zdjęcia"}
              <input
                ref={plikRef}
                type="file"
                accept=".webp,image/webp"
                multiple
                hidden
                disabled={Boolean(wgrywam)}
                onChange={(e) => wgraj(e.target.files)}
              />
            </label>
          </div>
          <ul className={styles.photoGrid}>
            {zdjecia.map((z, i) => (
              <li key={z.id} className={styles.photoCard}>
                <span className={styles.photoBox}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={adresPliku("prace", z.plik)} alt="" loading="lazy" style={{ objectPosition: z.pozycja ?? "50% 50%" }} />
                  {i === 0 && <span className={styles.coverTag}>okładka</span>}
                </span>
                <label className={styles.smallField}>
                  <span>Kadr w ramce</span>
                  <select value={z.pozycja ?? ""} onChange={(e) => zmienZdjecie(z, { pozycja: e.target.value || null })}>
                    {KADRY.map((k) => (
                      <option key={k.etykieta} value={k.wartosc}>
                        {k.etykieta}
                      </option>
                    ))}
                    {z.pozycja && !KADRY.some((k) => k.wartosc === z.pozycja) && <option value={z.pozycja}>Własny ({z.pozycja})</option>}
                  </select>
                </label>
                <label className={styles.smallField}>
                  <span>Własny opis zdjęcia (opcjonalnie)</span>
                  <input
                    defaultValue={z.alt ?? ""}
                    onBlur={(e) => {
                      const v = e.target.value.trim() || null;
                      if (v !== z.alt) zmienZdjecie(z, { alt: v });
                    }}
                  />
                </label>
                <div className={styles.photoActions}>
                  <Strzalki
                    nazwa={`Zdjęcie ${i + 1}`}
                    gora={i > 0}
                    dol={i < zdjecia.length - 1}
                    onGora={() => przesunZdjecie(i, -1)}
                    onDol={() => przesunZdjecie(i, 1)}
                  />
                  <button type="button" className={styles.linkDanger} onClick={() => usunZdjecie(z)}>
                    Usuń
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {!zdjecia.length && <p className={styles.muted}>Ta praca nie ma jeszcze zdjęć - bez zdjęć nie pojawi się na stronie.</p>}
        </div>
      ) : (
        <p className={styles.muted}>Zdjęcia dodasz po utworzeniu pracy.</p>
      )}
    </div>
  );
}
