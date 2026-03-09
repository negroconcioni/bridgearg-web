import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../lib/prisma.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

/** Creates a Stripe Checkout Session with price_usd and metadata (obraId). */
async function createCheckoutSession(obraId: number): Promise<{ url: string | null }> {
  const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";

  const obra = await prisma.obra.findUnique({
    where: { id: obraId },
  });

  if (!obra) {
    throw new Error("Obra no encontrada");
  }

  const status = obra.status?.toLowerCase() ?? "";
  const isAvailable = status === "available" || status === "disponible";
  const isSold = status === "sold" || status === "vendido";
  if (!isAvailable) {
    throw new Error(isSold ? "La obra ya está vendida" : "La obra no está disponible para la compra");
  }

  const priceUsd = obra.priceUsd != null ? Number(obra.priceUsd) : obra.precio / 100;
  const unitAmountCents = Math.round(priceUsd * 100);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: obra.titulo,
            description: `${obra.artistName ?? ""} · ${obra.medium ?? ""}${obra.year ? ` · ${obra.year}` : ""}`.trim(),
            images: obra.imagenUrl.startsWith("http") ? [obra.imagenUrl] : undefined,
          },
          unit_amount: unitAmountCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${clientUrl}/obras?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/obras`,
    shipping_address_collection: {
      allowed_countries: ["AR", "US", "MX", "CO", "ES", "FR", "DE", "GB", "IT"],
    },
    metadata: {
      obra_id: String(obra.id),
    },
  });

  return { url: session.url };
}

router.post("/checkout", async (req: Request, res: Response): Promise<void> => {
  const { obraId } = req.body as { obraId?: number };

  if (typeof obraId !== "number" || obraId < 1) {
    res.status(400).json({ error: "obraId inválido" });
    return;
  }

  try {
    const { url } = await createCheckoutSession(obraId);
    res.status(200).json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al crear la sesión de pago";
    if (message === "Obra no encontrada") {
      res.status(404).json({ error: message });
      return;
    }
    if (message === "La obra ya está vendida" || message === "La obra no está disponible para la compra") {
      res.status(400).json({ error: message });
      return;
    }
    console.error("checkout error:", err);
    res.status(500).json({ error: message });
  }
});

router.post("/create-checkout-session", async (req: Request, res: Response): Promise<void> => {
  const { obraId } = req.body as { obraId?: number };
  if (typeof obraId !== "number" || obraId < 1) {
    res.status(400).json({ error: "obraId inválido" });
    return;
  }
  try {
    const { url } = await createCheckoutSession(obraId);
    res.status(200).json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al crear la sesión de pago";
    if (message === "Obra no encontrada") {
      res.status(404).json({ error: message });
      return;
    }
    if (message === "La obra ya está vendida" || message === "La obra no está disponible para la compra") {
      res.status(400).json({ error: message });
      return;
    }
    console.error("create-checkout-session error:", err);
    res.status(500).json({ error: message });
  }
});

export default router;
