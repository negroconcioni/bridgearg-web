const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export interface WorkFromApi {
  id: number;
  titulo: string;
  precio: number;
  priceDisplay: string;
  imagenUrl: string;
  status: string;
  available: boolean;
  artistName: string;
  artistSlug: string;
  year: string | null;
  medium: string | null;
  dimensions: string | null;
}

/** Relación artist en select de obras (artists.name, artists.slug). */
export type ObraRowArtist = { name: string; slug: string } | null;

/** Filas de obras con relación artists (snake_case). artist_slug se mantiene para routing. */
export type ObraRow = {
  id: number;
  titulo: string;
  precio: number;
  imagen_url: string;
  status: string;
  artist_id: number;
  artist_slug: string;
  year: string | null;
  medium: string | null;
  dimensions: string | null;
  artists: ObraRowArtist;
};

function mapObraRowToWork(row: ObraRow): WorkFromApi {
  const artistName = row.artists?.name ?? "";
  const artistSlug = row.artist_slug ?? row.artists?.slug ?? "";
  return {
    id: row.id,
    titulo: row.titulo,
    precio: row.precio,
    priceDisplay: `USD ${(row.precio / 100).toLocaleString("en-US")}`,
    imagenUrl: row.imagen_url,
    status: row.status,
    available: row.status === "disponible",
    artistName,
    artistSlug,
    year: row.year,
    medium: row.medium,
    dimensions: row.dimensions,
  };
}

async function fetchWorksFromApi(artistSlug?: string): Promise<WorkFromApi[]> {
  const url = artistSlug ? `${API_BASE}/api/works?artistSlug=${encodeURIComponent(artistSlug)}` : `${API_BASE}/api/works`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al cargar obras");
  return res.json();
}

export async function getWorks(artistSlug?: string): Promise<WorkFromApi[]> {
  const { supabase, isSupabaseConfigured } = await import("@/lib/supabaseClient");

  if (isSupabaseConfigured && supabase) {
    try {
      const select = "id,titulo,precio,imagen_url,status,artist_id,artist_slug,year,medium,dimensions,artists(name,slug)";
      let query = supabase.from("obras").select(select).order("id", { ascending: true });
      if (artistSlug) {
        query = query.eq("artist_slug", artistSlug);
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message ?? "Error al cargar obras desde Supabase");
      const mapped = (data ?? []).map(mapObraRowToWork);
      if (mapped.length > 0) return mapped;
    } catch (err) {
      console.warn("Supabase obras failed, falling back to API:", err);
    }
  }

  return fetchWorksFromApi(artistSlug);
}

export async function createCheckoutSession(obraId: number): Promise<{ url: string | null }> {
  const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ obraId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Error al crear sesión de pago");
  return { url: data.url ?? null };
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Error al enviar el mensaje");
}
