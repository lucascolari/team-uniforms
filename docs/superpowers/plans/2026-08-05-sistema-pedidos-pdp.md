# Sistema de Pedidos (PDP) — Plan de implementación

> **Para quien ejecuta:** se construye tarea por tarea; cada tarea termina con una
> **verificación manual en el navegador** (o de seguridad) y un `commit`. No hay tests
> automáticos: es frontend estático + Supabase. Los pasos usan checkbox (`- [ ]`).
> **Algunas tareas tienen pasos manuales** en el panel de Supabase (crear proyecto, correr
> SQL) que hace el dueño del proyecto — están marcados con 🧑‍💻 MANUAL.

**Goal:** Que el cliente gestione muchos pedidos (PDP) desde un panel con login, cada uno con
su link propio en `/pedidos/<id>`, que la fábrica abre en solo lectura. Oculto del público.

**Architecture:** Frontend estático (HTML/CSS/JS vanilla, módulos ES) en Netlify + Supabase
(Postgres + Auth + Storage). El panel `/pedidos/admin/` hace CRUD con login; `/pedidos/ver.html`
renderiza un pedido reutilizando la plantilla PDP del cliente, alimentada con datos de Supabase.

**Tech Stack:** HTML5, CSS3, JavaScript ES modules, Supabase JS SDK v2 (vía `https://esm.sh`,
sin build), Netlify (hosting + redirects).

## Global Constraints

- **Sin build ni frameworks:** HTML/CSS/JS vanilla. El SDK de Supabase se importa como módulo
  ES desde `https://esm.sh/@supabase/supabase-js@2`.
- **Sin atribución de autoría** en ningún archivo, comentario ni commit (regla del proyecto).
- **Idioma:** español (términos textiles en inglés donde corresponda).
- **No modificar el diseño** de la plantilla PDP del cliente; solo alimentarla con datos.
- **Seguridad:** RLS en Supabase — `anon` lee solo pedidos `publicado`; escritura solo
  `authenticated`. La **anon key** es pública (va en el frontend); la **service-role key NUNCA**
  va al frontend.
- **Oculto del público:** `<meta name="robots" content="noindex,nofollow">` en toda página de
  `/pedidos/`; `robots.txt` ya tiene `Disallow: /pedidos/`; ningún link desde la web principal.
- **Ruteo:** la regla `/pedidos/:id` en `netlify.toml` debe ir **antes** del catch-all `/*`.
- **Esquema de datos (fuente única de verdad):** tabla `pedidos` con columnas
  `id uuid`, `creado timestamptz`, `actualizado timestamptz`, `estado text`,
  `producto text`, `codigo text`, `contenido jsonb`. El `contenido` tiene la forma:
  ```json
  {
    "hero": "", "brief": "",
    "materiales": [],
    "poms": [["medida","target"]],
    "detalles": [{"imagen":"","titulo":"","descripcion":""}],
    "fotoReferencia": "", "flatLimpio": "", "flatPom": ""
  }
  ```
- **Plantilla fuente:** `.tmp-extract/Team-Uniforms-PDP-Master-Template.html` (autocontenida;
  tiene `<style>` inline y un `<script>` con funciones de render que se reutilizan).
- **Commits chicos y frecuentes, en español, sin firma.**

---

### Task 1: 🧑‍💻 Setup de Supabase + archivo de configuración

**Files:**
- Create: `pedidos/SETUP-supabase.md` (guía + SQL para el dueño del proyecto)
- Create: `pedidos/supabase.js` (config del cliente Supabase)

**Interfaces:**
- Produces: `pedidos/supabase.js` que exporta `export const supabase` (cliente inicializado).
  Lo consumen `admin.js` y `ver.js`.

- [ ] **Step 1: Crear `pedidos/SETUP-supabase.md` con la guía y el SQL**

Contenido del archivo (el dueño lo sigue en [supabase.com](https://supabase.com)):

````markdown
# Setup de Supabase — Sistema de Pedidos

1. Crear cuenta gratis en supabase.com → "New project" (nombre: team-uniforms-pedidos,
   elegir región cercana, guardar la contraseña de la base).
2. Cuando esté listo, ir a **SQL Editor** → "New query" → pegar y correr TODO esto:

```sql
-- Tabla de pedidos
create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  creado timestamptz not null default now(),
  actualizado timestamptz not null default now(),
  estado text not null default 'borrador' check (estado in ('borrador','publicado')),
  producto text not null default '',
  codigo text not null default '',
  contenido jsonb not null default '{}'::jsonb
);

-- Activar Row Level Security
alter table public.pedidos enable row level security;

-- Lectura: anónimos solo ven publicados; usuarios logueados ven todo
create policy "leer publicados" on public.pedidos
  for select to anon using (estado = 'publicado');
create policy "leer todo logueado" on public.pedidos
  for select to authenticated using (true);

-- Escritura: solo usuarios logueados
create policy "insertar logueado" on public.pedidos
  for insert to authenticated with check (true);
create policy "actualizar logueado" on public.pedidos
  for update to authenticated using (true);
create policy "borrar logueado" on public.pedidos
  for delete to authenticated using (true);
```

3. **Storage:** ir a **Storage** → "New bucket" → nombre `pedidos-fotos` → marcar
   **Public bucket** → crear. Luego en **SQL Editor** correr:

```sql
-- Fotos: lectura pública, escritura/borrado solo logueado
create policy "fotos lectura publica" on storage.objects
  for select to anon, authenticated using (bucket_id = 'pedidos-fotos');
create policy "fotos escritura logueado" on storage.objects
  for insert to authenticated with check (bucket_id = 'pedidos-fotos');
create policy "fotos borrado logueado" on storage.objects
  for delete to authenticated using (bucket_id = 'pedidos-fotos');
```

4. **Usuario del cliente:** ir a **Authentication** → **Users** → "Add user" →
   "Create new user" → poner el email del cliente y una contraseña → crear.
   (Desmarcar "Auto Confirm User" NO; dejarlo confirmado.)

5. **Datos de conexión:** ir a **Project Settings** → **API** → copiar:
   - **Project URL** (ej: `https://xxxx.supabase.co`)
   - **anon public** key (la clave larga bajo "Project API keys" → `anon` `public`)
   Pasar esos dos valores para completar `pedidos/supabase.js`.
   ⚠️ NO copiar ni usar la `service_role` key en el frontend.
````

- [ ] **Step 2: Crear `pedidos/supabase.js`**

```js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Reemplazar con los valores reales del proyecto (Project Settings → API).
// La anon key es pública por diseño; la seguridad la da RLS.
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

- [ ] **Step 3: Verificar**

🧑‍💻 MANUAL: el dueño completa el setup en Supabase (tabla, políticas, bucket, usuario) y
reemplaza `SUPABASE_URL` y `SUPABASE_ANON_KEY` con los valores reales. Confirmar en el panel
de Supabase que la tabla `pedidos` existe con RLS activado y el bucket `pedidos-fotos` es
público.

- [ ] **Step 4: Commit**

```bash
git add pedidos/SETUP-supabase.md pedidos/supabase.js
git commit -m "Setup Supabase: guia SQL + config del cliente"
```

---

### Task 2: Ruteo Netlify + robots para /pedidos/

**Files:**
- Modify: `netlify.toml` (agregar regla `/pedidos/:id` ANTES del catch-all)
- Verify: `robots.txt` (ya tiene `Disallow: /pedidos/`)

**Interfaces:**
- Produces: `/pedidos/<id>` sirve `/pedidos/ver.html?id=<id>` (status 200, URL limpia).

- [ ] **Step 1: Editar `netlify.toml`** — insertar la regla de pedidos antes del catch-all `/*`

El archivo debe quedar así:

```toml
[build]
  publish = "."

# Bloquear el acceso público a la documentación interna (queda solo en el repo)
[[redirects]]
  from = "/docs/*"
  to = "/404.html"
  status = 404
  force = true

# Links de pedidos: URL limpia -> la página de render (ANTES del catch-all)
[[redirects]]
  from = "/pedidos/:id"
  to = "/pedidos/ver.html?id=:id"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- [ ] **Step 2: Verificar `robots.txt`**

Confirmar que `robots.txt` (en la raíz) contiene la línea `Disallow: /pedidos/`. Si no está,
agregarla. (Ya debería estar de una tarea previa.)

- [ ] **Step 3: Verificar**

Como `/pedidos/admin/` y `/pedidos/ver.html` son archivos reales, se sirven directo; el
wildcard `/pedidos/:id` solo captura los códigos de pedido. La verificación real (que un
código abra el pedido) se hace cuando exista `ver.html` (Task 6). Por ahora, confirmar que el
`netlify.toml` tiene las 3 reglas en ese orden.

- [ ] **Step 4: Commit**

```bash
git add netlify.toml robots.txt
git commit -m "Ruteo Netlify para links de pedidos (antes del catch-all)"
```

---

### Task 3: Extraer la plantilla PDP a `ver.html` + `pedidos.css`

**Files:**
- Create: `pedidos/ver.html` (estructura de la plantilla, con contenedores identificables)
- Create: `pedidos/pedidos.css` (los estilos de la plantilla)

**Interfaces:**
- Produces: `ver.html` con las secciones FIJAS ya escritas (objetivo, do's & don'ts, timeline,
  categorías de puntaje) y contenedores VACÍOS con `id`/`data-*` para los datos por pedido, que
  `ver.js` (Task 6) va a llenar. Los `id` que produce y que Task 6 consume:
  `#hero-producto`, `#hero-codigo`, `#brief`, `#materiales`, `#pomtable`,
  `.details` (contenedor de detalles), `[data-technical-image="clean"]`,
  `[data-technical-image="pom"]`, `[data-foto-referencia]`, `#pedido-error`.

- [ ] **Step 1: Copiar la plantilla y separar CSS**

Trabajar DESDE `.tmp-extract/Team-Uniforms-PDP-Master-Template.html`. Hacer:
1. Copiar TODO el contenido del `<style>...</style>` de la plantilla a `pedidos/pedidos.css`
   (sin cambios).
2. Crear `pedidos/ver.html` con el mismo `<head>` (título, viewport, preconnect y link a las
   Google Fonts de la plantilla: DM Mono + Manrope) **reemplazando** el `<style>` inline por:
   ```html
   <link rel="stylesheet" href="pedidos.css">
   <meta name="robots" content="noindex,nofollow">
   ```
3. Copiar el `<body>` completo de la plantilla a `ver.html`.
4. En `ver.html`, agregar arriba de todo del `<body>` un contenedor de error oculto:
   ```html
   <div id="pedido-error" hidden style="min-height:100vh;display:grid;place-items:center;font-family:Manrope,sans-serif;text-align:center;padding:24px">
     <div><h1 style="font-size:48px">Pedido no disponible</h1><p style="color:#6f747c">Este link no existe o el pedido todavía no fue publicado.</p></div>
   </div>
   ```
5. Reemplazar el `<script>...</script>` final de la plantilla por:
   ```html
   <script type="module" src="ver.js"></script>
   ```

- [ ] **Step 2: Identificar contenedores por-pedido y darles id estables**

En `ver.html`, ubicar (usando el HTML de la plantilla) y asegurar estos `id`/atributos en los
elementos que muestran datos por pedido (si la plantilla ya usa alguno, respetarlo):
- El `<h1>` del hero del producto → `id="hero-producto"`.
- El elemento donde va el código de producto → `id="hero-codigo"`.
- El bloque de texto del brief → `id="brief"`.
- El contenedor de tags de materiales (`.tags`) → agregar `id="materiales"`.
- La tabla de medidas → ya usa `id="pomtable"` (respetar).
- El contenedor de detalles de construcción → ya usa `.details` (respetar).
- Los dos flats técnicos → ya usan `[data-technical-image="clean"]` y `[data-technical-image="pom"]` (respetar).
- La `<img>` de la foto de referencia (`.reference-photo img`) → agregar `data-foto-referencia`.

> Las secciones FIJAS (objetivo, do's & don'ts, timeline, categorías de puntaje) se dejan tal
> cual la plantilla, con su texto. NO se tocan.
>
> ⚠️ **Importante:** el `<script>` original de la plantilla generaba algunas secciones FIJAS
> por JS (por ejemplo `#scores`, las categorías de puntaje, desde un array `areas`). Como ese
> script se elimina, esas secciones fijas hay que **dejarlas como HTML estático** en `ver.html`
> (copiar el HTML que ese script producía y pegarlo fijo). El puntaje queda **solo visual**
> (sin interactividad ni guardado — eso es fase 2). Las secciones POR-PEDIDO (`#pomtable`,
> `.details`, flats, foto de referencia) NO se hardcodean: quedan vacías y las llena `ver.js`.

- [ ] **Step 3: Verificar en el navegador**

Abrir `pedidos/ver.html` con doble clic. Esperado: la plantilla se ve **igual que el original**
(mismo diseño), con los placeholders grises donde van las fotos. Sin errores en consola
(salvo que `ver.js` todavía no existe → error 404 de ese script, se resuelve en Task 6).

- [ ] **Step 4: Commit**

```bash
git add pedidos/ver.html pedidos/pedidos.css
git commit -m "Extraer plantilla PDP a ver.html + pedidos.css"
```

---

### Task 4: Login del panel + guard de sesión

**Files:**
- Create: `pedidos/admin/index.html` (login + contenedor de lista)
- Create: `pedidos/admin/admin.js` (auth: login, logout, guard)
- Create: `pedidos/admin/admin.css` (estilos simples del panel)

**Interfaces:**
- Consumes: `../supabase.js` (`supabase`).
- Produces: en `admin.js`, las funciones `async function requerirSesion()` (redirige/oculta si
  no hay sesión) y el manejo del form de login. La lista de pedidos se agrega en Task 5 sobre
  el mismo `admin.js` y `index.html`.

- [ ] **Step 1: Crear `pedidos/admin/index.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex,nofollow">
  <title>Panel de pedidos — Team Uniforms</title>
  <link rel="stylesheet" href="admin.css">
</head>
<body>
  <!-- Login -->
  <section id="login" class="login" hidden>
    <form id="login-form" class="login-card">
      <h1>Panel de pedidos</h1>
      <label>Email<input type="email" id="email" required></label>
      <label>Contraseña<input type="password" id="password" required></label>
      <button type="submit">Entrar</button>
      <p id="login-error" class="error" hidden></p>
    </form>
  </section>

  <!-- Panel (visible con sesión) -->
  <section id="panel" class="panel" hidden>
    <header class="panel-top">
      <h1>Pedidos</h1>
      <div>
        <a class="btn" href="editor.html">+ Nuevo pedido</a>
        <button class="btn btn-ghost" id="logout">Salir</button>
      </div>
    </header>
    <div id="lista"></div>
  </section>

  <script type="module" src="admin.js"></script>
</body>
</html>
```

- [ ] **Step 2: Crear `pedidos/admin/admin.css`**

```css
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Manrope,system-ui,sans-serif;background:#0A0A0A;color:#fff;min-height:100vh}
.login{min-height:100vh;display:grid;place-items:center;padding:24px}
.login-card{background:#111114;border:1px solid #26272b;border-radius:12px;padding:32px;width:100%;max-width:380px;display:flex;flex-direction:column;gap:16px}
.login-card h1{font-size:22px;margin-bottom:8px}
.login-card label{display:flex;flex-direction:column;gap:6px;font-size:13px;color:#c9c9ce}
.login-card input{background:#0A0A0A;border:1px solid #33343a;border-radius:8px;padding:12px;color:#fff;font-size:16px}
.login-card button,.btn{background:#5B7CFF;color:#0A0A0A;font-weight:700;border:none;border-radius:8px;padding:12px 18px;cursor:pointer;text-decoration:none;display:inline-block}
.btn-ghost{background:transparent;color:#fff;border:1px solid #33343a}
.error{color:#ff6b6b;font-size:13px}
.panel{max-width:1000px;margin:0 auto;padding:32px 24px}
.panel-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;gap:16px;flex-wrap:wrap}
.panel-top>div{display:flex;gap:10px}
```

- [ ] **Step 3: Crear `pedidos/admin/admin.js` con login + guard**

```js
import { supabase } from '../supabase.js';

const $ = (s) => document.querySelector(s);
const loginSec = $('#login');
const panelSec = $('#panel');

async function requerirSesion() {
  const { data: { session } } = await supabase.auth.getSession();
  const hay = !!session;
  loginSec.hidden = hay;
  panelSec.hidden = !hay;
  return hay;
}

$('#login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = $('#login-error');
  err.hidden = true;
  const { error } = await supabase.auth.signInWithPassword({
    email: $('#email').value.trim(),
    password: $('#password').value,
  });
  if (error) { err.textContent = 'Email o contraseña incorrectos.'; err.hidden = false; return; }
  await iniciar();
});

$('#logout').addEventListener('click', async () => {
  await supabase.auth.signOut();
  location.reload();
});

async function iniciar() {
  const hay = await requerirSesion();
  if (hay) await cargarLista(); // definida en Task 5
}

// cargarLista se define en Task 5; stub para que no rompa hasta entonces:
async function cargarLista() {}

iniciar();
```

- [ ] **Step 4: Verificar en el navegador**

🧑‍💻 Requiere el setup de Supabase (Task 1) completo con el usuario creado. Abrir
`pedidos/admin/index.html`. Esperado: aparece el login. Con credenciales incorrectas →
mensaje de error. Con las correctas → desaparece el login y aparece el panel (vacío por ahora).
"Salir" vuelve al login.

- [ ] **Step 5: Commit**

```bash
git add pedidos/admin/index.html pedidos/admin/admin.css pedidos/admin/admin.js
git commit -m "Panel: login con Supabase Auth + guard de sesion"
```

---

### Task 5: Lista de pedidos en el panel (leer, publicar/despublicar, copiar link, borrar)

**Files:**
- Modify: `pedidos/admin/admin.js` (reemplazar el stub `cargarLista` por la implementación real)

**Interfaces:**
- Consumes: `supabase`, `requerirSesion` (Task 4).
- Produces: `async function cargarLista()` que pinta `#lista` con las filas de la tabla
  `pedidos`, cada una con acciones. Consume la tabla con columnas
  `id, producto, codigo, estado, actualizado`.

- [ ] **Step 1: Reemplazar el stub `cargarLista` en `admin.js`**

```js
async function cargarLista() {
  const lista = document.querySelector('#lista');
  const { data, error } = await supabase
    .from('pedidos')
    .select('id, producto, codigo, estado, actualizado')
    .order('actualizado', { ascending: false });

  if (error) { lista.innerHTML = '<p class="error">No se pudieron cargar los pedidos.</p>'; return; }
  if (!data.length) { lista.innerHTML = '<p style="color:#8b8b90">Todavía no hay pedidos. Creá el primero con “+ Nuevo pedido”.</p>'; return; }

  lista.innerHTML = data.map((p) => {
    const fecha = new Date(p.actualizado).toLocaleDateString('es-AR');
    const publicado = p.estado === 'publicado';
    return `<div class="fila" data-id="${p.id}">
      <div class="fila-info">
        <strong>${p.producto || '(sin nombre)'}</strong>
        <span>${p.codigo || ''} · ${fecha} · <em>${p.estado}</em></span>
      </div>
      <div class="fila-acc">
        <a class="btn btn-ghost" href="editor.html?id=${p.id}">Editar</a>
        <button class="btn btn-ghost" data-accion="publicar">${publicado ? 'Despublicar' : 'Publicar'}</button>
        <button class="btn btn-ghost" data-accion="link" ${publicado ? '' : 'disabled'}>Copiar link</button>
        <button class="btn btn-ghost" data-accion="borrar">Borrar</button>
      </div>
    </div>`;
  }).join('');
}

document.querySelector('#lista').addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-accion]');
  if (!btn) return;
  const fila = btn.closest('.fila');
  const id = fila.dataset.id;
  const accion = btn.dataset.accion;

  if (accion === 'publicar') {
    const despublicar = btn.textContent === 'Despublicar';
    const nuevo = despublicar ? 'borrador' : 'publicado';
    const { error } = await supabase.from('pedidos').update({ estado: nuevo, actualizado: new Date().toISOString() }).eq('id', id);
    if (error) { alert('No se pudo cambiar el estado.'); return; }
    await cargarLista();
  }

  if (accion === 'link') {
    const url = `${location.origin}/pedidos/${id}`;
    await navigator.clipboard.writeText(url);
    btn.textContent = '¡Copiado!';
    setTimeout(() => { btn.textContent = 'Copiar link'; }, 1500);
  }

  if (accion === 'borrar') {
    if (!confirm('¿Borrar este pedido? No se puede deshacer.')) return;
    const { error } = await supabase.from('pedidos').delete().eq('id', id);
    if (error) { alert('No se pudo borrar.'); return; }
    await cargarLista();
  }
});
```

- [ ] **Step 2: Agregar estilos de fila a `admin.css`**

```css
.fila{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;background:#111114;border:1px solid #26272b;border-radius:10px;padding:16px 20px;margin-bottom:10px}
.fila-info{display:flex;flex-direction:column;gap:4px}
.fila-info span{font-size:12px;color:#8b8b90}
.fila-acc{display:flex;gap:8px;flex-wrap:wrap}
.fila-acc .btn{font-size:13px;padding:8px 12px}
.btn[disabled]{opacity:.4;cursor:not-allowed}
```

- [ ] **Step 3: Verificar en el navegador**

Con sesión iniciada y al menos un pedido creado (se puede crear a mano en Supabase → Table
Editor para probar): la lista muestra el pedido. "Publicar" cambia el estado y habilita
"Copiar link". "Copiar link" copia `…/pedidos/<id>`. "Borrar" (con confirmación) lo elimina.

- [ ] **Step 4: Commit**

```bash
git add pedidos/admin/admin.js pedidos/admin/admin.css
git commit -m "Panel: lista de pedidos con publicar, copiar link y borrar"
```

---

### Task 6: Render público del pedido (`ver.js`)

**Files:**
- Create: `pedidos/ver.js` (trae el pedido de Supabase y llena `ver.html`)

**Interfaces:**
- Consumes: `./supabase.js`; los `id`/atributos de `ver.html` (Task 3); el esquema `contenido`
  (Global Constraints).
- Produces: la página pública funcional. Usa las funciones de render que ya trae la plantilla
  (reescritas para tomar los datos del pedido).

- [ ] **Step 1: Crear `pedidos/ver.js`**

```js
import { supabase } from './supabase.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');

function mostrarError() {
  document.querySelectorAll('body > *:not(#pedido-error):not(script)').forEach((el) => el.hidden = true);
  document.querySelector('#pedido-error').hidden = false;
}

async function cargar() {
  if (!id) return mostrarError();
  const { data, error } = await supabase
    .from('pedidos')
    .select('producto, codigo, estado, contenido')
    .eq('id', id)
    .single();

  // RLS: un anónimo solo recibe el pedido si está publicado; si no, data viene null.
  if (error || !data) return mostrarError();

  render(data);
}

function texto(sel, valor) {
  const el = document.querySelector(sel);
  if (el && valor != null) el.textContent = valor;
}
function imagen(sel, url) {
  const el = document.querySelector(sel);
  if (el && url) el.src = url;
}

function render(pedido) {
  const c = pedido.contenido || {};

  // Textos del producto
  texto('#hero-producto', pedido.producto);
  texto('#hero-codigo', pedido.codigo);
  texto('#brief', c.brief);
  document.title = `${pedido.producto || 'Pedido'} — Team Uniforms`;

  // Foto de referencia + flats técnicos
  imagen('[data-foto-referencia]', c.fotoReferencia);
  imagen('[data-technical-image="clean"]', c.flatLimpio);
  imagen('[data-technical-image="pom"]', c.flatPom);

  // Materiales (tags)
  const mats = document.querySelector('#materiales');
  if (mats) mats.innerHTML = (c.materiales || []).map((m) => `<i>${m}</i>`).join('');

  // Tabla de medidas (POM)
  const pomtable = document.querySelector('#pomtable');
  if (pomtable) {
    pomtable.innerHTML = '<div class="tr th"><span>MEASUREMENT</span><b>TARGET</b></div>' +
      (c.poms || []).map((r, i) =>
        `<div class="tr"><span><i>${String(i + 1).padStart(2, '0')}</i>${r[0]}</span><b>${r[1]}</b></div>`
      ).join('');
  }

  // Detalles de construcción (cards con foto)
  const details = document.querySelector('.details');
  if (details) {
    details.innerHTML = (c.detalles || []).map((d, i) =>
      `<article class="detail-card"><figure class="detail-media"><img src="${d.imagen || ''}" alt="${d.titulo || ''}" loading="lazy"></figure>
       <div class="caption"><b>${String(i + 1).padStart(2, '0')}</b><strong>${d.titulo || ''}</strong><small>${d.descripcion || ''}</small></div></article>`
    ).join('');
  }
}

cargar();
```

> Nota de adaptación: los selectores de arriba (`#hero-producto`, `#hero-codigo`, `#brief`,
> `#materiales`, `#pomtable`, `.details`, `[data-technical-image="…"]`, `[data-foto-referencia]`)
> deben coincidir con los que se dejaron en `ver.html` (Task 3). Si en la plantilla el nombre
> de una clase difiere (p. ej. la estructura de `.tr` o `.detail-card`), respetar las clases
> de la plantilla para que el CSS aplique — este JS reusa exactamente esas clases.

- [ ] **Step 2: Verificar en el navegador**

🧑‍💻 Requiere Supabase con un pedido **publicado** que tenga datos. Para probar en local sin
Netlify, abrir `pedidos/ver.html?id=<id-real>` (con el id de un pedido publicado). Esperado:
la página muestra los datos de ese pedido (producto, código, medidas, detalles, fotos si tiene).
Con un `id` inexistente o un pedido en **borrador** (accedido como anónimo) → aparece "Pedido
no disponible". Confirmar sin errores en consola.

- [ ] **Step 3: Commit**

```bash
git add pedidos/ver.js
git commit -m "Render publico del pedido desde Supabase (solo lectura)"
```

---

### Task 7: Editor de pedido — datos de texto (crear/editar sin fotos)

**Files:**
- Create: `pedidos/admin/editor.html` (formulario)
- Create: `pedidos/admin/editor.js` (cargar/guardar el pedido)

**Interfaces:**
- Consumes: `../supabase.js`. Lee `?id=` de la URL; si no hay id, crea un borrador nuevo.
- Produces: guarda `producto`, `codigo` y los campos de texto de `contenido`
  (`hero`, `brief`, `materiales`, `poms`). Las fotos se agregan en Task 8 sobre estos archivos.

- [ ] **Step 1: Crear `pedidos/admin/editor.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex,nofollow">
  <title>Editar pedido — Team Uniforms</title>
  <link rel="stylesheet" href="admin.css">
</head>
<body>
  <section class="panel">
    <header class="panel-top">
      <h1>Editar pedido</h1>
      <div>
        <a class="btn btn-ghost" href="index.html">← Volver</a>
        <button class="btn" id="guardar">Guardar</button>
      </div>
    </header>

    <form id="form-pedido" class="form-pedido">
      <label>Producto<input type="text" id="f-producto"></label>
      <label>Código de producto<input type="text" id="f-codigo"></label>
      <label>Titular / hero<textarea id="f-hero" rows="2"></textarea></label>
      <label>Brief<textarea id="f-brief" rows="4"></textarea></label>
      <label>Materiales (uno por línea)<textarea id="f-materiales" rows="4"></textarea></label>

      <fieldset>
        <legend>Tabla de medidas (POM)</legend>
        <div id="poms"></div>
        <button type="button" class="btn btn-ghost" id="add-pom">+ Agregar medida</button>
      </fieldset>

      <!-- Fotos: se agregan en Task 8 -->
      <div id="zona-fotos"></div>

      <p id="estado-guardado" class="ok" hidden>Guardado ✔</p>
    </form>
  </section>
  <script type="module" src="editor.js"></script>
</body>
</html>
```

- [ ] **Step 2: Estilos del formulario en `admin.css`**

```css
.form-pedido{display:flex;flex-direction:column;gap:16px;max-width:720px}
.form-pedido label{display:flex;flex-direction:column;gap:6px;font-size:13px;color:#c9c9ce}
.form-pedido input,.form-pedido textarea{background:#111114;border:1px solid #33343a;border-radius:8px;padding:12px;color:#fff;font-size:16px;font-family:inherit}
.form-pedido fieldset{border:1px solid #26272b;border-radius:10px;padding:16px}
.form-pedido legend{padding:0 8px;color:#8b8b90;font-size:12px}
.pom-row{display:flex;gap:8px;margin-bottom:8px}
.pom-row input{flex:1}
.ok{color:#5cd3a5}
```

- [ ] **Step 3: Crear `pedidos/admin/editor.js`**

```js
import { supabase } from '../supabase.js';

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
let id = params.get('id');

async function requerirSesion() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { location.href = 'index.html'; return false; }
  return true;
}

function pomRow(medida = '', target = '') {
  const div = document.createElement('div');
  div.className = 'pom-row';
  div.innerHTML = `<input placeholder="Medida" value="${medida}"><input placeholder="Target" value="${target}"><button type="button" class="btn btn-ghost">✕</button>`;
  div.querySelector('button').onclick = () => div.remove();
  return div;
}
$('#add-pom').onclick = () => $('#poms').appendChild(pomRow());

function leerForm() {
  const poms = [...document.querySelectorAll('#poms .pom-row')]
    .map((r) => [...r.querySelectorAll('input')].map((i) => i.value))
    .filter((p) => p[0] || p[1]);
  const materiales = $('#f-materiales').value.split('\n').map((s) => s.trim()).filter(Boolean);
  return {
    producto: $('#f-producto').value.trim(),
    codigo: $('#f-codigo').value.trim(),
    contenido: {
      hero: $('#f-hero').value,
      brief: $('#f-brief').value,
      materiales,
      poms,
      detalles: window._detalles || [],
      fotoReferencia: window._fotos?.fotoReferencia || '',
      flatLimpio: window._fotos?.flatLimpio || '',
      flatPom: window._fotos?.flatPom || '',
    },
  };
}

function pintarForm(p) {
  $('#f-producto').value = p.producto || '';
  $('#f-codigo').value = p.codigo || '';
  const c = p.contenido || {};
  $('#f-hero').value = c.hero || '';
  $('#f-brief').value = c.brief || '';
  $('#f-materiales').value = (c.materiales || []).join('\n');
  $('#poms').innerHTML = '';
  (c.poms || []).forEach((pm) => $('#poms').appendChild(pomRow(pm[0], pm[1])));
  window._detalles = c.detalles || [];
  window._fotos = { fotoReferencia: c.fotoReferencia || '', flatLimpio: c.flatLimpio || '', flatPom: c.flatPom || '' };
  if (window.pintarFotos) window.pintarFotos(); // definido en Task 8
}

async function cargar() {
  if (!(await requerirSesion())) return;
  if (!id) {
    // Crear borrador nuevo y quedarse con su id
    const { data, error } = await supabase.from('pedidos').insert({}).select('id').single();
    if (error) { alert('No se pudo crear el pedido.'); location.href = 'index.html'; return; }
    id = data.id;
    history.replaceState(null, '', `editor.html?id=${id}`);
    pintarForm({});
    return;
  }
  const { data, error } = await supabase.from('pedidos').select('*').eq('id', id).single();
  if (error || !data) { alert('Pedido no encontrado.'); location.href = 'index.html'; return; }
  pintarForm(data);
}

$('#guardar').onclick = async () => {
  const payload = { ...leerForm(), actualizado: new Date().toISOString() };
  const { error } = await supabase.from('pedidos').update(payload).eq('id', id);
  if (error) { alert('No se pudo guardar.'); return; }
  const ok = $('#estado-guardado'); ok.hidden = false; setTimeout(() => { ok.hidden = true; }, 1500);
};

cargar();
```

- [ ] **Step 4: Verificar en el navegador**

Con sesión: desde el panel, "+ Nuevo pedido" abre el editor y crea un borrador (la URL pasa a
`editor.html?id=…`). Cargar producto, código, hero, brief, materiales y un par de medidas →
"Guardar" → "Guardado ✔". Volver al panel: el pedido aparece con esos datos. Reabrir "Editar":
los campos vienen cargados.

- [ ] **Step 5: Commit**

```bash
git add pedidos/admin/editor.html pedidos/admin/editor.js pedidos/admin/admin.css
git commit -m "Editor de pedido: campos de texto (crear/editar/guardar)"
```

---

### Task 8: Editor — subida de fotos a Supabase Storage

**Files:**
- Modify: `pedidos/admin/editor.js` (helpers de subida + render de fotos)
- Modify: `pedidos/admin/editor.html` (nada nuevo; se usa `#zona-fotos`)

**Interfaces:**
- Consumes: `supabase` (Storage), `id` del pedido, `window._fotos`, `window._detalles`.
- Produces: `window.pintarFotos()` (referenciada en Task 7) y la lógica de subir imágenes al
  bucket `pedidos-fotos/<id>/<archivo>` guardando su URL pública en `contenido`.

- [ ] **Step 1: Agregar helpers de subida y render de fotos al final de `editor.js`**

```js
async function subirFoto(file) {
  const nombre = `${id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
  const { error } = await supabase.storage.from('pedidos-fotos').upload(nombre, file, { upsert: true });
  if (error) { alert('No se pudo subir la foto.'); return null; }
  const { data } = supabase.storage.from('pedidos-fotos').getPublicUrl(nombre);
  return data.publicUrl;
}

function campoFoto(label, clave) {
  const url = window._fotos[clave];
  return `<div class="foto-campo">
    <span>${label}</span>
    ${url ? `<img src="${url}" class="foto-prev">` : ''}
    <input type="file" accept="image/*" data-clave="${clave}">
  </div>`;
}

window.pintarFotos = function () {
  const zona = document.querySelector('#zona-fotos');
  zona.innerHTML = `
    <fieldset><legend>Fotos principales</legend>
      ${campoFoto('Foto de referencia', 'fotoReferencia')}
      ${campoFoto('Flat técnico (limpio)', 'flatLimpio')}
      ${campoFoto('Flat técnico (con medidas)', 'flatPom')}
    </fieldset>
    <fieldset><legend>Detalles de construcción</legend>
      <div id="detalles-lista"></div>
      <button type="button" class="btn btn-ghost" id="add-detalle">+ Agregar detalle</button>
    </fieldset>`;

  zona.querySelectorAll('input[type="file"][data-clave]').forEach((inp) => {
    inp.onchange = async () => {
      const file = inp.files[0]; if (!file) return;
      const url = await subirFoto(file);
      if (url) { window._fotos[inp.dataset.clave] = url; window.pintarFotos(); }
    };
  });

  pintarDetalles();
  document.querySelector('#add-detalle').onclick = () => {
    window._detalles.push({ imagen: '', titulo: '', descripcion: '' });
    pintarDetalles();
  };
};

function pintarDetalles() {
  const cont = document.querySelector('#detalles-lista');
  cont.innerHTML = window._detalles.map((d, i) => `
    <div class="detalle-row" data-i="${i}">
      ${d.imagen ? `<img src="${d.imagen}" class="foto-prev">` : ''}
      <input type="file" accept="image/*" data-tipo="img">
      <input placeholder="Título" value="${d.titulo || ''}" data-tipo="titulo">
      <input placeholder="Descripción" value="${d.descripcion || ''}" data-tipo="descripcion">
      <button type="button" class="btn btn-ghost" data-tipo="quitar">✕</button>
    </div>`).join('');

  cont.querySelectorAll('.detalle-row').forEach((row) => {
    const i = Number(row.dataset.i);
    row.querySelector('[data-tipo="img"]').onchange = async (e) => {
      const file = e.target.files[0]; if (!file) return;
      const url = await subirFoto(file);
      if (url) { window._detalles[i].imagen = url; pintarDetalles(); }
    };
    row.querySelector('[data-tipo="titulo"]').oninput = (e) => { window._detalles[i].titulo = e.target.value; };
    row.querySelector('[data-tipo="descripcion"]').oninput = (e) => { window._detalles[i].descripcion = e.target.value; };
    row.querySelector('[data-tipo="quitar"]').onclick = () => { window._detalles.splice(i, 1); pintarDetalles(); };
  });
}
```

- [ ] **Step 2: Estilos de fotos en `admin.css`**

```css
.foto-campo{display:flex;flex-direction:column;gap:8px;margin-bottom:16px;font-size:13px;color:#c9c9ce}
.foto-prev{max-width:180px;border-radius:8px;border:1px solid #26272b}
.detalle-row{display:grid;grid-template-columns:auto 1fr 1fr auto;gap:8px;align-items:center;margin-bottom:10px}
.detalle-row .foto-prev{grid-row:span 1;max-width:90px}
@media(max-width:640px){.detalle-row{grid-template-columns:1fr}}
```

- [ ] **Step 3: Verificar en el navegador**

🧑‍💻 Requiere el bucket `pedidos-fotos` público (Task 1). En un pedido: subir la foto de
referencia y los flats → aparece la miniatura. Agregar un detalle, subirle una foto y poner
título/descripción. "Guardar". Reabrir el pedido: las fotos y detalles persisten. Abrir el
pedido publicado en `ver.html?id=…`: las fotos se ven en la ficha.

- [ ] **Step 4: Commit**

```bash
git add pedidos/admin/editor.js pedidos/admin/admin.css
git commit -m "Editor: subida de fotos y detalles de construccion a Storage"
```

---

### Task 9: Verificación de seguridad + despliegue final

**Files:**
- Verify: comportamiento RLS y ocultamiento (sin cambios de código salvo que aparezca un hueco)

- [ ] **Step 1: Publicar y probar el flujo completo en Netlify**

Hacer `git push` (Netlify redeploya). Con el cliente logueado, crear un pedido de prueba
completo, publicarlo, copiar el link y abrirlo en una **ventana de incógnito** (sin sesión):
debe verse la ficha en solo lectura, con fotos, en `tu-teamuniforms.com/pedidos/<id>`.

- [ ] **Step 2: Probar la seguridad (RLS)**

En incógnito (anónimo):
- Abrir el link de un pedido en **borrador** → debe mostrar "Pedido no disponible" (no el
  contenido). ✅ RLS de lectura.
- Abrir `tu-teamuniforms.com/pedidos/admin/` → debe pedir login (no dejar entrar). ✅
- En la consola del navegador anónimo, intentar `supabase.from('pedidos').insert(...)` no debe
  poder escribir (RLS de escritura solo `authenticated`). ✅

- [ ] **Step 3: Probar el ocultamiento**

- `tu-teamuniforms.com/pedidos/` no está linkeado desde la web principal (revisar que no haya
  quedado ningún link). ✅
- `tu-teamuniforms.com/robots.txt` incluye `Disallow: /pedidos/`. ✅
- Las páginas de `/pedidos/` tienen `<meta name="robots" content="noindex,nofollow">`. ✅

- [ ] **Step 4: Responsive**

Revisar en mobile (DevTools 📱) el panel, el editor y la ficha pública. Ajustar cualquier
desborde obvio.

- [ ] **Step 5: Commit (si hubo ajustes)**

```bash
git add -A
git commit -m "Ajustes finales de seguridad y responsive del sistema de pedidos"
```

---

## Pendientes que dependen del cliente / dueño

- Crear el proyecto Supabase, correr el SQL, crear el bucket y el usuario (Task 1).
- Pasar `SUPABASE_URL` + `anon key` para `pedidos/supabase.js`.
- Definir el email/contraseña del cliente para el login.

## Fuera de alcance (fase 2)

- Que la fábrica responda / cargue puntajes persistidos.
- Duplicar un pedido como plantilla.
- Múltiples usuarios / roles.
