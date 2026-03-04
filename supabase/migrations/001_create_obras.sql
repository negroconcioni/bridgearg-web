-- Tabla obras (catálogo). Ejecutá este archivo en Supabase → SQL Editor → New query.
-- https://supabase.com/dashboard → tu proyecto → SQL Editor

-- Tabla principal
CREATE TABLE IF NOT EXISTS public.obras (
  id BIGSERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  precio INTEGER NOT NULL,
  imagen_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'vendido')),
  artist_slug TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  year TEXT,
  medium TEXT,
  dimensions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para filtros habituales
CREATE INDEX IF NOT EXISTS idx_obras_artist_slug ON public.obras (artist_slug);
CREATE INDEX IF NOT EXISTS idx_obras_status ON public.obras (status);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS obras_updated_at ON public.obras;
CREATE TRIGGER obras_updated_at
  BEFORE UPDATE ON public.obras
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS: lectura pública (anon), escritura solo con service_role o desde backend
ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer obras (catálogo público)
CREATE POLICY "Obras son públicas de lectura"
  ON public.obras FOR SELECT
  USING (true);

-- Solo usuarios autenticados con rol adecuado (o service_role) pueden insertar/actualizar.
-- Si por ahora solo usás el backend para escribir, podés dejar solo esta policy y usar service_role en el server.
CREATE POLICY "Solo service_role puede escribir obras"
  ON public.obras FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Comentario para documentar
COMMENT ON TABLE public.obras IS 'Catálogo de obras; precio en centavos (ej: 450000 = USD 4,500).';
