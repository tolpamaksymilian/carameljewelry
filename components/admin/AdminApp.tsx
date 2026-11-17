"use client";

import type { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Admin.module.css";
import { Kamienie } from "./Kamienie";
import { Prace } from "./Prace";
import { Publikacja } from "./Publikacja";
import { Teksty } from "./Teksty";
import { PanelContext } from "./wspolne";

type Stan = "sprawdzam" | "wylogowany" | "zalogowany" | "brak-konfiguracji";

/** Tłumaczenie najczęstszych błędów logowania Supabase. */
function komunikat(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials")) return "Nieprawidłowy e-mail lub hasło.";
  if (m.includes("email not confirmed")) return "Ten adres e-mail nie został jeszcze potwierdzony.";
  if (m.includes("rate limit") || m.includes("too many")) return "Za dużo prób logowania. Spróbuj ponownie za kilka minut.";
  if (m.includes("fetch") || m.includes("network")) return "Brak połączenia. Sprawdź internet i spróbuj ponownie.";
  return "Nie udało się zalogować. Spróbuj ponownie.";
}

export function AdminApp() {
  const [stan, setStan] = useState<Stan>("sprawdzam");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const sb = supabase();
    if (!sb) {
      queueMicrotask(() => setStan("brak-konfiguracji"));
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setStan(data.session ? "zalogowany" : "wylogowany");
    });
    const { data } = sb.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setStan(s ? "zalogowany" : "wylogowany");
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (stan === "sprawdzam") {
    return (
      <main className={styles.screen} aria-busy="true">
        <p className={styles.muted}>Wczytywanie…</p>
      </main>
    );
  }

  if (stan === "brak-konfiguracji") {
    return (
      <main className={styles.screen}>
        <div className={styles.card}>
          <Logo />
          <p className={styles.error} role="alert">
            Panel nie ma połączenia z Supabase. Uzupełnij NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY (lokalnie w .env.local, na
            Netlify w zmiennych środowiskowych) i zbuduj stronę ponownie.
          </p>
        </div>
      </main>
    );
  }

  if (stan === "wylogowany" || !session) return <Login />;

  return <Panel userId={session.user.id} email={session.user.email ?? ""} />;
}

function Logo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/caramel-logo-320.webp" alt="Caramel Handmade Jewelry" width={160} height={80} className={styles.logo} />
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [haslo, setHaslo] = useState("");
  const [blad, setBlad] = useState("");
  const [wysylam, setWysylam] = useState(false);

  async function zaloguj(e: React.FormEvent) {
    e.preventDefault();
    const sb = supabase();
    if (!sb) return;
    setBlad("");
    setWysylam(true);
    try {
      const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password: haslo });
      if (error) setBlad(komunikat(error.message));
    } catch (err) {
      setBlad(komunikat(err instanceof Error ? err.message : ""));
    } finally {
      setWysylam(false);
    }
  }

  return (
    <main className={styles.screen}>
      <form className={styles.card} onSubmit={zaloguj}>
        <Logo />
        <h1 className={styles.title}>Panel</h1>
        <p className={styles.muted}>Zaloguj się, żeby zarządzać stroną.</p>

        <label className={styles.field}>
          <span>E-mail</span>
          <input
            type="email"
            name="email"
            autoComplete="username"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Hasło</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={haslo}
            onChange={(e) => setHaslo(e.target.value)}
          />
        </label>

        {blad && (
          <p className={styles.error} role="alert">
            {blad}
          </p>
        )}

        <button type="submit" className={styles.submit} disabled={wysylam}>
          {wysylam ? "Logowanie…" : "Zaloguj się"}
        </button>
      </form>
    </main>
  );
}

type Zakladka = "prace" | "kamienie" | "teksty";
const ZAKLADKI: { id: Zakladka; nazwa: string }[] = [
  { id: "prace", nazwa: "Prace" },
  { id: "kamienie", nazwa: "Kamienie" },
  { id: "teksty", nazwa: "Teksty" },
];

/** Po zalogowaniu: sprawdzenie uprawnień, zakładki, komunikaty i pasek „Zapisz stronę”. */
function Panel({ userId, email }: { userId: string; email: string }) {
  const [wylogowuje, setWylogowuje] = useState(false);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [zakladka, setZakladka] = useState<Zakladka>("prace");
  const [komunikat, setKomunikat] = useState<{ tekst: string; blad: boolean; id: number } | null>(null);
  const [zmiany, setZmiany] = useState(0);

  useEffect(() => {
    supabase()!
      .from("admini")
      .select("user_id")
      .eq("user_id", userId)
      .then(({ data, error }) => setAdmin(!error && Boolean(data?.length)));
  }, [userId]);

  const info = useCallback((tekst: string, blad = false) => setKomunikat({ tekst, blad, id: Date.now() }), []);
  const zmiana = useCallback(() => setZmiany((n) => n + 1), []);
  const kontekst = useMemo(() => ({ info, zmiana }), [info, zmiana]);

  useEffect(() => {
    if (!komunikat) return;
    const t = setTimeout(() => setKomunikat(null), komunikat.blad ? 7000 : 4000);
    return () => clearTimeout(t);
  }, [komunikat]);

  const wyloguj = async () => {
    setWylogowuje(true);
    await supabase()?.auth.signOut();
  };

  return (
    <PanelContext.Provider value={kontekst}>
      <div className={styles.panel}>
        <header className={styles.bar}>
          <Logo />
          {admin && (
            <nav className={styles.tabs} aria-label="Sekcje panelu">
              {ZAKLADKI.map((z) => (
                <button key={z.id} type="button" className={styles.tab} aria-current={zakladka === z.id ? "page" : undefined} onClick={() => setZakladka(z.id)}>
                  {z.nazwa}
                </button>
              ))}
            </nav>
          )}
          <div className={styles.user}>
            <span className={styles.email}>{email}</span>
            <button type="button" className={styles.logout} disabled={wylogowuje} onClick={wyloguj}>
              {wylogowuje ? "Wylogowywanie…" : "Wyloguj"}
            </button>
          </div>
        </header>

        {admin === null && <p className={`${styles.muted} ${styles.center}`}>Sprawdzam uprawnienia…</p>}
        {admin === false && (
          <main className={styles.screenInner}>
            <p className={styles.error} role="alert">
              To konto nie ma uprawnień do zmieniania strony.
            </p>
          </main>
        )}
        {admin && (
          <>
            <Publikacja zmieniono={zmiany} onOpublikowano={() => setZmiany(0)} />
            <main className={styles.main}>
              {zakladka === "prace" && <Prace />}
              {zakladka === "kamienie" && <Kamienie />}
              {zakladka === "teksty" && <Teksty />}
            </main>
          </>
        )}

        <div className={styles.toastArea} aria-live="polite">
          {komunikat && (
            <p key={komunikat.id} className={`${styles.toast} ${komunikat.blad ? styles.toastError : ""}`} role={komunikat.blad ? "alert" : "status"}>
              {komunikat.tekst}
            </p>
          )}
        </div>
      </div>
    </PanelContext.Provider>
  );
}
