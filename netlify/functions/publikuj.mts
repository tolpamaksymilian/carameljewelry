/**
 * „Zapisz stronę” z panelu /admin → przebudowa strony na Netlify.
 *
 * POST /api/publikuj z nagłówkiem Authorization: Bearer <token sesji Supabase>.
 * Sprawdzam, czy token należy do konta z tabeli public.admini, i dopiero wtedy wywołuję build hook.
 * Adres build hooka (NETLIFY_BUILD_HOOK) zostaje po stronie serwera - przeglądarka go nie widzi.
 */
const PRZERWA_S = 60; // minimalny odstęp między publikacjami

const odpowiedz = (status: number, dane: Record<string, unknown>) =>
  new Response(JSON.stringify(dane), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

async function publikuj(req: Request) {
  if (req.method !== "POST") return odpowiedz(405, { blad: "Tylko POST." });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    .replace(/\/+$/, "")
    .replace(/\/(rest|auth|storage)\/v1$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const hook = process.env.NETLIFY_BUILD_HOOK?.trim();
  if (!url || !anon || !hook) return odpowiedz(500, { blad: "Brak konfiguracji publikacji na serwerze." });

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return odpowiedz(401, { blad: "Zaloguj się ponownie." });
  const naglowki = { apikey: anon, Authorization: `Bearer ${token}` };

  // kto to jest?
  const u = await fetch(`${url}/auth/v1/user`, { headers: naglowki });
  if (!u.ok) return odpowiedz(401, { blad: "Sesja wygasła - zaloguj się ponownie." });
  const user = (await u.json()) as { id?: string };
  if (!user.id) return odpowiedz(401, { blad: "Zaloguj się ponownie." });

  // czy jest adminem? (RLS: admin widzi listę adminów)
  const a = await fetch(`${url}/rest/v1/admini?select=user_id&user_id=eq.${encodeURIComponent(user.id)}`, { headers: naglowki });
  const admini = a.ok ? ((await a.json()) as unknown[]) : [];
  if (!admini.length) return odpowiedz(403, { blad: "To konto nie może publikować zmian." });

  // nie częściej niż raz na minutę
  const ost = await fetch(`${url}/rest/v1/publikacje?select=utworzono&status=eq.wyslano&order=utworzono.desc&limit=1`, { headers: naglowki });
  const ostatnia = ost.ok ? ((await ost.json()) as { utworzono: string }[])[0] : undefined;
  if (ostatnia && Date.now() - Date.parse(ostatnia.utworzono) < PRZERWA_S * 1000) {
    return odpowiedz(429, { blad: "Strona właśnie się zapisuje - spróbuj ponownie za minutę." });
  }

  const h = await fetch(`${hook}?trigger_title=${encodeURIComponent("Zapis z panelu admina")}`, { method: "POST", body: "{}" });

  await fetch(`${url}/rest/v1/publikacje`, {
    method: "POST",
    headers: { ...naglowki, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ kto: user.id, status: h.ok ? "wyslano" : "blad", komunikat: h.ok ? null : `build hook: HTTP ${h.status}` }),
  });

  if (!h.ok) return odpowiedz(502, { blad: "Netlify nie przyjął zlecenia przebudowy. Spróbuj ponownie za chwilę." });
  return odpowiedz(200, { ok: true });
}

export default publikuj;

export const config = { path: "/api/publikuj" };
