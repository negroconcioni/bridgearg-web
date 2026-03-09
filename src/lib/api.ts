const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** Format price in USD with en-US locale (e.g. "USD 4,500.00"). */
export function formatPriceUSD(amountUsd: number): string {
  return `USD ${Number(amountUsd).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/** Status for artworks (DB enum artwork_status_enum). */
export type WorkStatus = "available" | "reserved" | "sold";
export type ArtworkStatus = WorkStatus;

/** Treats legacy values (disponible/vendido) as available/sold for backward compatibility. */
export function isAvailableStatus(status: string): boolean {
  return status === "available" || status === "disponible";
}
export function isSoldStatus(status: string): boolean {
  return status === "sold" || status === "vendido";
}

export interface WorkFromApi {
  id: number;
  titulo: string;
  /** Precio en centavos (legacy). Preferir price_usd para mostrar. */
  precio: number;
  /** Precio en dólares USD (export/catálogo). */
  price_usd: number;
  priceDisplay: string;
  imagenUrl: string;
  status: WorkStatus;
  available: boolean;
  artistName: string;
  artistSlug: string;
  year: string | null;
  medium: string | null;
  /** Descripción libre de dimensiones (ej. "50 x 70 cm"). */
  dimensions: string | null;
  /** Peso en kg (logística). */
  weight_kg: number | null;
  /** Dimensiones en cm (logística). */
  width_cm: number | null;
  height_cm: number | null;
  depth_cm: number | null;
}

/** Relación artist en select de obras (artists.name, artists.slug). */
export type ObraRowArtist = { name: string; slug: string } | null;

/** Filas de obras con relación artists (snake_case). artist_slug se mantiene para routing. */
export type ObraRow = {
  id: number;
  titulo: string;
  precio: number;
  price_usd: number;
  imagen_url: string;
  status: WorkStatus;
  artist_id: number;
  artist_slug: string;
  year: string | null;
  medium: string | null;
  dimensions: string | null;
  weight_kg: number | null;
  width_cm: number | null;
  height_cm: number | null;
  depth_cm: number | null;
  artists: ObraRowArtist;
};

// --- Artworks table (artworks + artists with name, bio, photo) ---

/** Artist row from DB (artists table: name, bio, photo). */
export interface ArtistRow {
  id: number;
  name: string;
  bio: string | null;
  photo: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Relation when selecting artworks with artists (slug for routing). */
export type ArtworkRowArtist = { name: string; bio: string | null; photo: string | null; slug?: string } | null;

/** Row from artworks table (snake_case). Use with .select(..., artists(name,bio,photo,slug)). */
export interface ArtworkRow {
  id: number;
  title: string;
  image_url: string;
  status: ArtworkStatus;
  price_usd: number | null;
  dimensions: string | null;
  weight_kg: number | null;
  width_cm?: number | null;
  height_cm?: number | null;
  depth_cm?: number | null;
  artist_id: number;
  year: string | null;
  medium: string | null;
  created_at?: string;
  updated_at?: string;
  artists: ArtworkRowArtist;
}

/** Normalized artwork for UI (from artworks table). */
export interface ArtworkFromApi {
  id: number;
  title: string;
  imageUrl: string;
  status: ArtworkStatus;
  price_usd: number | null;
  priceDisplay: string;
  dimensions: string | null;
  weight_kg: number | null;
  artistId: number;
  artistName: string;
  artistBio: string | null;
  artistPhoto: string | null;
  year: string | null;
  medium: string | null;
  available: boolean;
}

function mapArtworkRowToArtwork(row: ArtworkRow): ArtworkFromApi {
  const priceUsd = row.price_usd ?? 0;
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.image_url,
    status: row.status,
    price_usd: row.price_usd ?? null,
    priceDisplay: formatPriceUSD(priceUsd),
    dimensions: row.dimensions ?? null,
    weight_kg: row.weight_kg ?? null,
    artistId: row.artist_id,
    artistName: row.artists?.name ?? "",
    artistBio: row.artists?.bio ?? null,
    artistPhoto: row.artists?.photo ?? null,
    year: row.year ?? null,
    medium: row.medium ?? null,
    available: isAvailableStatus(row.status),
  };
}

/** Maps artwork row to WorkFromApi. Use artworks as single source so checkout (stripe-checkout) finds by id. */
function mapArtworkRowToWork(row: ArtworkRow): WorkFromApi {
  const priceUsd = row.price_usd ?? 0;
  const artistSlug = (row.artists as { slug?: string } | null)?.slug ?? "";
  return {
    id: row.id,
    titulo: row.title,
    precio: Math.round(priceUsd * 100),
    price_usd: priceUsd,
    priceDisplay: formatPriceUSD(priceUsd),
    imagenUrl: row.image_url,
    status: row.status,
    available: isAvailableStatus(row.status),
    artistName: row.artists?.name ?? "",
    artistSlug,
    year: row.year ?? null,
    medium: row.medium ?? null,
    dimensions: row.dimensions ?? null,
    weight_kg: row.weight_kg ?? null,
    width_cm: row.width_cm != null ? Number(row.width_cm) : null,
    height_cm: row.height_cm != null ? Number(row.height_cm) : null,
    depth_cm: row.depth_cm != null ? Number(row.depth_cm) : null,
  };
}

/** Fetches works from artworks table (same source as stripe-checkout). */
async function fetchWorksFromArtworks(sb: import("@supabase/supabase-js").SupabaseClient, artistSlug?: string): Promise<WorkFromApi[]> {
  const select = artistSlug
    ? "id,title,image_url,status,price_usd,dimensions,weight_kg,width_cm,height_cm,depth_cm,artist_id,year,medium,artists!inner(name,slug)"
    : "id,title,image_url,status,price_usd,dimensions,weight_kg,width_cm,height_cm,depth_cm,artist_id,year,medium,artists(name,slug)";
  let query = sb.from("artworks").select(select).order("id", { ascending: true });
  if (artistSlug) query = query.eq("artists.slug", artistSlug);
  const { data, error } = await query;
  if (error) throw new Error(error.message ?? "Could not load works from artworks");
  return (data ?? []).map((row) => mapArtworkRowToWork(row as ArtworkRow));
}

/** Fetches a single work from artworks by id. */
async function fetchWorkFromArtworks(sb: import("@supabase/supabase-js").SupabaseClient, id: number): Promise<WorkFromApi | null> {
  const select = "id,title,image_url,status,price_usd,dimensions,weight_kg,width_cm,height_cm,depth_cm,artist_id,year,medium,artists(name,slug)";
  const { data, error } = await sb.from("artworks").select(select).eq("id", id).single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message ?? "Could not load work from artworks");
  }
  return data ? mapArtworkRowToWork(data as ArtworkRow) : null;
}

/** Fetch artworks from Supabase (table artworks). Use when you switch from obras to artworks. */
export async function getArtworks(artistId?: number): Promise<ArtworkFromApi[]> {
  const { supabase, isSupabaseConfigured } = await import("@/lib/supabaseClient");
  if (!isSupabaseConfigured || !supabase) return [];
  const select = "id,title,image_url,status,price_usd,dimensions,weight_kg,artist_id,year,medium,artists(name,bio,photo)";
  let query = supabase.from("artworks").select(select).order("id", { ascending: true });
  if (artistId != null) query = query.eq("artist_id", artistId);
  const { data, error } = await query;
  if (error) throw new Error(error.message ?? "Could not load artworks");
  return (data ?? []).map(mapArtworkRowToArtwork);
}

function mapObraRowToWork(row: ObraRow): WorkFromApi {
  const artistName = row.artists?.name ?? "";
  const artistSlug = row.artist_slug ?? row.artists?.slug ?? "";
  const priceUsd = row.price_usd ?? row.precio / 100;
  return {
    id: row.id,
    titulo: row.titulo,
    precio: row.precio,
    price_usd: priceUsd,
    priceDisplay: formatPriceUSD(priceUsd),
    imagenUrl: row.imagen_url,
    status: row.status,
    available: isAvailableStatus(row.status),
    artistName,
    artistSlug,
    year: row.year,
    medium: row.medium,
    dimensions: row.dimensions,
    weight_kg: row.weight_kg ?? null,
    width_cm: row.width_cm ?? null,
    height_cm: row.height_cm ?? null,
    depth_cm: row.depth_cm ?? null,
  };
}

async function fetchWorksFromApi(artistSlug?: string): Promise<WorkFromApi[]> {
  const url = artistSlug ? `${API_BASE}/api/works?artistSlug=${encodeURIComponent(artistSlug)}` : `${API_BASE}/api/works`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not load works");
  return res.json();
}

export async function getWorks(artistSlug?: string): Promise<WorkFromApi[]> {
  const { supabase, isSupabaseConfigured } = await import("@/lib/supabaseClient");

  if (isSupabaseConfigured && supabase) {
    try {
      return await fetchWorksFromArtworks(supabase, artistSlug);
    } catch (err) {
      console.warn("Supabase artworks failed, falling back to API:", err);
      return fetchWorksFromApi(artistSlug);
    }
  }

  return fetchWorksFromApi(artistSlug);
}

async function fetchWorkFromApi(id: number): Promise<WorkFromApi | null> {
  const res = await fetch(`${API_BASE}/api/works/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Could not load work");
  return res.json();
}

/** Fetches a single work by id for the detail/sales page. */
export async function getWork(id: number): Promise<WorkFromApi | null> {
  const { supabase, isSupabaseConfigured } = await import("@/lib/supabaseClient");

  if (isSupabaseConfigured && supabase) {
    try {
      return await fetchWorkFromArtworks(supabase, id);
    } catch (err) {
      console.warn("Supabase artworks getWork failed, falling back to API:", err);
      return fetchWorkFromApi(id);
    }
  }

  return fetchWorkFromApi(id);
}

/** Creates a Checkout Session via the backend API (Express). */
export async function createCheckoutSession(obraId: number): Promise<{ url: string | null }> {
  const res = await fetch(`${API_BASE}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ obraId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Could not create checkout session");
  return { url: data.url ?? null };
}

export type CheckoutErrorKind = "connection" | "stock" | "unknown";

export class CheckoutError extends Error {
  constructor(
    message: string,
    public readonly kind: CheckoutErrorKind = "unknown"
  ) {
    super(message);
    this.name = "CheckoutError";
  }
}

/**
 * Creates a Stripe Checkout Session. Tries Supabase Edge Function when configured;
 * falls back to Express POST /api/checkout when Supabase is not configured or Edge Function fails.
 * Use this for checkout to support both Supabase-only and Express-only deployments.
 */
export async function createCheckout(obraId: number): Promise<{ url: string | null }> {
  const { isSupabaseConfigured } = await import("@/lib/supabaseClient");

  if (isSupabaseConfigured) {
    try {
      return await createStripeCheckoutViaEdgeFunction(obraId);
    } catch (err) {
      console.warn("Supabase Edge Function checkout failed, falling back to Express:", err);
      return createCheckoutSession(obraId);
    }
  }

  return createCheckoutSession(obraId);
}

/**
 * Creates a Stripe Checkout Session via Supabase Edge Function "stripe-checkout".
 * Invokes supabase.functions.invoke("stripe-checkout", { body: { obraId } }).
 * Returns the Stripe URL for redirect; throws CheckoutError with kind for friendly UI.
 */
export async function createStripeCheckoutViaEdgeFunction(obraId: number): Promise<{ url: string | null }> {
  const { getSupabase } = await import("@/lib/supabaseClient");
  const supabase = getSupabase();
  const { data, error } = await supabase.functions.invoke("stripe-checkout", {
    body: { obraId },
  });
  if (error) {
    const msg = error.message ?? "Could not create checkout session";
    const kind: CheckoutErrorKind =
      /fetch|network|connection|conexión|timeout/i.test(msg) ? "connection"
      : /not available|not found|vendida|sold|no longer available|no encontrad/i.test(msg) ? "stock"
      : "unknown";
    throw new CheckoutError(msg, kind);
  }
  const result = (data ?? {}) as { url?: string | null; error?: string };
  if (result.error) {
    const msg = result.error;
    const kind: CheckoutErrorKind =
      /not available|not found|vendida|sold|no longer available|no encontrad/i.test(msg) ? "stock"
      : "unknown";
    throw new CheckoutError(msg, kind);
  }
  return { url: result.url ?? null };
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
  if (!res.ok) throw new Error(data.error ?? "Could not send your message");
}
