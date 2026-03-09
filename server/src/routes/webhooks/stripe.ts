import express, { Router, Response } from "express";
import Stripe from "stripe";
import { Resend } from "resend";
import { getSupabase, supabase } from "../../lib/supabase.js";
import { prisma } from "../../lib/prisma.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" });
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
  const artworkIdRaw = session.metadata?.artwork_id;
  const customerEmail = session.customer_details?.email ?? session.customer_email;

  if (!artworkIdRaw) {
    console.warn("checkout.session.completed without metadata.artwork_id");
    res.status(200).send("ok");
    return;
  }

  const artworkId = parseInt(artworkIdRaw, 10);
  if (Number.isNaN(artworkId) || artworkId < 1) {
    res.status(200).send("ok");
    return;
  }

  try {
    if (supabase) {
      const { error } = await supabase.from("artworks").update({ status: "sold" }).eq("id", artworkId);
      if (error) {
        console.error("Supabase update artwork status:", error);
        throw error;
      }
      console.log(`Artwork ${artworkId} marked as sold (Supabase).`);
    } else {
      await prisma.artwork.update({
        where: { id: artworkId },
        data: { status: "sold" },
      });
      console.log(`Artwork ${artworkId} marked as sold (Prisma).`);
    }
  } catch (e) {
    console.error("Error updating artwork status:", e);
    res.status(500).send("Error updating artwork");
    return;
  }

  let artworkTitle = "";
  let artistName = "";
  let yearMedium = "";

  if (supabase) {
    try {
      const { data } = await getSupabase()
        .from("artworks")
        .select("title, year, medium, artists(name)")
        .eq("id", artworkId)
        .single();
      if (data) {
        const artworkFromSupabase = data as {
          title?: string;
          year?: string;
          medium?: string;
          artists?: { name?: string } | null;
        };
        artworkTitle = artworkFromSupabase.title ?? "";
        artistName = artworkFromSupabase.artists?.name ?? "";
        const y = artworkFromSupabase.year;
        const m = artworkFromSupabase.medium;
        yearMedium = [y, m].filter(Boolean).join(" · ");
      }
    } catch (e) {
      console.warn("Could not fetch artwork from Supabase for email:", e);
    }
  }

  if (!artworkTitle && prisma) {
    try {
      const artwork = await prisma.artwork.findUnique({
        where: { id: artworkId },
        select: { title: true, year: true, medium: true, artist: { select: { name: true } } },
      });
      if (artwork) {
        artworkTitle = artwork.title;
        artistName = artwork.artist?.name ?? "";
        yearMedium = [artwork.year, artwork.medium].filter(Boolean).join(" · ");
      }
    } catch (e) {
      console.warn("Could not fetch artwork from Prisma for email:", e);
    }
  }

  if (customerEmail && process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: customerEmail,
        subject: `Your acquisition — ${artworkTitle || "BridgeArg"}`,
        html: buildConfirmationEmailHtml({
          customerEmail,
          artworkTitle: artworkTitle || "Your piece",
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
  artworkTitle: string;
  artistName: string;
  yearMedium: string;
}): string {
  const { artworkTitle, artistName, yearMedium } = params;
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
      <p style="margin: 0; font-size: 18px; font-weight: 600; color: #171717;">${escapeHtml(artworkTitle)}</p>
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
