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

export async function getWorks(artistSlug?: string): Promise<WorkFromApi[]> {
  const url = artistSlug ? `${API_BASE}/api/works?artistSlug=${encodeURIComponent(artistSlug)}` : `${API_BASE}/api/works`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al cargar obras");
  return res.json();
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
