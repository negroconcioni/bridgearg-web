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

---

## Seed local (Docker / Supabase CLI)

Para que la tabla **`artworks`** (y `artists`) tenga datos de prueba en tu entorno local:

### Opción A: Reset completo (recomendado)

Desde la raíz del proyecto, con Supabase local levantado (`supabase start`):

```bash
supabase db reset
```

Eso aplica todas las migraciones y ejecuta `supabase/seed.sql`, dejando artistas y obras de prueba en `artworks`.  
Si tu app lee de la tabla **`obras`** en lugar de `artworks`, ejecutá además `seed_artists.sql` y `seed_obras.sql` en el SQL Editor (en ese orden).

### Opción B: Solo ejecutar el seed sin reset

Si ya tenés las migraciones aplicadas y solo querés agregar datos:

1. **Supabase Studio (local):** http://localhost:54323 → SQL Editor → New query → pegá el contenido de `seed_artworks.sql` → Run.
2. **O por terminal:**  
   `psql "postgresql://postgres:postgres@localhost:54322/postgres" -f supabase/seed_artworks.sql`  
   (La URL puede variar; la mostrada es la que suele dar `supabase start`.)

---

## Traer datos de producción a local

Para copiar datos desde tu proyecto Supabase en la nube al entorno local:

### 1. Dump de la base remota

Con el proyecto vinculado (`supabase link --project-ref TU_REF`):

```bash
supabase db dump -f supabase/dump_production.sql
```

Abre `dump_production.sql`, dejá solo los `INSERT` de las tablas que te interesan (por ejemplo `artists` y `artworks`) o las secciones que no entren en conflicto con el schema local, y luego:

```bash
psql "postgresql://postgres:postgres@localhost:54322/postgres" -f supabase/dump_production.sql
```

(Reemplazá la URL por la de tu DB local si es distinta.)

### 2. Exportar/importar desde el Dashboard

- En el **Dashboard de Supabase (producción)** → Table Editor → tabla `artworks` (y `artists` si aplica) → Export as CSV.
- En **Supabase Studio local** (http://localhost:54323) podés crear las filas a mano o usar un script que lea el CSV y haga `INSERT` vía API o SQL.

### 3. Script que lee de producción e inserta en local

Podés escribir un script (Node/TS o similar) que use la **Supabase URL y anon key de producción** para hacer `from('artworks').select('*')` y, con la **URL y service_role key de tu instancia local**, haga los `insert` en `artworks` y `artists`. Así podés filtrar o transformar datos antes de insertar en local.
