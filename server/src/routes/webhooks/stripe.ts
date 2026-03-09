import express, { Router, Response } from "express";
import Stripe from "stripe";
import { Resend } from "resend";
import { getSupabase, supabase } from "../../lib/supabase.js";
import { prisma } from "../../lib/prisma.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

type RequestWithRawBody = express.Request & { body?: Buffer };

router.post("/", async (req: express.Request, res: Response): Promise<void> => {
  const rawBody = (req as RequestWithRawBody).body;

  if (!rawBody) {
    res.status(400).send("Missing body");
    return;
  }

  const sig = req.headers["stripe-signature"];
  if (!sig || !webhookSecret) {
    res.status(400).send("Missing stripe-signature or STRIPE_WEBHOOK_SECRET");
    return;
  }

  let event: Stripe.Event;
  try {
    const payload = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(JSON.stringify(rawBody));
    event = stripe.webhooks.constructEvent(payload, sig as string, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    res.status(400).send(`Webhook Error: ${message}`);
    return;
  }

  if (event.type !== "checkout.session.completed") {
    res.status(200).send("ok");
    return;
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const obraIdRaw = session.metadata?.obra_id;
  const customerEmail = session.customer_details?.email ?? session.customer_email;

  if (!obraIdRaw) {
    console.warn("checkout.session.completed without metadata.obra_id");
    res.status(200).send("ok");
    return;
  }

  const obraId = parseInt(obraIdRaw, 10);
  if (Number.isNaN(obraId) || obraId < 1) {
    res.status(200).send("ok");
    return;
  }

  try {
    if (supabase) {
      const { error } = await supabase.from("obras").update({ status: "sold" }).eq("id", obraId);
      if (error) {
        console.error("Supabase update obra status:", error);
        throw error;
      }
      console.log(`Obra ${obraId} marked as sold (Supabase).`);
    } else {
      await prisma.obra.update({
        where: { id: obraId },
        data: { status: "sold" },
      });
      console.log(`Obra ${obraId} marked as sold (Prisma).`);
    }
  } catch (e) {
    console.error("Error updating obra status:", e);
    res.status(500).send("Error updating obra");
    return;
  }

  let obraTitle = "";
  let artistName = "";
  let yearMedium = "";

  if (supabase) {
    try {
      const { data } = await getSupabase()
        .from("obras")
        .select("titulo, year, medium, artists(name)")
        .eq("id", obraId)
        .single();
      if (data) {
        obraTitle = (data as { titulo?: string }).titulo ?? "";
        const a = (data as { artists?: { name: string } }).artists;
        artistName = a?.name ?? "";
        const y = (data as { year?: string }).year;
        const m = (data as { medium?: string }).medium;
        yearMedium = [y, m].filter(Boolean).join(" · ");
      }
    } catch (e) {
      console.warn("Could not fetch obra from Supabase for email:", e);
    }
  }

  if (!obraTitle && prisma) {
    try {
      const obra = await prisma.obra.findUnique({
        where: { id: obraId },
        select: { titulo: true, artistName: true, year: true, medium: true },
      });
      if (obra) {
        obraTitle = obra.titulo;
        artistName = obra.artistName ?? "";
        yearMedium = [obra.year, obra.medium].filter(Boolean).join(" · ");
      }
    } catch (e) {
      console.warn("Could not fetch obra from Prisma for email:", e);
    }
  }

  if (customerEmail && process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: customerEmail,
        subject: `Your acquisition — ${obraTitle || "BridgeArg"}`,
        html: buildConfirmationEmailHtml({
          customerEmail,
          obraTitle: obraTitle || "Your piece",
          artistName,
          yearMedium,
        }),
      });
      console.log(`Confirmation email sent to ${customerEmail}.`);
    } catch (e) {
      console.error("Resend confirmation email failed:", e);
    }
  }

  res.status(200).send("ok");
});

function buildConfirmationEmailHtml(params: {
  customerEmail: string;
  obraTitle: string;
  artistName: string;
  yearMedium: string;
}): string {
  const { obraTitle, artistName, yearMedium } = params;
  const line2 = [artistName, yearMedium].filter(Boolean).join(" · ");
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acquisition confirmed</title>
</head>
<body style="margin:0; font-family: Georgia, 'Times New Roman', serif; background: #f5f5f4; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; padding: 48px 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
    <p style="margin:0 0 8px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #737373;">BridgeArg</p>
    <h1 style="margin: 0 0 24px; font-size: 28px; font-weight: 600; color: #171717; line-height: 1.2;">Thank you for your acquisition</h1>
    <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.6; color: #404040;">Your purchase has been confirmed. We will be in touch regarding shipping and documentation.</p>
    <div style="border: 1px solid #e5e5e5; padding: 24px; margin-bottom: 32px;">
      <p style="margin: 0 0 4px; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #737373;">Piece</p>
      <p style="margin: 0; font-size: 18px; font-weight: 600; color: #171717;">${escapeHtml(obraTitle)}</p>
      ${line2 ? `<p style="margin: 8px 0 0; font-size: 14px; color: #525252;">${escapeHtml(line2)}</p>` : ""}
    </div>
    <p style="margin: 0; font-size: 13px; color: #737373;">White-glove international shipping and export documentation are included. You will receive a Certificate of Authenticity—physical and digital—signed by the artist.</p>
    <p style="margin: 24px 0 0; font-size: 13px; color: #737373;">With care,<br><strong>BridgeArg</strong></p>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default router;
