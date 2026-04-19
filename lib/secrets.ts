import "server-only";
import { getSupabaseAdmin } from "./supabase-server";

// Cache em memória por processo. TTL curto pra permitir rotação sem restart.
const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { value: string; expiresAt: number }>();

export type SecretKey =
  | "PAGOU_SECRET_KEY"
  | "PAGOU_PUBLIC_KEY"
  | "PAGOU_API_URL"
  | "PAGOU_WEBHOOK_SECRET";

/**
 * Busca uma chave no vault `app_secrets` da Supabase, caindo pro `process.env`
 * como fallback (útil em desenvolvimento sem Supabase configurada).
 */
export async function getSecret(key: SecretKey): Promise<string> {
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  // 1) tenta Supabase
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("app_secrets")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (!error && data?.value) {
      cache.set(key, { value: data.value, expiresAt: Date.now() + CACHE_TTL_MS });
      return data.value;
    }
  } catch {
    // ignora — cai no fallback
  }

  // 2) fallback: process.env
  const envValue = process.env[key];
  if (envValue) {
    cache.set(key, { value: envValue, expiresAt: Date.now() + CACHE_TTL_MS });
    return envValue;
  }

  throw new Error(`Secret ${key} não encontrado (Supabase vault nem process.env).`);
}

export function invalidateSecret(key: SecretKey): void {
  cache.delete(key);
}
