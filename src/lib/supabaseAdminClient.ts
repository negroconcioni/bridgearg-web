import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase con **service_role** para escrituras del panel admin (bypass RLS).
 *
 * ⚠️ **Seguridad**: cualquier variable `VITE_*` se incluye en el bundle del navegador.
 * No uses `VITE_SUPABASE_SERVICE_KEY` en un sitio público: cualquiera puede extraerla del JS.
 * Usala solo en entornos privados (VPN, localhost) o reemplazá esta capa por un backend
 * que firme las operaciones con la service key en el servidor.
 */
let adminClient: SupabaseClient | null = null;

export function isSupabaseAdminConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_SERVICE_KEY?.trim();
  return Boolean(url && key);
}

/** Cliente con service_role; lanza si faltan URL o key. */
export function getSupabaseAdmin(): SupabaseClient {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_SERVICE_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      "Escritura admin: definí VITE_SUPABASE_URL y VITE_SUPABASE_SERVICE_KEY (service_role) en .env — ver comentario en supabaseAdminClient.ts sobre exposición al bundle."
    );
  }
  if (!adminClient) {
    adminClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  return adminClient;
}
