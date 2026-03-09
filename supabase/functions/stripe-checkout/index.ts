// Supabase Edge Function: creates a Stripe Checkout Session from artwork in `artworks` table.
// Runs on Deno (Supabase Cloud). Imports from https://esm.sh/
// Secrets: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CLIENT_URL (required in production)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=denonext";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-11-20",
});

const LOCALHOST_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];

function getAllowedOrigins(): string[] {
  const origins = [...LOCALHOST_ORIGINS];
  const clientUrl = Deno.env.get("CLIENT_URL");
  if (clientUrl?.trim()) {
    try {
      const origin = new URL(clientUrl.replace(/\/$/, "")).origin;
      if (origin && !origins.includes(origin)) origins.push(origin);
    } catch (_e) {
      // ignore invalid URL
    }
  }
  const extra = Deno.env.get("CORS_ORIGIN");
  if (extra?.trim() && !origins.includes(extra.trim())) origins.push(extra.trim());
  return origins;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  const allowed = getAllowedOrigins();
  const allowOrigin = allowed.includes(origin) ? origin : (Deno.env.get("CORS_ORIGIN") ?? "*");
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Max-Age": "86400",
  };
}

function withCors(req: Request, headers: Record<string, string> = {}): Record<string, string> {
  return { ...getCorsHeaders(req), ...headers };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: getCorsHeaders(req) });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: withCors(req, { "Content-Type": "application/json" }),
    });
  }

  let body: { obraId?: number; artworkId?: number };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: withCors(req, { "Content-Type": "application/json" }),
    });
  }

  const artworkId = body.artworkId ?? body.obraId;
  if (typeof artworkId !== "number" || artworkId < 1) {
    return new Response(JSON.stringify({ error: "obraId or artworkId required (number >= 1)" }), {
      status: 400,
      headers: withCors(req, { "Content-Type": "application/json" }),
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseServiceRole) {
    return new Response(JSON.stringify({ error: "Server configuration error" }), {
      status: 500,
      headers: withCors(req, { "Content-Type": "application/json" }),
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRole);

  const { data: artwork, error: fetchError } = await supabase
    .from("artworks")
    .select("id, title, image_url, status, price_usd, year, medium, artists(name)")
    .eq("id", artworkId)
    .single();

  if (fetchError || !artwork) {
    return new Response(JSON.stringify({ error: "Artwork not found" }), {
      status: 404,
      headers: withCors(req, { "Content-Type": "application/json" }),
    });
  }

  if ((artwork as { status?: string }).status !== "available") {
    return new Response(JSON.stringify({ error: "Artwork is not available for purchase" }), {
      status: 400,
      headers: withCors(req, { "Content-Type": "application/json" }),
    });
  }

  const priceUsd = Number((artwork as { price_usd?: number }).price_usd ?? 0);
  const unitAmountCents = Math.round(priceUsd * 100);
  const title = (artwork as { title: string }).title;
  const imageUrl = (artwork as { image_url: string }).image_url;
  const year = (artwork as { year?: string }).year;
  const medium = (artwork as { medium?: string }).medium;
  const artistName = ((artwork as { artists?: { name: string } }).artists?.name) ?? "";
  const description = [artistName, medium, year].filter(Boolean).join(" · ");

  const clientUrl = (Deno.env.get("CLIENT_URL") ?? "http://localhost:5173").replace(/\/$/, "");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              description: description || undefined,
              images: imageUrl.startsWith("http") ? [imageUrl] : undefined,
            },
            unit_amount: unitAmountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${clientUrl}/obras?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/obras`,
      metadata: {
        artwork_id: String(artworkId),
      },
      shipping_address_collection: {
        allowed_countries: ["AR", "US", "MX", "CO", "ES", "FR", "DE", "GB", "IT"],
      },
    });

    return new Response(JSON.stringify({ url: session.url ?? null }), {
      status: 200,
      headers: withCors(req, { "Content-Type": "application/json" }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create checkout session";
    console.error("stripe-checkout error:", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: withCors(req, { "Content-Type": "application/json" }),
    });
  }
});
