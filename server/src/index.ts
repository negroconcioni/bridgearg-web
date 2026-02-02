import "dotenv/config";
import express from "express";
import cors from "cors";
import checkoutRouter from "./routes/checkout.js";
import contactRouter from "./routes/contact.js";
import webhookRouter from "./routes/webhook.js";
import worksRouter from "./routes/works.js";

const app = express();
const PORT = process.env.PORT ?? 3000;
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";

// Webhook debe recibir body raw para verificar firma de Stripe
app.use(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  webhookRouter
);

// Resto de rutas usan JSON
app.use(express.json());

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use("/api", worksRouter);
app.use("/api", checkoutRouter);
app.use("/api", contactRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
