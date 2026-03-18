const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

/** Format price in USD with en-US locale (e.g. "USD 4,500.00"). */
export function formatPriceUSD(amountUsd: number): string {
  return `USD ${Number(amountUsd).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export const FALLBACK_ARTIST_NAME = "Unknown artist";

function getArtistDisplayName(artist: { name?: string | null } | null | undefined): string {
  const name = artist?.name?.trim();
  return name || FALLBACK_ARTIST_NAME;
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
  title: string;
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

// --- Artworks / artists tables ---

/** Artist row from DB for artist pages/listing. */
export interface ArtistRow {
  id: number;
  name: string;
  slug: string;
  bio: string | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ArtistFromApi {
  id: number;
  name: string;
  slug: string;
  bio: string | null;
  imageUrl: string | null;
}

/** Relation when selecting artworks with artists (slug for routing). */
export type ArtworkRowArtist = { name: string; bio: string | null; image_url: string | null; slug?: string } | null;

/** Row from artworks table (snake_case). Use with .select(..., artists(name,bio,image_url,slug)). */
export interface ArtworkRow {
  id: number;
  title: string;
  image_url: string;
  status: ArtworkStatus;
  price_usd: number | null;
  dimensions?: string | null;
  weight_kg?: number | null;
  width_cm?: number | null;
  height_cm?: number | null;
  depth_cm?: number | null;
  artist_id: number;
  year?: string | null;
  medium?: string | null;
  created_at?: string;
  updated_at?: string;
  artists: ArtworkRowArtist;
}

function mapArtistRowToArtist(row: ArtistRow): ArtistFromApi {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    bio: row.bio ?? null,
    imageUrl: row.image_url?.trim() || null,
  };
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
    artistName: getArtistDisplayName(row.artists),
    artistBio: row.artists?.bio ?? null,
    artistPhoto: row.artists?.image_url ?? null,
    year: row.year ?? null,
    medium: row.medium ?? null,
    available: isAvailableStatus(row.status),
  };
}

/** Maps artwork row to WorkFromApi. */
function mapArtworkRowToWork(row: ArtworkRow): WorkFromApi {
  const priceUsd = row.price_usd ?? 0;
  const artistSlug = (row.artists as { slug?: string } | null)?.slug ?? "";
  return {
    id: row.id,
    title: row.title,
    price_usd: priceUsd,
    priceDisplay: formatPriceUSD(priceUsd),
    imagenUrl: row.image_url,
    status: row.status,
    available: isAvailableStatus(row.status),
    artistName: getArtistDisplayName(row.artists),
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

/** Fetches works from artworks table. */
async function fetchWorksFromArtworks(sb: import("@supabase/supabase-js").SupabaseClient, artistSlug?: string): Promise<WorkFromApi[]> {
  const select = artistSlug
    ? "id,title,image_url,status,price_usd,artist_id,year,medium,dimensions,weight_kg,width_cm,height_cm,depth_cm,artists!inner(name,slug)"
    : "id,title,image_url,status,price_usd,artist_id,year,medium,dimensions,weight_kg,width_cm,height_cm,depth_cm,artists(name,slug)";
  let query = sb.from("artworks").select(select).order("id", { ascending: true });
  if (artistSlug) query = query.eq("artists.slug", artistSlug);
  const { data, error } = await query;
  if (error) throw new Error(error.message ?? "Could not load works from artworks");
  return ((data ?? []) as ArtworkRow[]).map((row) => mapArtworkRowToWork(row));
}

/** Fetches a single work from artworks by id. */
async function fetchWorkFromArtworks(sb: import("@supabase/supabase-js").SupabaseClient, id: number): Promise<WorkFromApi | null> {
  const select =
    "id,title,image_url,status,price_usd,artist_id,year,medium,dimensions,weight_kg,width_cm,height_cm,depth_cm,artists(name,slug)";
  const { data, error } = await sb.from("artworks").select(select).eq("id", id).single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message ?? "Could not load work from artworks");
  }
  if (!data) return null;
  return mapArtworkRowToWork(data as ArtworkRow);
}

/** Fetch artworks from Supabase (table artworks). */
export async function getArtworks(artistId?: number): Promise<ArtworkFromApi[]> {
  const { supabase, isSupabaseConfigured } = await import("@/lib/supabaseClient");
  if (!isSupabaseConfigured || !supabase) return [];
  const select = "id,title,image_url,status,price_usd,artist_id,year,medium,artists(name,bio,image_url)";
  let query = supabase.from("artworks").select(select).order("id", { ascending: true });
  if (artistId != null) query = query.eq("artist_id", artistId);
  const { data, error } = await query;
  if (error) throw new Error(error.message ?? "Could not load artworks");
  return (data ?? []).map(mapArtworkRowToArtwork);
}

export async function getArtists(): Promise<ArtistFromApi[]> {
  const { supabase, isSupabaseConfigured } = await import("@/lib/supabaseClient");
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase.from("artists").select("id,name,slug,bio,image_url").order("name", { ascending: true });
  if (error) throw new Error(error.message ?? "Could not load artists");
  return (data ?? []).map((row) => mapArtistRowToArtist(row as ArtistRow));
}

export async function getAvailableCount(): Promise<number> {
  const { supabase, isSupabaseConfigured } = await import("@/lib/supabaseClient");
  if (!isSupabaseConfigured || !supabase) return 0;

  const { count, error } = await supabase
    .from("artworks")
    .select("id", { count: "exact", head: true })
    .eq("status", "available");

  if (error) throw new Error(error.message ?? "Could not load available artworks count");
  return count ?? 0;
}

export async function getArtistBySlug(slug: string): Promise<ArtistFromApi | null> {
  const { supabase, isSupabaseConfigured } = await import("@/lib/supabaseClient");
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from("artists").select("id,name,slug,bio,image_url").eq("slug", slug).single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message ?? "Could not load artist");
  }
  return data ? mapArtistRowToArtist(data as ArtistRow) : null;
}

/** Total rows in `artworks` (no filters, no join). Prefer for stats; avoids empty client arrays from RLS/join issues. */
export async function getWorksTotalCount(): Promise<number | null> {
  const { supabase, isSupabaseConfigured } = await import("@/lib/supabaseClient");
  if (!isSupabaseConfigured || !supabase) return null;
  const { count, error } = await supabase
    .from("artworks")
    .select("*", { count: "exact", head: true });
  if (error) return null;
  return count ?? null;
}

export async function getWorks(artistSlug?: string): Promise<WorkFromApi[]> {
  const { supabase, isSupabaseConfigured } = await import("@/lib/supabaseClient");
  if (!isSupabaseConfigured || !supabase) return [];
  return fetchWorksFromArtworks(supabase, artistSlug);
}

export async function getLatestWorks(limit = 20): Promise<WorkFromApi[]> {
  const { supabase, isSupabaseConfigured } = await import("@/lib/supabaseClient");
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from("artworks")
    .select(
      "id,title,image_url,status,price_usd,artist_id,year,medium,dimensions,weight_kg,width_cm,height_cm,depth_cm,artists(name,slug)"
    )
    .order("id", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message ?? "Could not load latest works");

  return ((data ?? []) as ArtworkRow[]).map((row) => mapArtworkRowToWork(row));
}

/** Fetches a single work by id for the detail/sales page. */
export async function getWork(id: number): Promise<WorkFromApi | null> {
  const { supabase, isSupabaseConfigured } = await import("@/lib/supabaseClient");
  if (!isSupabaseConfigured || !supabase) return null;
  return fetchWorkFromArtworks(supabase, id);
}

/** Creates a Checkout Session via the backend API (Express). */
export async function createCheckoutSession(artworkId: number): Promise<{ url: string | null }> {
  const res = await fetch(`${API_BASE}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ artworkId }),
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
export async function createCheckout(artworkId: number): Promise<{ url: string | null }> {
  const { isSupabaseConfigured } = await import("@/lib/supabaseClient");

  if (isSupabaseConfigured) {
    try {
      return await createStripeCheckoutViaEdgeFunction(artworkId);
    } catch (err) {
      console.warn("Supabase Edge Function checkout failed, falling back to Express:", err);
      return createCheckoutSession(artworkId);
    }
  }

  return createCheckoutSession(artworkId);
}

/**
 * Creates a Stripe Checkout Session via Supabase Edge Function "stripe-checkout".
 * Invokes supabase.functions.invoke("stripe-checkout", { body: { artworkId } }).
 * Returns the Stripe URL for redirect; throws CheckoutError with kind for friendly UI.
 */
export async function createStripeCheckoutViaEdgeFunction(artworkId: number): Promise<{ url: string | null }> {
  const { getSupabase } = await import("@/lib/supabaseClient");
  const supabase = getSupabase();
  const { data, error } = await supabase.functions.invoke("stripe-checkout", {
    body: { artworkId },
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
