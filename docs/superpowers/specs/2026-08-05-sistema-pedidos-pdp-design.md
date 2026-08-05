# Sistema de Pedidos (PDP) Team Uniforms — Documento de diseño (spec)

- **Fecha:** 2026-08-05
- **Proyecto:** Sistema de gestión de pedidos (Product Development Packs) para Team Uniforms
- **Autor:** Lucas Scolari (con asistencia de Claude)
- **Estado:** Aprobado para implementación
- **Relación:** Feature nueva dentro del sitio existente `team-uniforms/` (ver
  `2026-06-24-team-uniforms-web-design.md`).

---

## 1. Resumen

Sistema para que **el cliente de Team Uniforms** gestione muchos **pedidos de desarrollo de
producto (PDP)** que le envía a su fábrica. El cliente entra a un panel con login, crea/edita
pedidos, y cada pedido queda con su **propio link único** en `tu-teamuniforms.com/pedidos/<código>`
que le manda a la fábrica. La fábrica **solo lee** el pedido (por ahora). Toda la sección
`/pedidos/` está **oculta del público** que navega la web principal.

La base visual de cada pedido es la **plantilla PDP** que ya entregó el cliente
(`Team-Uniforms-PDP-Master-Template.html`), que es autocontenida y está construida para
**rellenarse desde objetos de datos JS** (ya tiene funciones de render). Se reutiliza esa
lógica: en lugar de datos fijos, se le inyectan los datos del pedido traídos de Supabase.

## 2. Objetivo y criterios de éxito

- El cliente carga y gestiona pedidos **solo**, sin tocar código.
- Cada pedido tiene un link propio, compartible, que la fábrica abre en solo-lectura.
- La sección no es visible ni indexable para el público.
- Seguridad real: cualquiera con el link lee un pedido **publicado**; solo el cliente
  logueado puede crear/editar/borrar.
- Costo cero (planes gratis de Supabase + Netlify).

## 3. Stack y arquitectura

- **Frontend:** HTML + CSS + JavaScript vanilla (mismo stack del sitio), servido por Netlify.
- **Backend (BaaS):** **Supabase** — Postgres (datos) + Auth (login) + Storage (fotos).
- Tres componentes:
  1. **Panel de admin** (con login) — CRUD de pedidos.
  2. **Página pública de pedido** (solo lectura) — render de un pedido con la plantilla PDP.
  3. **Supabase** — persistencia de datos y archivos.

El frontend se conecta a Supabase con el **JS SDK** usando la **URL del proyecto** + la
**clave anónima (anon key)**. La anon key es pública por diseño; la seguridad la garantiza
**Row Level Security (RLS)**, no el secreto de la clave. **Nunca** se incluye la
service-role key en el frontend.

## 4. Estructura de archivos

```
team-uniforms/
└── pedidos/
    ├── admin/
    │   ├── index.html      Login + lista de pedidos + botón "Nuevo"
    │   ├── editor.html     Formulario crear/editar un pedido
    │   └── admin.js        Auth + CRUD + subida de fotos (Supabase SDK)
    ├── ver.html            Estructura de la plantilla PDP (contenedores vacíos)
    ├── ver.js              Trae el pedido de Supabase y llena la plantilla
    ├── pedidos.css         Estilos de la plantilla PDP (extraídos del HTML original)
    └── supabase.js         Config del cliente Supabase (URL + anon key) — compartido
```

- El **Supabase JS SDK** se carga por CDN permitido (`https://esm.sh/@supabase/supabase-js`
  o `https://cdn.jsdelivr.net/...`) — no se instala nada localmente (sin build).
- `pedidos.css` sale de extraer el `<style>` de la plantilla PDP original, sin cambios de
  diseño.

## 5. URLs y ruteo (Netlify)

- **Panel:** `/pedidos/admin/` → sirve `pedidos/admin/index.html` (archivo real, tiene
  prioridad sobre el wildcard).
- **Pedido público:** `/pedidos/<código>` → redirect 200 de Netlify a
  `/pedidos/ver.html?id=<código>`.
- Reglas en `netlify.toml`. **IMPORTANTE:** el `netlify.toml` actual ya tiene un catch-all
  `from = "/*"  to = "/index.html"  status = 200`. La regla de pedidos **debe ir ANTES** de
  ese catch-all (Netlify procesa los redirects de arriba hacia abajo), o si no el catch-all
  se traga los links de pedido y muestra la web principal.
  ```toml
  # ANTES del catch-all /* existente:
  [[redirects]]
    from = "/pedidos/:id"
    to = "/pedidos/ver.html?id=:id"
    status = 200
  ```
  Como `/pedidos/admin/`, `/pedidos/ver.html`, etc. son archivos reales, se sirven directo;
  el wildcard `/pedidos/:id` solo actúa para los códigos de pedido.
- El **código** de cada pedido es un token aleatorio no adivinable (ej: 12+ caracteres
  URL-safe, o el UUID de Supabase). No secuencial → no se puede enumerar.

## 6. Modelo de datos

### Tabla `pedidos`
| Columna | Tipo | Uso |
|---|---|---|
| `id` | uuid (PK, default gen_random_uuid) | Código único del pedido, va en la URL |
| `creado` | timestamptz (default now) | Fecha de creación |
| `actualizado` | timestamptz | Última edición |
| `estado` | text (`borrador` \| `publicado`) | Controla visibilidad pública |
| `producto` | text | Nombre del producto (para el listado y el hero) |
| `codigo` | text | Código de producto (ej: TU-W…) |
| `contenido` | jsonb | Resto de los datos editables (ver abajo) |

### Estructura de `contenido` (jsonb)
Mapea a lo que la plantilla PDP ya sabe renderizar:
- `hero`: texto del titular / bajada del producto.
- `brief`: texto del brief.
- `materiales`: array de strings (tags de materiales).
- `poms`: array de `[medida, target]` (tabla de medidas).
- `detalles`: array de `{ imagen, titulo, descripcion }` (cards de construcción).
- `fotoReferencia`: URL de la foto principal.
- `flatLimpio`: URL del flat técnico limpio.
- `flatPom`: URL del flat técnico con puntos de medida.

> **Fijo como plantilla (NO se guarda por pedido):** objetivo, do's & don'ts, timeline, y las
> categorías del sistema de puntaje. Viven como constantes en el código de `ver.html`.

### Storage
- Bucket `pedidos-fotos` (público de lectura).
- Cada foto subida guarda su **URL pública** en el `contenido` del pedido.
- Ruta sugerida: `pedidos-fotos/<id-del-pedido>/<nombre-archivo>`.

## 7. Seguridad (RLS y Storage)

**Tabla `pedidos`:**
- `SELECT`: permitido a `anon` **solo** cuando `estado = 'publicado'`; permitido a
  `authenticated` siempre (para que el cliente vea sus borradores en el panel).
- `INSERT` / `UPDATE` / `DELETE`: **solo** rol `authenticated`.

**Storage `pedidos-fotos`:**
- Lectura pública (para que la fábrica vea las fotos por el link).
- Escritura/borrado: solo `authenticated`.

**Auth:**
- Email + password. **Un solo usuario** (el cliente). Se crea desde el panel de Supabase o
  con un alta única; la contraseña la define el cliente (no se hardcodea).
- Las páginas de `/pedidos/admin/` verifican sesión activa; si no hay, redirigen al login.

**Claves:**
- `supabase.js` contiene la URL del proyecto + la **anon key** (pública, correcto).
- La service-role key **no** aparece en ningún archivo del frontend.

## 8. Ocultamiento del público

- Ningún link a `/pedidos/` desde la web principal (ni menú, ni footer).
- `<meta name="robots" content="noindex,nofollow">` en todas las páginas de `/pedidos/`.
- `robots.txt` en la raíz con `Disallow: /pedidos/`.
- No se incluye `/pedidos/` en ningún sitemap.
- Códigos de pedido aleatorios no adivinables; panel detrás de login.

## 9. Flujo de uso

1. Cliente entra a `/pedidos/admin/` → login (email + password).
2. Ve la **lista** de sus pedidos: producto, código, fecha, estado. Acciones: Nuevo, Editar,
   Publicar/Despublicar, Copiar link, Borrar.
3. **Nuevo pedido** → `editor.html`: llena producto/código, textos, materiales, tabla de
   medidas, sube fotos (referencia, flats, detalles). Guarda como **borrador**.
4. Cuando está listo → **Publicar** → obtiene el link `/pedidos/<id>`.
5. Copia el link y se lo manda a la fábrica (WhatsApp/mail).
6. La fábrica abre el link → `ver.html` renderiza el pedido en **solo lectura**.
7. El cliente puede editar/borrar/despublicar en cualquier momento.

## 10. Manejo de errores

- Login incorrecto → mensaje claro, sin exponer detalles.
- Sesión vencida en el panel → redirección al login.
- Pedido inexistente o en borrador accedido por anónimo → página "Pedido no disponible".
- Fallo al subir una foto → mensaje + posibilidad de reintentar; no se pierde lo ya cargado.
- Supabase inaccesible / sin conexión → mensaje de error amable en vez de pantalla rota.

## 11. Testing / verificación

Sitio estático: **verificación manual en el navegador** (igual que el sitio principal, sin
framework de tests). Flujos a verificar:
- Crear, editar, publicar, despublicar y borrar un pedido.
- Render público correcto de un pedido publicado (todas las secciones y fotos).
- Que un pedido en **borrador** NO sea accesible por link anónimo (prueba de RLS).
- Que sin login no se pueda entrar al panel ni escribir en la base (prueba de seguridad).
- Responsive del panel y del pedido en desktop/tablet/mobile.

## 12. Fuera de alcance (YAGNI / fase 2)

- Que la fábrica responda o cargue puntajes que queden guardados (por ahora el puntaje es
  solo visual, no se persiste).
- Duplicar un pedido como plantilla base.
- Gestión de múltiples usuarios / roles del equipo del cliente.
- Exportar a PDF desde el panel (la plantilla ya tiene estilos de impresión si hiciera falta).
- Notificaciones automáticas a la fábrica.

## 13. Constraints del proyecto

- Sin frameworks ni build: HTML/CSS/JS vanilla + Supabase JS SDK vía CDN permitido.
- Idioma: español (términos técnicos textiles en inglés donde corresponda).
- No modificar el diseño de la plantilla PDP entregada por el cliente; solo alimentarla con datos.
- No romper ni exponer el sitio público principal.
- Costo cero (planes gratuitos).
