import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const obras = [
  { id: 1, titulo: "Sin Título I", precio: 450000, imagenUrl: "bridgearg-work1.jpg", artistSlug: "artista-ejemplo-1", artistName: "Artista Ejemplo 1", year: "2024", medium: "Óleo sobre lienzo", dimensions: "120 x 150 cm", status: "disponible" as const },
  { id: 2, titulo: "Diálogo I", precio: 800000, imagenUrl: "bridgearg-work2.jpg", artistSlug: "artista-ejemplo-2", artistName: "Artista Ejemplo 2", year: "2024", medium: "Instalación", dimensions: "Variable", status: "disponible" as const },
  { id: 3, titulo: "Volumen I", precio: 1200000, imagenUrl: "bridgearg-work3.jpg", artistSlug: "artista-ejemplo-3", artistName: "Artista Ejemplo 3", year: "2024", medium: "Bronce", dimensions: "45 x 30 x 30 cm", status: "disponible" as const },
  { id: 4, titulo: "Acumulación", precio: 180000, imagenUrl: "bridgearg-work4.jpg", artistSlug: "artista-ejemplo-4", artistName: "Artista Ejemplo 4", year: "2024", medium: "Técnica mixta", dimensions: "60 x 80 cm", status: "disponible" as const },
  { id: 5, titulo: "Composición en Azul", precio: 320000, imagenUrl: "bridgearg-work2.jpg", artistSlug: "artista-ejemplo-1", artistName: "Artista Ejemplo 1", year: "2024", medium: "Acrílico sobre lienzo", dimensions: "100 x 100 cm", status: "vendido" as const },
  { id: 6, titulo: "Resonancias", precio: 550000, imagenUrl: "bridgearg-work3.jpg", artistSlug: "artista-ejemplo-2", artistName: "Artista Ejemplo 2", year: "2024", medium: "Video arte", dimensions: "12 min loop", status: "disponible" as const },
];

async function main() {
  for (const o of obras) {
    const { id, ...data } = o;
    await prisma.obra.upsert({
      where: { id },
      create: { id, ...data },
      update: { titulo: data.titulo, precio: data.precio, imagenUrl: data.imagenUrl, artistSlug: data.artistSlug, artistName: data.artistName, year: data.year ?? null, medium: data.medium ?? null, dimensions: data.dimensions ?? null, status: data.status },
    });
  }
  console.log("Seed completed.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
