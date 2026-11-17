"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GROUPS, ZODIAK, type GroupId } from "@/lib/stones";
import styles from "./Admin.module.css";
import { ADRES_OK, adresPliku, nowaNazwaPliku, opisBledu, Pole, przesun, sb, sprawdzWebp, Strzalki, usePanel, zapiszKolejnosc, zrobAdres } from "./wspolne";

type Kamien = {
  id: string;
  slug: string;
  nazwa: string;
  alias: string | null;
  grupa: GroupId;
  akcent: string;
  slowa_kluczowe: string;
  znaki: string[];
  czakra: string | null;
  numerologia_liczba: number | null;
  numerologia_opis: string | null;
  zywiol: string | null;
  planeta: string | null;
  symbolika: string;
  intencja: string | null;
  opis: string | null;
  ciekawostka: string;
  pielegnacja: string;
  ilustracja: string | null;
  kolejnosc: number;
  widoczny: boolean;
};

export function Kamienie() {
  const { info, zmiana } = usePanel();
  const [kamienie, setKamienie] = useState<Kamien[] | null>(null);
  const [edytowany, setEdytowany] = useState<Kamien | "nowy" | null>(null);
  const [zajete, setZajete] = useState(false);

  const wczytaj = useCallback(async () => {
    const { data, error } = await sb().from("kamienie").select("*").order("kolejnosc").order("nazwa");
    if (error) info(opisBledu(error), true);
    else setKamienie(data as Kamien[]);
  }, [info]);

  useEffect(() => {
    queueMicrotask(wczytaj);
  }, [wczytaj]);

  async function przesunWGrupie(lista: Kamien[], i: number, kierunek: -1 | 1) {
    setZajete(true);
    try {
      await zapiszKolejnosc("kamienie", przesun(lista, i, kierunek), "kolejnosc", (id) => kamienie!.find((k) => k.id === id)!.kolejnosc);
      zmiana();
      await wczytaj();
    } catch (e) {
      info(opisBledu(e), true);
    } finally {
      setZajete(false);
    }
  }

  if (edytowany) {
    return (
      <KamienEdytor
        kamien={edytowany === "nowy" ? null : edytowany}
        wszystkie={kamienie ?? []}
        onZamknij={async () => {
          setEdytowany(null);
          await wczytaj();
        }}
        onZapisano={async (id) => {
          const { data } = await sb().from("kamienie").select("*").eq("id", id).single();
          if (data) setEdytowany(data as Kamien);
          await wczytaj();
        }}
      />
    );
  }

  if (!kamienie) return <p className={styles.muted}>Wczytywanie kamieni…</p>;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <h2 className={styles.h2}>Moc kamieni</h2>
          <p className={styles.muted}>Kamienie w grupach, w kolejności jak na stronie. Strzałkami zmieniasz kolejność w grupie.</p>
        </div>
        <button type="button" className={styles.primary} onClick={() => setEdytowany("nowy")}>
          + Dodaj kamień
        </button>
      </div>

      {GROUPS.map((g) => {
        const lista = kamienie.filter((k) => k.grupa === g.id);
        return (
          <section key={g.id} className={styles.group} aria-labelledby={`g-${g.id}`}>
            <h3 id={`g-${g.id}`} className={styles.h3}>
              {g.title} <span className={styles.count}>{lista.length}</span>
            </h3>
            {lista.length ? (
              <ul className={styles.list} aria-busy={zajete}>
                {lista.map((k, i) => (
                  <li key={k.id} className={styles.row}>
                    <button type="button" className={styles.rowMain} onClick={() => setEdytowany(k)}>
                      <span className={styles.thumb}>
                        {k.ilustracja ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={adresPliku("kamienie", k.ilustracja)} alt="" loading="lazy" />
                        ) : (
                          <span className={styles.thumbEmpty}>brak</span>
                        )}
                      </span>
                      <span className={styles.rowText}>
                        <strong style={{ color: k.akcent }}>{k.nazwa}</strong>
                        <span className={styles.rowMeta}>{k.znaki.join(" · ") || "bez znaków"}</span>
                        {!k.widoczny && (
                          <span className={styles.badges}>
                            <span className={`${styles.badge} ${styles.badgeOff}`}>ukryty</span>
                          </span>
                        )}
                      </span>
                    </button>
                    <Strzalki
                      nazwa={k.nazwa}
                      gora={i > 0 && !zajete}
                      dol={i < lista.length - 1 && !zajete}
                      onGora={() => przesunWGrupie(lista, i, -1)}
                      onDol={() => przesunWGrupie(lista, i, 1)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.muted}>Brak kamieni w tej grupie.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}

const PUSTY = {
  nazwa: "",
  slug: "",
  alias: "",
  grupa: "spokoj" as GroupId,
  akcent: "#8b4a1e",
  slowa_kluczowe: "",
  znaki: [] as string[],
  czakra: "",
  numerologia_liczba: "",
  numerologia_opis: "",
  zywiol: "",
  planeta: "",
  symbolika: "",
  intencja: "",
  opis: "",
  ciekawostka: "",
  pielegnacja: "",
  widoczny: true,
};

function KamienEdytor({
  kamien,
  wszystkie,
  onZamknij,
  onZapisano,
}: {
  kamien: Kamien | null;
  wszystkie: Kamien[];
  onZamknij: () => void;
  onZapisano: (id: string) => void;
}) {
  const { info, zmiana } = usePanel();
  const [f, setF] = useState(() =>
    kamien
      ? {
          nazwa: kamien.nazwa,
          slug: kamien.slug,
          alias: kamien.alias ?? "",
          grupa: kamien.grupa,
          akcent: kamien.akcent.toLowerCase(),
          slowa_kluczowe: kamien.slowa_kluczowe,
          znaki: kamien.znaki,
          czakra: kamien.czakra ?? "",
          numerologia_liczba: kamien.numerologia_liczba?.toString() ?? "",
          numerologia_opis: kamien.numerologia_opis ?? "",
          zywiol: kamien.zywiol ?? "",
          planeta: kamien.planeta ?? "",
          symbolika: kamien.symbolika,
          intencja: kamien.intencja ?? "",
          opis: kamien.opis ?? "",
          ciekawostka: kamien.ciekawostka,
          pielegnacja: kamien.pielegnacja,
          widoczny: kamien.widoczny,
        }
      : PUSTY,
  );
  const [adresRecznie, setAdresRecznie] = useState(Boolean(kamien));
  const [zapisuje, setZapisuje] = useState(false);
  const [wgrywam, setWgrywam] = useState(false);
  const plikRef = useRef<HTMLInputElement>(null);
  const ustaw = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));
  const puste = (s: string) => s.trim() || null;

  async function zapisz(e: React.FormEvent) {
    e.preventDefault();
    const nazwa = f.nazwa.trim();
    const slug = f.slug.trim();
    if (!nazwa) return info("Wpisz nazwę kamienia.", true);
    if (!ADRES_OK.test(slug)) return info("Adres może mieć tylko małe litery bez polskich znaków, cyfry i myślniki (np. kwarc-rozowy).", true);
    if (wszystkie.some((k) => k.slug === slug && k.id !== kamien?.id)) return info("Ten adres ma już inny kamień - wpisz inny.", true);
    const liczba = f.numerologia_liczba.trim();
    if (liczba && !/^\d{1,2}$/.test(liczba)) return info("Numerologia: wpisz liczbę (np. 7) albo zostaw puste.", true);

    setZapisuje(true);
    try {
      const dane = {
        nazwa,
        slug,
        alias: puste(f.alias),
        grupa: f.grupa,
        akcent: f.akcent,
        slowa_kluczowe: f.slowa_kluczowe.trim(),
        znaki: ZODIAK.map((z) => z.name).filter((z) => f.znaki.includes(z)),
        czakra: puste(f.czakra),
        numerologia_liczba: liczba ? Number(liczba) : null,
        numerologia_opis: puste(f.numerologia_opis),
        zywiol: puste(f.zywiol),
        planeta: puste(f.planeta),
        symbolika: f.symbolika.trim(),
        intencja: puste(f.intencja),
        opis: puste(f.opis),
        ciekawostka: f.ciekawostka.trim(),
        pielegnacja: f.pielegnacja.trim(),
        widoczny: f.widoczny,
      };
      let id = kamien?.id;
      const naKoncu = Math.max(0, ...wszystkie.filter((k) => k.grupa === f.grupa).map((k) => k.kolejnosc)) + 1;
      if (kamien) {
        const { error } = await sb()
          .from("kamienie")
          .update({ ...dane, ...(f.grupa !== kamien.grupa ? { kolejnosc: naKoncu } : {}) })
          .eq("id", kamien.id);
        if (error) throw error;
      } else {
        const { data, error } = await sb()
          .from("kamienie")
          .insert({ ...dane, kolejnosc: naKoncu })
          .select("id")
          .single();
        if (error) throw error;
        id = data.id;
      }
      zmiana();
      info(kamien ? "Zapisano kamień." : "Dodano kamień - teraz wgraj ilustrację.");
      onZapisano(id!);
    } catch (err) {
      info(opisBledu(err), true);
    } finally {
      setZapisuje(false);
    }
  }

  async function wgrajIlustracje(pliki: FileList | null) {
    const plik = pliki?.[0];
    if (!kamien || !plik) return;
    const blad = await sprawdzWebp(plik);
    if (blad) return info(blad, true);
    setWgrywam(true);
    const sciezka = nowaNazwaPliku();
    const up = await sb().storage.from("kamienie").upload(sciezka, plik, { contentType: "image/webp", upsert: false });
    if (up.error) {
      setWgrywam(false);
      return info(opisBledu(up.error), true);
    }
    const { error } = await sb().from("kamienie").update({ ilustracja: sciezka }).eq("id", kamien.id);
    if (error) {
      await sb().storage.from("kamienie").remove([sciezka]);
      setWgrywam(false);
      return info(opisBledu(error), true);
    }
    if (kamien.ilustracja) await sb().storage.from("kamienie").remove([kamien.ilustracja]);
    setWgrywam(false);
    if (plikRef.current) plikRef.current.value = "";
    zmiana();
    info("Zmieniono ilustrację.");
    onZapisano(kamien.id);
  }

  async function usunKamien() {
    if (!kamien) return;
    if (!confirm(`Usunąć kamień „${kamien.nazwa}”? Tej operacji nie da się cofnąć.`)) return;
    const { error } = await sb().from("kamienie").delete().eq("id", kamien.id);
    if (error) return info(opisBledu(error), true);
    if (kamien.ilustracja) await sb().storage.from("kamienie").remove([kamien.ilustracja]);
    zmiana();
    info("Usunięto kamień.");
    onZamknij();
  }

  const pole = (k: keyof typeof f, etykieta: string, podpowiedz?: string, wiersze = 0, szerokie = false) => (
    <Pole etykieta={etykieta} podpowiedz={podpowiedz} szerokie={szerokie || wiersze > 0}>
      {wiersze ? (
        <textarea rows={wiersze} value={f[k] as string} onChange={(e) => ustaw(k, e.target.value as never)} />
      ) : (
        <input value={f[k] as string} onChange={(e) => ustaw(k, e.target.value as never)} />
      )}
    </Pole>
  );

  return (
    <div className={styles.section}>
      <button type="button" className={styles.back} onClick={onZamknij}>
        ← Wszystkie kamienie
      </button>
      <h2 className={styles.h2}>{kamien ? `Edycja: ${kamien.nazwa}` : "Nowy kamień"}</h2>

      {kamien && (
        <div className={styles.illustration}>
          <span className={styles.illustrationBox}>
            {kamien.ilustracja ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={adresPliku("kamienie", kamien.ilustracja)} alt="" />
            ) : (
              <span className={styles.thumbEmpty}>brak ilustracji</span>
            )}
          </span>
          <div>
            <p className={styles.muted}>Ilustracja kamienia - kwadratowy plik .webp (najlepiej 1200 × 1200 px), do 10 MB.</p>
            <label className={styles.secondary}>
              {wgrywam ? "Wgrywam…" : kamien.ilustracja ? "Zmień ilustrację" : "Wgraj ilustrację"}
              <input ref={plikRef} type="file" accept=".webp,image/webp" hidden disabled={wgrywam} onChange={(e) => wgrajIlustracje(e.target.files)} />
            </label>
          </div>
        </div>
      )}

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
        <Pole etykieta="Adres (w linku)" podpowiedz={`carameljewelry.pl/moc-kamieni/${f.slug || "adres"}`}>
          <input
            value={f.slug}
            required
            autoCapitalize="none"
            onChange={(e) => {
              setAdresRecznie(true);
              ustaw("slug", e.target.value.toLowerCase());
            }}
          />
        </Pole>
        {pole("alias", "Druga nazwa (opcjonalnie)", "Np. „Pink Opal” - mały napis pod nazwą.")}
        <Pole etykieta="Grupa">
          <select value={f.grupa} onChange={(e) => ustaw("grupa", e.target.value as GroupId)}>
            {GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </Pole>
        <Pole etykieta="Kolor akcentu" podpowiedz="Kolor nazwy, słów kluczowych i znaków zodiaku.">
          <input type="color" value={f.akcent} onChange={(e) => ustaw("akcent", e.target.value)} className={styles.color} />
        </Pole>
        {pole("slowa_kluczowe", "Słowa kluczowe", "Małymi literami, np. „spokój, intuicja, mądrość”.")}

        <fieldset className={`${styles.checks} ${styles.signs} ${styles.fieldWide}`}>
          <legend>Znaki zodiaku</legend>
          {ZODIAK.map((z) => (
            <label key={z.name}>
              <input
                type="checkbox"
                checked={f.znaki.includes(z.name)}
                onChange={(e) => ustaw("znaki", e.target.checked ? [...f.znaki, z.name] : f.znaki.filter((x) => x !== z.name))}
              />{" "}
              {z.name}
            </label>
          ))}
        </fieldset>

        {pole("opis", "Opis", "Główny akapit na stronie kamienia.", 4)}
        {pole("symbolika", "Symbolika", "Jedno zdanie, np. „Spokój, intuicja, mądrość i refleksja.”", 2)}
        {pole("intencja", "Intencja (opcjonalnie)", undefined, 2)}
        <Pole etykieta="Numerologia - liczba">
          <input value={f.numerologia_liczba} inputMode="numeric" onChange={(e) => ustaw("numerologia_liczba", e.target.value)} />
        </Pole>
        {pole("numerologia_opis", "Numerologia - opis", "Np. „refleksja, intuicja, duchowość”.")}
        {pole("zywiol", "Żywioł")}
        {pole("planeta", "Planeta")}
        {pole("czakra", "Czakra", "Np. „Serca, korony”.")}
        {pole("ciekawostka", "Ciekawostka", undefined, 4)}
        {pole("pielegnacja", "Pielęgnacja", undefined, 3)}

        <fieldset className={`${styles.checks} ${styles.fieldWide}`}>
          <legend>Widoczność</legend>
          <label>
            <input type="checkbox" checked={f.widoczny} onChange={(e) => ustaw("widoczny", e.target.checked)} /> Widoczny na stronie
          </label>
        </fieldset>

        <p className={`${styles.muted} ${styles.fieldWide}`}>Puste pola (np. planeta, czakra) po prostu nie pojawią się na stronie kamienia.</p>

        <div className={`${styles.formActions} ${styles.fieldWide}`}>
          <button type="submit" className={styles.primary} disabled={zapisuje}>
            {zapisuje ? "Zapisywanie…" : kamien ? "Zapisz zmiany" : "Utwórz kamień"}
          </button>
          {kamien && (
            <button type="button" className={styles.danger} onClick={usunKamien}>
              Usuń kamień
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
