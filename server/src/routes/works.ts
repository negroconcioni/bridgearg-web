import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/works", async (req: Request, res: Response): Promise<void> => {
  const artistSlug = typeof req.query.artistSlug === "string" ? req.query.artistSlug : undefined;

  try {
    const obras = await prisma.obra.findMany({
      where: artistSlug ? { artistSlug } : undefined,
      orderBy: { id: "asc" },
    });

    const list = obras.map((o) => ({
      id: o.id,
      titulo: o.titulo,
      precio: o.precio,
      priceDisplay: `USD ${(o.precio / 100).toLocaleString("en-US")}`,
      imagenUrl: o.imagenUrl,
      status: o.status,
      available: o.status === "disponible",
      artistName: o.artistName,
      artistSlug: o.artistSlug,
      year: o.year,
      medium: o.medium,
      dimensions: o.dimensions,
    }));

    res.status(200).json(list);
  } catch (err) {
    console.error("GET /works error:", err);
    res.status(500).json({ error: "Error al listar obras" });
  }
});

export default router;
