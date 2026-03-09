import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

function mapObraToJson(o: {
  id: number;
  titulo: string;
  precio: number;
  priceUsd: unknown;
  imagenUrl: string;
  status: string;
  artistName: string | null;
  artistSlug: string;
  year: string | null;
  medium: string | null;
  dimensions: string | null;
  weightKg: unknown;
  widthCm: unknown;
  heightCm: unknown;
  depthCm: unknown;
}) {
  const priceUsd = o.priceUsd != null ? Number(o.priceUsd) : o.precio / 100;
  return {
    id: o.id,
    titulo: o.titulo,
    precio: o.precio,
    price_usd: priceUsd,
    priceDisplay: `USD ${Number(priceUsd).toLocaleString("en-US")}`,
    imagenUrl: o.imagenUrl,
    status: o.status,
    available: o.status === "available" || o.status === "disponible",
    artistName: o.artistName ?? "",
    artistSlug: o.artistSlug,
    year: o.year,
    medium: o.medium,
    dimensions: o.dimensions,
    weight_kg: o.weightKg != null ? Number(o.weightKg) : null,
    width_cm: o.widthCm != null ? Number(o.widthCm) : null,
    height_cm: o.heightCm != null ? Number(o.heightCm) : null,
    depth_cm: o.depthCm != null ? Number(o.depthCm) : null,
  };
}

router.get("/works", async (req: Request, res: Response): Promise<void> => {
  const artistSlug = typeof req.query.artistSlug === "string" ? req.query.artistSlug : undefined;

  try {
    const obras = await prisma.obra.findMany({
      where: artistSlug ? { artistSlug } : undefined,
      orderBy: { id: "asc" },
    });
    res.status(200).json(obras.map(mapObraToJson));
  } catch (err) {
    console.error("GET /works error:", err);
    res.status(500).json({ error: "Error al listar obras" });
  }
});

router.get("/works/:id", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id) || id < 1) {
    res.status(400).json({ error: "Invalid work id" });
    return;
  }
  try {
    const obra = await prisma.obra.findUnique({ where: { id } });
    if (!obra) {
      res.status(404).json({ error: "Work not found" });
      return;
    }
    res.status(200).json(mapObraToJson(obra));
  } catch (err) {
    console.error("GET /works/:id error:", err);
    res.status(500).json({ error: "Error loading work" });
  }
});

export default router;
