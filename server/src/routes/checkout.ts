import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../lib/prisma.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

router.post("/create-checkout-session", async (req: Request, res: Response): Promise<void> => {
  const { obraId } = req.body as { obraId?: number };

  if (typeof obraId !== "number" || obraId < 1) {
    res.status(400).json({ error: "obraId inválido" });
    return;
  }

  const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";

  try {
    const obra = await prisma.obra.findUnique({
      where: { id: obraId },
    });

    if (!obra) {
      res.status(404).json({ error: "Obra no encontrada" });
      return;
    }

    if (obra.status === "vendido") {
      res.status(400).json({ error: "La obra ya está vendida" });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: obra.titulo,
              description: `${obra.artistName} · ${obra.medium ?? ""}${obra.year ? ` · ${obra.year}` : ""}`.trim(),
              images: obra.imagenUrl.startsWith("http") ? [obra.imagenUrl] : undefined,
            },
            unit_amount: obra.precio,
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

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    res.status(500).json({ error: "Error al crear la sesión de pago" });
  }
});

export default router;
