-- Opcional: obras de ejemplo. Ejecutar después de 002 y 003 (y después de seed_artists si usás datos de ejemplo).
-- Ajustá imagen_url si usás Storage o URLs externas.
-- artist_id se resuelve por slug (tabla artists debe tener esos slugs).

-- status: use English values (available | reserved | sold) to match Prisma schema and backend
INSERT INTO public.obras (titulo, precio, imagen_url, artist_id, artist_slug, year, medium, dimensions, status)
VALUES
  ('Sin Título I', 450000, 'bridgearg-work1.jpg', (SELECT id FROM public.artists WHERE slug = 'artista-ejemplo-1' LIMIT 1), 'artista-ejemplo-1', '2024', 'Óleo sobre lienzo', '120 x 150 cm', 'available'),
  ('Diálogo I', 800000, 'bridgearg-work2.jpg', (SELECT id FROM public.artists WHERE slug = 'artista-ejemplo-2' LIMIT 1), 'artista-ejemplo-2', '2024', 'Instalación', 'Variable', 'available'),
  ('Volumen I', 1200000, 'bridgearg-work3.jpg', (SELECT id FROM public.artists WHERE slug = 'artista-ejemplo-3' LIMIT 1), 'artista-ejemplo-3', '2024', 'Bronce', '45 x 30 x 30 cm', 'available'),
  ('Acumulación', 180000, 'bridgearg-work4.jpg', (SELECT id FROM public.artists WHERE slug = 'artista-ejemplo-4' LIMIT 1), 'artista-ejemplo-4', '2024', 'Técnica mixta', '60 x 80 cm', 'available'),
  ('Composición en Azul', 320000, 'bridgearg-work2.jpg', (SELECT id FROM public.artists WHERE slug = 'artista-ejemplo-1' LIMIT 1), 'artista-ejemplo-1', '2024', 'Acrílico sobre lienzo', '100 x 100 cm', 'sold'),
  ('Resonancias', 550000, 'bridgearg-work3.jpg', (SELECT id FROM public.artists WHERE slug = 'artista-ejemplo-2' LIMIT 1), 'artista-ejemplo-2', '2024', 'Video arte', '12 min loop', 'available');
