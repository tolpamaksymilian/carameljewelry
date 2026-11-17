import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Klient Supabase dla przeglądarki (panel admina).
 * Używa tylko publicznego klucza (anon) - dostęp do danych pilnują zasady RLS w bazie.
 * Wartości pochodzą z .env.local (lokalnie) i ze zmiennych środowiskowych Netlify (build).
 */
// adres projektu bez końcówki API (częsty błąd: wklejony adres z „/rest/v1/”)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  .replace(/\/+$/, "")
  .replace(/\/(rest|auth|storage)\/v1$/, "");
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

let client: SupabaseClient | null = null;

/** Zwraca klienta albo null, gdy brakuje konfiguracji (np. zmiennych w Netlify). */
export function supabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  client ??= createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: "caramel-admin-auth" },
  });
  return client;
}
