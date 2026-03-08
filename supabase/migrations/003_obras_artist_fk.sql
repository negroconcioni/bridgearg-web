-- Normalizar obras: artist_id → artists. Ejecutar después de 002_create_artists.sql.
-- Crea artists desde datos existentes en obras, añade FK y elimina artist_name (si existe).

-- 1. Poblar artists desde obras (con o sin columna artist_name)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'obras' AND column_name = 'artist_name'
  ) THEN
    INSERT INTO public.artists (name, slug)
    SELECT DISTINCT o.artist_name, o.artist_slug
    FROM public.obras o
    WHERE NOT EXISTS (SELECT 1 FROM public.artists a WHERE a.slug = o.artist_slug);
  ELSE
    INSERT INTO public.artists (name, slug)
    SELECT DISTINCT o.artist_slug, o.artist_slug
    FROM public.obras o
    WHERE NOT EXISTS (SELECT 1 FROM public.artists a WHERE a.slug = o.artist_slug);
  END IF;
END $$;

-- 2. Añadir columna artist_id (nullable de momento)
ALTER TABLE public.obras ADD COLUMN IF NOT EXISTS artist_id BIGINT;

-- 3. Rellenar artist_id desde artist_slug
UPDATE public.obras o
SET artist_id = (SELECT a.id FROM public.artists a WHERE a.slug = o.artist_slug)
WHERE o.artist_id IS NULL;

-- 4. Hacer NOT NULL y añadir FK
ALTER TABLE public.obras ALTER COLUMN artist_id SET NOT NULL;
ALTER TABLE public.obras
  ADD CONSTRAINT fk_obras_artist
  FOREIGN KEY (artist_id) REFERENCES public.artists(id);

-- 5. Eliminar columna artist_name (mantenemos artist_slug para routing)
ALTER TABLE public.obras DROP COLUMN IF EXISTS artist_name;

-- 6. Índice para filtros por artista
CREATE INDEX IF NOT EXISTS idx_obras_artist_id ON public.obras (artist_id);
