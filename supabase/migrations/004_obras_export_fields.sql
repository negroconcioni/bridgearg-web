-- Campos para exportación de arte: status (available/reserved/sold), price_usd, dimensiones y peso.
-- Ejecutar en Supabase → SQL Editor (después de 003_obras_artist_fk.sql).

-- 1. Quitar el CHECK antiguo ANTES de cambiar valores (sino los UPDATE violan el constraint)
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT conname FROM pg_constraint WHERE conrelid = 'public.obras'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) LIKE '%status%')
  LOOP
    EXECUTE format('ALTER TABLE public.obras DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

-- 2. Migrar status a valores en inglés
UPDATE public.obras SET status = 'available' WHERE status = 'disponible';
UPDATE public.obras SET status = 'sold' WHERE status = 'vendido';

-- 3. Añadir el nuevo CHECK y default
ALTER TABLE public.obras ADD CONSTRAINT obras_status_check
  CHECK (status IN ('available', 'reserved', 'sold'));
ALTER TABLE public.obras ALTER COLUMN status SET DEFAULT 'available';

-- 4. Precio en USD (dólares, para catálogo/export)
ALTER TABLE public.obras ADD COLUMN IF NOT EXISTS price_usd NUMERIC(12,2);

UPDATE public.obras SET price_usd = ROUND((precio / 100.0)::numeric, 2) WHERE price_usd IS NULL;
ALTER TABLE public.obras ALTER COLUMN price_usd SET NOT NULL;
ALTER TABLE public.obras ALTER COLUMN price_usd SET DEFAULT 0;

COMMENT ON COLUMN public.obras.price_usd IS 'Precio en dólares USD (catálogo/export). precio sigue en centavos para compatibilidad.';

-- 5. Dimensiones para logística (cm)
ALTER TABLE public.obras ADD COLUMN IF NOT EXISTS width_cm  NUMERIC(8,2);
ALTER TABLE public.obras ADD COLUMN IF NOT EXISTS height_cm NUMERIC(8,2);
ALTER TABLE public.obras ADD COLUMN IF NOT EXISTS depth_cm  NUMERIC(8,2);

COMMENT ON COLUMN public.obras.width_cm  IS 'Ancho en cm (logística).';
COMMENT ON COLUMN public.obras.height_cm IS 'Alto en cm (logística).';
COMMENT ON COLUMN public.obras.depth_cm  IS 'Profundidad en cm (logística).';

-- 6. Peso para logística (kg)
ALTER TABLE public.obras ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(10,3);

COMMENT ON COLUMN public.obras.weight_kg IS 'Peso en kg (envío/export).';
