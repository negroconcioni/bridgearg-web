import { Router, Request, Response } from "express";
import { Resend } from "resend";
import { contactEmailHtml } from "../lib/email-template.js";

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const TO = process.env.RESEND_TO_EMAIL ?? "";

function validateContactBody(body: unknown): { name: string; email: string; subject: string; message: string } | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.name !== "string" || !b.name.trim()) return null;
  if (typeof b.email !== "string" || !b.email.trim()) return null;
  if (typeof b.message !== "string" || !b.message.trim()) return null;
  const subject = typeof b.subject === "string" ? b.subject.trim() : "";
  return {
    name: (b.name as string).trim(),
    email: (b.email as string).trim(),
    subject: subject || "Contacto BridgeArg",
    message: (b.message as string).trim(),
  };
}

router.post("/contact", async (req: Request, res: Response): Promise<void> => {
  const payload = validateContactBody(req.body);

  if (!payload) {
    res.status(400).json({ error: "Campos requeridos: nombre, email, mensaje" });
    return;
  }

  if (!TO) {
    console.error("RESEND_TO_EMAIL no configurado");
    res.status(500).json({ error: "Servicio de contacto no configurado" });
    return;
  }

  try {
    const html = contactEmailHtml(payload);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `[BridgeArg] ${payload.subject}`,
      html,
      replyTo: payload.email,
    });

    if (error) {
      console.error("Resend error:", error);
      res.status(500).json({ error: "Error al enviar el mensaje" });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("contact error:", err);
    res.status(500).json({ error: "Error al enviar el mensaje" });
  }
});

export default router;
