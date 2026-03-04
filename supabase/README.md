# Supabase – Tablas y migraciones

## Subir la tabla `obras` a Supabase

1. Entrá al [Dashboard de Supabase](https://supabase.com/dashboard) → tu proyecto.
2. En el menú izquierdo: **SQL Editor** → **New query**.
3. Copiá y pegá todo el contenido de `migrations/001_create_obras.sql`.
4. Clic en **Run** (o Ctrl+Enter).
5. *(Opcional)* Para cargar datos de ejemplo: nueva query, pegá el contenido de `seed_obras.sql` y ejecutá.

Listo: la tabla `public.obras` queda creada con RLS (lectura pública, escritura solo con `service_role`).

## Estructura de `obras`

| Columna      | Tipo        | Descripción                          |
|-------------|-------------|--------------------------------------|
| id          | bigint      | Autoincremental, PK                  |
| titulo      | text        | Título de la obra                    |
| precio      | integer     | En centavos (ej: 450000 = USD 4,500) |
| imagen_url  | text        | URL o path de la imagen              |
| status      | text        | `disponible` \| `vendido`            |
| artist_slug  | text        | Slug del artista                     |
| artist_name | text        | Nombre del artista                   |
| year        | text        | Opcional                             |
| medium      | text        | Opcional                             |
| dimensions  | text        | Opcional                             |
| created_at  | timestamptz |                                      |
| updated_at  | timestamptz |                                      |

Para leer estas obras desde el frontend con el cliente Supabase (anon key), usá `getSupabase().from('obras').select('*')`; la policy permite `SELECT` a todos.
