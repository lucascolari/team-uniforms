# Team Uniforms — Plan de implementación

> **Para quien ejecuta:** este plan se construye tarea por tarea. Cada tarea termina con
> una **verificación visual en el navegador** y un `commit`. No hay tests automáticos: es
> una landing estática (HTML/CSS/JS vanilla), así que "el test" es abrir el sitio y
> confirmar lo que se describe. Los pasos usan checkbox (`- [ ]`) para ir tildando.

**Goal:** Construir la landing premium de Team Uniforms, de una sola página, con scroll
narrativo, que genere consultas/reuniones (WhatsApp + formulario).

**Architecture:** Sitio estático de 3 archivos (`index.html`, `css/styles.css`,
`js/main.js`) + `assets/`. Sin frameworks ni build. Animaciones con `IntersectionObserver`
+ CSS. Se construye sección por sección, de arriba hacia abajo.

**Tech Stack:** HTML5, CSS3 (variables, grid, clamp), JavaScript vanilla (ES6,
IntersectionObserver), tipografía Manrope (Google Fonts). Hosting Netlify.

## Global Constraints

- **Idioma:** español; términos técnicos en inglés (tech pack, MOQ, streetwear, etc.).
- **Sin dependencias externas** salvo la fuente Manrope desde Google Fonts. Cero librerías JS.
- **Colores (CSS variables):** `--negro:#0A0A0A`, `--blanco:#FFFFFF`, `--gris:#6B6B70`,
  `--gris-claro:#E5E5E7`, `--periwinkle:#A5B0E1`. El periwinkle se usa con cuentagotas.
- **Tipografía:** Manrope. Headlines peso 800; logo/labels peso 300 con letter-spacing
  amplio; cuerpo 400–500.
- **Ritmo editorial:** secciones alternan fondo negro ↔ blanco a pantalla completa.
- **Accesibilidad:** respetar `prefers-reduced-motion`. Contraste alto.
- **Mobile-first** y totalmente responsive.
- **Sin backend:** formulario vía Netlify Forms; WhatsApp vía deep link.
- **Datos reales:** WhatsApp `+5492364341337`; mail `teamuniformsgroup@gmail.com`;
  Instagram `@teamuniformsarg`; dominio `team-uniforms.com`; ubicación Buenos Aires, ARG.
- **Commits chicos y frecuentes**, mensajes en español.

---

### Task 1: Scaffold + tokens de diseño + estilos base

**Files:**
- Create: `index.html`
- Create: `css/styles.css`
- Create: `js/main.js`
- Create: `assets/.gitkeep`

**Interfaces:**
- Produces: estructura HTML base con `<link>` a `css/styles.css` y `<script src="js/main.js" defer>`; las CSS variables globales; clases utilitarias `.contenedor`, `.seccion`, `.label`.

- [ ] **Step 1: Crear `index.html` con el esqueleto, fuentes y meta tags**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Team Uniforms — De la idea al producto terminado</title>
  <meta name="description" content="Partner de desarrollo, producción e importación textil para marcas. Convertimos tu idea en un producto terminado, listo para vender. Buenos Aires, ARG.">
  <meta property="og:title" content="Team Uniforms — De la idea al producto terminado">
  <meta property="og:description" content="Desarrollamos, producimos e importamos colecciones para marcas que buscan crecer con estándares internacionales.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://team-uniforms.com">
  <meta property="og:image" content="https://team-uniforms.com/assets/og.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <!-- header (Task 2) -->
  <main>
    <!-- secciones (Tasks 3-11) -->
  </main>
  <!-- footer (Task 11) -->
  <script src="js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Crear `css/styles.css` con tokens, reset y base tipográfica**

```css
:root{
  --negro:#0A0A0A; --blanco:#FFFFFF;
  --gris:#6B6B70; --gris-claro:#E5E5E7; --gris-osc:#1C1C1E;
  --periwinkle:#A5B0E1;
  --ancho:1200px; --pad:clamp(20px,5vw,64px);
  --t-rapida:.25s; --t-media:.5s;
  --ease:cubic-bezier(.16,1,.3,1);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:'Manrope',system-ui,sans-serif;background:var(--negro);color:var(--blanco);line-height:1.5;overflow-x:hidden;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
button{font-family:inherit;cursor:pointer;border:none;background:none}
input,textarea,select{font-family:inherit;font-size:16px}
.contenedor{max-width:var(--ancho);margin:0 auto;padding-left:var(--pad);padding-right:var(--pad)}
.seccion{padding:clamp(64px,10vw,140px) 0;position:relative}
.seccion--blanco{background:var(--blanco);color:var(--negro)}
.label{font-weight:300;font-size:12px;letter-spacing:4px;text-transform:uppercase}
.acento{color:var(--periwinkle)}
@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto}
  *{animation:none !important;transition:none !important}
}
```

- [ ] **Step 3: Crear `js/main.js` y `assets/.gitkeep`**

```js
// Team Uniforms — interacciones. Se completa en tareas siguientes.
'use strict';
document.addEventListener('DOMContentLoaded', () => {
  console.log('Team Uniforms cargado');
});
```

(`assets/.gitkeep` es un archivo vacío para que Git registre la carpeta.)

- [ ] **Step 4: Verificar en el navegador**

Abrir `index.html` con doble clic. Esperado: página en negro, sin errores en la consola
(F12), el mensaje "Team Uniforms cargado" en la consola, y la fuente Manrope cargada
(se ve en la pestaña Network o aplicando una clase de prueba).

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css js/main.js assets/.gitkeep
git commit -m "Scaffold base: HTML, tokens de diseño y estilos base"
```

---

### Task 2: Header fijo con blur + navegación

**Files:**
- Modify: `index.html` (insertar `<header>` al inicio de `<body>`)
- Modify: `css/styles.css` (estilos de header y nav)
- Modify: `js/main.js` (clase al scrollear + menú mobile + scroll suave)

**Interfaces:**
- Produces: `<header class="hdr">` con id targets; función de scroll suave por `data-scroll`; los `<section id="...">` referenciados se crean en tareas siguientes (los links pueden existir antes que las secciones).

- [ ] **Step 1: Insertar el header en `index.html`** (primer hijo de `<body>`)

```html
<header class="hdr" id="hdr">
  <div class="hdr-in contenedor">
    <a href="#hero" class="logo" data-scroll aria-label="Team Uniforms, inicio">
      <span class="logo-mono">TU</span>
      <span class="logo-tx">TEAM<br>UNIFORMS</span>
    </a>
    <nav class="nav-dsk">
      <button data-scroll data-target="#proceso">Proceso</button>
      <button data-scroll data-target="#categorias">Categorías</button>
      <button data-scroll data-target="#calidad">Calidad</button>
      <button class="btn-cta" data-scroll data-target="#contacto">Empecemos</button>
    </nav>
    <button class="burger" id="burger" aria-label="Abrir menú" aria-expanded="false">
      <span></span><span></span>
    </button>
  </div>
  <nav class="nav-mob" id="navMob">
    <button data-scroll data-target="#proceso">Proceso</button>
    <button data-scroll data-target="#categorias">Categorías</button>
    <button data-scroll data-target="#calidad">Calidad</button>
    <button class="btn-cta" data-scroll data-target="#contacto">Empecemos</button>
  </nav>
</header>
```

- [ ] **Step 2: Estilos del header en `css/styles.css`**

```css
.hdr{position:fixed;top:0;left:0;right:0;z-index:1000;transition:background var(--t-rapida),backdrop-filter var(--t-rapida)}
.hdr.sc{background:rgba(10,10,10,.72);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.hdr-in{height:74px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:11px;color:#fff}
.logo-mono{font-weight:800;font-size:20px;letter-spacing:-1px;border:1.5px solid currentColor;border-radius:5px;padding:1px 6px;line-height:1.1}
.logo-tx{font-weight:300;font-size:11px;letter-spacing:4px;line-height:1.2}
.nav-dsk{display:flex;align-items:center;gap:30px}
.nav-dsk button{color:rgba(255,255,255,.78);font-size:14px;font-weight:500;transition:color var(--t-rapida)}
.nav-dsk button:hover{color:#fff}
.btn-cta{border:1px solid var(--periwinkle);color:var(--periwinkle) !important;padding:9px 20px;border-radius:40px;transition:background var(--t-rapida),color var(--t-rapida)}
.btn-cta:hover{background:var(--periwinkle);color:var(--negro) !important}
.burger{display:none;flex-direction:column;gap:5px;padding:6px}
.burger span{width:24px;height:2px;background:#fff;transition:transform var(--t-rapida),opacity var(--t-rapida)}
.burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.burger.open span:nth-child(2){transform:translateY(-0px) rotate(-45deg)}
.nav-mob{display:none;flex-direction:column;background:rgba(10,10,10,.97);padding:8px var(--pad) 24px}
.nav-mob.open{display:flex}
.nav-mob button{text-align:left;color:rgba(255,255,255,.85);font-size:17px;font-weight:500;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.08)}
.nav-mob .btn-cta{margin-top:16px;text-align:center;border-bottom:1px solid var(--periwinkle)}
@media (max-width:820px){.nav-dsk{display:none}.burger{display:flex}}
```

- [ ] **Step 3: Lógica del header en `js/main.js`** (dentro del `DOMContentLoaded`)

```js
const hdr = document.getElementById('hdr');
const burger = document.getElementById('burger');
const navMob = document.getElementById('navMob');

// fondo del header al scrollear
const onScroll = () => hdr.classList.toggle('sc', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, {passive:true});

// menú mobile
burger.addEventListener('click', () => {
  const abierto = navMob.classList.toggle('open');
  burger.classList.toggle('open', abierto);
  burger.setAttribute('aria-expanded', String(abierto));
});

// scroll suave a secciones
document.querySelectorAll('[data-scroll]').forEach(el => {
  el.addEventListener('click', (e) => {
    const sel = el.dataset.target || el.getAttribute('href');
    const destino = document.querySelector(sel);
    if (!destino) return;
    e.preventDefault();
    destino.scrollIntoView({behavior:'smooth', block:'start'});
    navMob.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
  });
});
```

- [ ] **Step 4: Verificar en el navegador**

Recargar. Esperado: header fijo arriba; al scrollear (aún sin contenido, probar agrandando
la ventana o agregando un `<div style="height:1500px">` temporal) aparece el fondo con
blur. En pantalla angosta (<820px, usar DevTools responsive) aparece el botón hamburguesa
y abre/cierra el menú. Quitar el div temporal si se agregó.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "Header fijo con blur, navegación desktop/mobile y scroll suave"
```

---

### Task 3: Hero (negro) + tipografía cinética

**Files:**
- Modify: `index.html` (sección `#hero` dentro de `<main>`)
- Modify: `css/styles.css`
- Modify: `js/main.js` (animación de entrada)

**Interfaces:**
- Consumes: `.contenedor`, tokens.
- Produces: `<section id="hero">`. La textura de fondo usa `assets/hero-bg.jpg` (placeholder hasta que Lucas exporte la imagen).

- [ ] **Step 1: HTML del hero**

```html
<section id="hero" class="hero">
  <div class="hero-in contenedor">
    <p class="label hero-cap reveal-hero">ARG, Buenos Aires</p>
    <h1 class="hero-tit">
      <span class="reveal-hero">Desarrollamos,</span>
      <span class="reveal-hero">producimos</span>
      <span class="reveal-hero">e importamos</span>
    </h1>
    <p class="hero-sub reveal-hero">colecciones para marcas que buscan crecer con estándares <span class="acento">internacionales.</span></p>
    <div class="hero-foot reveal-hero">
      <span class="label">Scroll ↓</span>
      <span class="acento hero-web">team-uniforms.com</span>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Estilos del hero**

```css
.hero{min-height:100vh;display:flex;align-items:center;background:linear-gradient(rgba(10,10,10,.55),rgba(10,10,10,.75)),var(--negro);background-size:cover;background-position:center;position:relative}
.hero-in{width:100%;padding-top:120px;padding-bottom:60px}
.hero-cap{color:var(--gris-claro);margin-bottom:28px}
.hero-tit{font-weight:800;font-size:clamp(44px,9vw,118px);line-height:.96;letter-spacing:-2px}
.hero-tit span{display:block}
.hero-sub{font-weight:400;font-size:clamp(16px,2.2vw,24px);color:#c9c9ce;max-width:560px;margin-top:28px;line-height:1.35}
.hero-foot{display:flex;justify-content:space-between;align-items:center;margin-top:56px}
.hero-web{font-weight:500;font-size:14px}
.reveal-hero{opacity:0;transform:translateY(28px)}
.reveal-hero.in{opacity:1;transform:none;transition:opacity .8s var(--ease),transform .8s var(--ease)}
```

Cuando Lucas tenga la imagen: agregar `background-image` con `assets/hero-bg.jpg` en `.hero`
(antes del `var(--negro)` de fallback).

- [ ] **Step 3: Animación de entrada en `js/main.js`**

```js
// tipografía cinética del hero: entra en secuencia al cargar
const heroEls = document.querySelectorAll('.reveal-hero');
heroEls.forEach((el, i) => {
  setTimeout(() => el.classList.add('in'), 120 + i * 130);
});
```

- [ ] **Step 4: Verificar en el navegador**

Recargar. Esperado: al cargar, las líneas del titular "Desarrollamos / producimos / e
importamos" aparecen en secuencia (fade + subida), el hero ocupa toda la pantalla, fondo
negro, "internacionales." y "team-uniforms.com" en periwinkle. Probar con
`prefers-reduced-motion` activado (DevTools › Rendering › Emulate CSS prefers-reduced-motion):
el texto debe verse de una, sin animar.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "Hero a pantalla completa con tipografía cinética de entrada"
```

---

### Task 4: Secciones "Socio de producción" y "Qué hacemos" (blanco)

**Files:**
- Modify: `index.html` (dos secciones blancas)
- Modify: `css/styles.css`

**Interfaces:**
- Consumes: `.seccion--blanco`, `.contenedor`. Usa `assets/prenda.jpg` y `assets/techpack.jpg` (placeholders con fondo negro hasta tener las fotos).

- [ ] **Step 1: HTML de las dos secciones** (dentro de `<main>`, después del hero)

```html
<section id="socio" class="seccion seccion--blanco bloque">
  <div class="contenedor bloque-grid">
    <div class="bloque-img ph">[ foto: remera oversize ]</div>
    <div class="bloque-tx">
      <p class="label label--osc reveal">Qué somos</p>
      <h2 class="tit-xl reveal">Somos tu socio de producción.</h2>
      <p class="tit-sub reveal">Conectamos marcas con producción internacional.</p>
      <p class="parrafo reveal">Te acompañamos desde la idea inicial hasta el producto terminado, ayudando a desarrollar prendas, seleccionar materiales, validar muestras y coordinar la producción final.</p>
    </div>
  </div>
</section>

<section id="capacidades" class="seccion seccion--blanco bloque">
  <div class="contenedor bloque-grid bloque-grid--inv">
    <div class="bloque-tx">
      <p class="label label--osc reveal">Qué hacemos</p>
      <ul class="lista-cap reveal">
        <li>Moldería</li><li>Materiales</li><li>Impresiones</li>
        <li>Muestras</li><li>Producción</li><li>Logística</li>
      </ul>
      <p class="parrafo reveal">Te acompañamos en cada etapa del proceso.</p>
    </div>
    <div class="bloque-img ph">[ foto: tech pack + swatches ]</div>
  </div>
</section>
```

- [ ] **Step 2: Estilos de bloque reutilizables**

```css
.label--osc{color:var(--gris)}
.bloque-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,6vw,80px);align-items:center}
.bloque-img{aspect-ratio:4/5;background-size:cover;background-position:center;border-radius:6px}
.ph{background:var(--negro);color:#3a3a3d;display:flex;align-items:center;justify-content:center;font-size:13px;letter-spacing:1px;font-weight:300}
.tit-xl{font-weight:800;font-size:clamp(34px,5.5vw,76px);line-height:.98;letter-spacing:-1.5px;margin:14px 0}
.tit-sub{font-weight:700;font-size:clamp(16px,2vw,22px);margin-bottom:18px}
.parrafo{font-weight:400;font-size:16px;line-height:1.55;color:var(--gris);max-width:46ch}
.lista-cap{list-style:none;margin:14px 0 18px}
.lista-cap li{font-weight:800;font-size:clamp(30px,5vw,60px);line-height:1.02;letter-spacing:-1px}
@media (max-width:760px){.bloque-grid{grid-template-columns:1fr}.bloque-grid--inv .bloque-img{order:-1}}
```

- [ ] **Step 3: Verificar en el navegador**

Recargar. Esperado: dos secciones blancas; la primera con placeholder de foto a la
izquierda y texto a la derecha; la segunda invertida (texto izquierda, foto derecha) con
la lista Moldería→Logística en tipografía gigante. En mobile se apilan en una columna.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "Secciones blancas: socio de producción y capacidades"
```

---

### Task 5: Sección "Problema que resolvemos" (negro)

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`

- [ ] **Step 1: HTML** (después de `#capacidades`)

```html
<section id="problema" class="seccion">
  <div class="contenedor">
    <p class="label reveal">El problema</p>
    <h2 class="tit-xl reveal">Buenas ideas que no encuentran cómo volverse producto.</h2>
    <ul class="lista-prob">
      <li class="reveal">No entienden de moldería</li>
      <li class="reveal">No conocen los materiales adecuados</li>
      <li class="reveal">No saben preparar tech packs</li>
      <li class="reveal">No tienen acceso a producción confiable</li>
      <li class="reveal">No saben validar muestras</li>
      <li class="reveal">No tienen estructura para escalar</li>
    </ul>
    <p class="cierre reveal">Somos el puente entre la <span class="acento">visión creativa</span> y la <span class="acento">ejecución productiva.</span></p>
  </div>
</section>
```

- [ ] **Step 2: Estilos**

```css
.lista-prob{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:1px;margin:40px 0;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08)}
.lista-prob li{background:var(--negro);padding:26px 24px;font-weight:500;font-size:clamp(15px,2vw,19px);color:#d6d6db}
.cierre{font-weight:800;font-size:clamp(26px,4.5vw,52px);line-height:1.1;letter-spacing:-1px;max-width:18ch}
@media (max-width:680px){.lista-prob{grid-template-columns:1fr}}
```

- [ ] **Step 3: Verificar en el navegador**

Recargar. Esperado: sección negra con título grande, grilla de 6 fricciones (2 columnas en
desktop, 1 en mobile) con líneas finas divisorias, y la frase de cierre con "visión
creativa" y "ejecución productiva" en periwinkle.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "Sección problema que resolvemos"
```

---

### Task 6: Sección "Proceso" ⭐ (negro, fijada con barra de progreso)

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`
- Modify: `js/main.js`

**Interfaces:**
- Produces: `<section id="proceso">` con sub-bloque fijado (sticky) y barra de progreso
  controlada por scroll.

- [ ] **Step 1: HTML del proceso**

```html
<section id="proceso" class="proceso">
  <div class="proceso-sticky">
    <div class="contenedor">
      <p class="label reveal">El proceso</p>
      <h2 class="tit-xl">De la <em>idea</em> al producto terminado.</h2>
      <p class="parrafo parrafo--claro">Cada proyecto pasa por un proceso de validación y desarrollo que asegura que el producto final refleje exactamente la visión de la marca.</p>
      <ol class="pasos">
        <li><span class="paso-n acento">01</span> Idea</li>
        <li><span class="paso-n acento">02</span> Diseño</li>
        <li><span class="paso-n acento">03</span> Tech Pack</li>
        <li><span class="paso-n acento">04</span> Muestra</li>
        <li><span class="paso-n acento">05</span> Producción</li>
        <li><span class="paso-n acento">06</span> Entrega</li>
      </ol>
      <div class="progreso"><div class="progreso-barra" id="progBarra"></div></div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Estilos (sticky + barra)**

```css
.proceso{background:var(--negro);position:relative;height:230vh}
.proceso-sticky{position:sticky;top:0;min-height:100vh;display:flex;align-items:center;padding:80px 0}
.proceso em{font-style:italic;color:var(--periwinkle)}
.parrafo--claro{color:#c9c9ce;margin:18px 0 0;max-width:54ch}
.pasos{list-style:none;display:grid;grid-template-columns:repeat(3,1fr);gap:24px 18px;margin:48px 0 36px}
.pasos li{font-weight:800;font-size:clamp(20px,3vw,34px);letter-spacing:-.5px;display:flex;flex-direction:column;gap:4px}
.paso-n{font-size:13px;font-weight:700;letter-spacing:2px}
.progreso{height:3px;background:rgba(255,255,255,.12);border-radius:2px;overflow:hidden}
.progreso-barra{height:100%;width:0;background:var(--periwinkle);border-radius:2px;transition:width .1s linear}
@media (max-width:680px){.pasos{grid-template-columns:1fr 1fr}.proceso{height:200vh}}
```

- [ ] **Step 3: Lógica de la barra de progreso en `js/main.js`**

```js
// barra de progreso del proceso, ligada al scroll dentro de la sección
const proceso = document.getElementById('proceso');
const progBarra = document.getElementById('progBarra');
if (proceso && progBarra) {
  const actualizarProgreso = () => {
    const r = proceso.getBoundingClientRect();
    const total = proceso.offsetHeight - window.innerHeight;
    const avance = Math.min(Math.max(-r.top / total, 0), 1);
    progBarra.style.width = (avance * 100).toFixed(1) + '%';
  };
  actualizarProgreso();
  window.addEventListener('scroll', actualizarProgreso, {passive:true});
}
```

- [ ] **Step 4: Verificar en el navegador**

Recargar y scrollear lento sobre la sección Proceso. Esperado: el bloque queda **fijo**
mientras se scrollea ~2 pantallas, y la barra de progreso se llena de 0% a 100% en
periwinkle a medida que avanza. Los 6 pasos numerados visibles. En mobile, pasos en 2
columnas y la sección sigue funcionando.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "Sección proceso fijada con barra de progreso al scroll"
```

---

### Task 7: Sección "Categorías" + banda "MOQ flexible" (blanco)

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`

**Interfaces:**
- Usa una grilla 3×3 de placeholders (`assets/cat-1.jpg` … `cat-9.jpg`) reemplazables luego.

- [ ] **Step 1: HTML**

```html
<section id="categorias" class="seccion seccion--blanco">
  <div class="contenedor cat-grid">
    <div class="cat-fotos reveal">
      <span class="ph"></span><span class="ph"></span><span class="ph"></span>
      <span class="ph"></span><span class="ph"></span><span class="ph"></span>
      <span class="ph"></span><span class="ph"></span><span class="ph"></span>
    </div>
    <div class="cat-tx">
      <ul class="lista-cat reveal">
        <li>Streetwear</li><li>Sportswear</li><li>Gymwear</li>
        <li>Uniformes</li><li>Merchandising</li><li>Producción personalizada</li>
      </ul>
      <p class="cat-acento acento reveal">Producción sin límite de categorías.</p>
      <p class="parrafo reveal">Trabajamos sobre proyectos existentes o desarrollamos productos desde cero según las necesidades de cada marca.</p>
    </div>
  </div>
</section>

<section class="seccion seccion--blanco moq">
  <div class="contenedor moq-in">
    <span class="moq-num reveal">120</span>
    <div class="reveal">
      <p class="moq-tit">MOQ flexible</p>
      <p class="parrafo">Unidades mínimas combinables, adaptadas a cada proyecto.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Estilos**

```css
.cat-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,6vw,72px);align-items:center}
.cat-fotos{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.cat-fotos .ph{aspect-ratio:1;border-radius:4px;background:#ececee}
.lista-cat{list-style:none}
.lista-cat li{font-weight:800;font-size:clamp(26px,4.4vw,56px);line-height:1.02;letter-spacing:-1px}
.cat-acento{font-weight:700;font-size:clamp(18px,2.4vw,26px);margin:20px 0 14px}
.moq{padding-top:0}
.moq-in{display:flex;align-items:center;gap:clamp(20px,5vw,56px);border-top:1px solid var(--gris-claro);padding-top:48px}
.moq-num{font-weight:800;font-size:clamp(64px,12vw,150px);letter-spacing:-3px;line-height:1}
.moq-tit{font-weight:700;font-size:clamp(20px,3vw,30px)}
@media (max-width:760px){.cat-grid{grid-template-columns:1fr}}
```

- [ ] **Step 3: Verificar en el navegador**

Recargar. Esperado: sección blanca con grilla 3×3 de cuadrados grises (placeholders de
producto) a un lado y la lista Streetwear→Producción personalizada en tipografía gigante;
"Producción sin límite de categorías." en periwinkle. Debajo, la banda MOQ con el "120"
enorme. Todo se apila bien en mobile.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "Sección categorías y banda MOQ flexible"
```

---

### Task 8: Sección "Certificaciones / calidad" (negro)

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`

- [ ] **Step 1: HTML** (id `#calidad`, target del nav)

```html
<section id="calidad" class="seccion">
  <div class="contenedor">
    <p class="label reveal">Calidad</p>
    <h2 class="tit-xl reveal">Producción por estándares internacionales.</h2>
    <ul class="certs">
      <li class="reveal"><span class="cert-n">ISO 9001</span><span class="cert-d">Gestión de calidad</span></li>
      <li class="reveal"><span class="cert-n">ISO 14001</span><span class="cert-d">Gestión ambiental</span></li>
      <li class="reveal"><span class="cert-n">ISO 45001</span><span class="cert-d">Seguridad y salud</span></li>
      <li class="reveal"><span class="cert-n">OEKO-TEX</span><span class="cert-d">Textiles sin sustancias nocivas</span></li>
    </ul>
  </div>
</section>
```

- [ ] **Step 2: Estilos**

```css
.certs{list-style:none;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-top:48px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08)}
.certs li{background:var(--negro);padding:30px 22px;display:flex;flex-direction:column;gap:8px}
.cert-n{font-weight:800;font-size:clamp(18px,2.4vw,26px);letter-spacing:-.5px}
.cert-d{font-weight:400;font-size:13px;color:var(--gris)}
@media (max-width:760px){.certs{grid-template-columns:1fr 1fr}}
```

- [ ] **Step 3: Verificar en el navegador**

Recargar. Esperado: sección negra con las 4 certificaciones en grilla (4 columnas desktop,
2 en mobile), cada una con el nombre en grande y una descripción corta en gris.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "Sección certificaciones y calidad"
```

---

### Task 9: Sección "Contacto / Empecemos" (formulario Netlify + WhatsApp) + footer

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`

**Interfaces:**
- El formulario usa atributos de **Netlify Forms** (`data-netlify="true"`, `name="contacto"`
  y un input `form-name` oculto). El botón de WhatsApp arma el deep link con mensaje.

- [ ] **Step 1: HTML del contacto + footer**

```html
<section id="contacto" class="seccion contacto">
  <div class="contenedor contacto-grid">
    <div>
      <p class="label reveal">Empecemos</p>
      <h2 class="tit-xl reveal">Transformá tu idea en un producto listo para vender.</h2>
      <a class="btn-wa reveal" href="https://wa.me/5492364341337?text=Hola%20Team%20Uniforms%2C%20quiero%20desarrollar%20una%20colecci%C3%B3n." target="_blank" rel="noopener">
        Escribinos por WhatsApp
      </a>
      <div class="contacto-datos reveal">
        <a href="https://instagram.com/teamuniformsarg" target="_blank" rel="noopener">@teamuniformsarg</a>
        <a href="mailto:teamuniformsgroup@gmail.com">teamuniformsgroup@gmail.com</a>
        <span>Buenos Aires, Argentina</span>
      </div>
    </div>
    <form class="form reveal" name="contacto" method="POST" data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="contacto">
      <p class="oculto"><label>No llenar: <input name="bot-field"></label></p>
      <label>Nombre<input type="text" name="nombre" required></label>
      <label>Marca<input type="text" name="marca"></label>
      <label>Tipo de proyecto
        <select name="proyecto">
          <option>Streetwear</option><option>Sportswear</option><option>Gymwear</option>
          <option>Uniformes</option><option>Merchandising</option><option>Otro</option>
        </select>
      </label>
      <label>Mensaje<textarea name="mensaje" rows="4" required></textarea></label>
      <button type="submit" class="btn-enviar">Enviar consulta</button>
    </form>
  </div>
</section>

<footer class="footer">
  <div class="contenedor footer-in">
    <span class="logo-mono">TU</span>
    <span class="footer-web acento">team-uniforms.com</span>
    <span class="footer-cp">© 2026 Team Uniforms · Buenos Aires, ARG</span>
  </div>
</footer>
```

- [ ] **Step 2: Estilos**

```css
.contacto-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,6vw,72px)}
.btn-wa{display:inline-block;background:var(--periwinkle);color:var(--negro);font-weight:700;padding:16px 30px;border-radius:40px;margin:28px 0;transition:transform var(--t-rapida)}
.btn-wa:hover{transform:translateY(-2px)}
.contacto-datos{display:flex;flex-direction:column;gap:8px;color:var(--gris);font-size:15px}
.contacto-datos a:hover{color:#fff}
.form{display:flex;flex-direction:column;gap:16px}
.form label{display:flex;flex-direction:column;gap:7px;font-size:13px;font-weight:500;color:var(--gris-claro)}
.form input,.form select,.form textarea{background:transparent;border:1px solid rgba(255,255,255,.18);border-radius:8px;padding:12px 14px;color:#fff;transition:border-color var(--t-rapida)}
.form input:focus,.form select,.form textarea:focus{outline:none;border-color:var(--periwinkle)}
.form select option{color:#000}
.oculto{position:absolute;left:-9999px}
.btn-enviar{background:#fff;color:var(--negro);font-weight:700;padding:15px;border-radius:8px;margin-top:6px;transition:opacity var(--t-rapida)}
.btn-enviar:hover{opacity:.85}
.footer{background:var(--negro);border-top:1px solid rgba(255,255,255,.08);padding:36px 0}
.footer-in{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}
.footer-web{font-weight:500}.footer-cp{font-size:13px;color:var(--gris)}
@media (max-width:760px){.contacto-grid{grid-template-columns:1fr}}
```

- [ ] **Step 3: Verificar en el navegador**

Recargar. Esperado: sección de contacto con título grande, botón de WhatsApp en periwinkle
(al hacer clic abre wa.me con el mensaje pre-armado), datos (IG, mail, ubicación) y el
formulario a la derecha con foco en periwinkle. Footer abajo. El envío del formulario
recién funciona una vez publicado en Netlify (es esperado que en local no envíe).

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "Sección contacto con WhatsApp, formulario Netlify y footer"
```

---

### Task 10: Animaciones de reveal al scroll (IntersectionObserver) + reduced-motion

**Files:**
- Modify: `css/styles.css` (estado base de `.reveal`)
- Modify: `js/main.js` (observer)

**Interfaces:**
- Consumes: todos los elementos `.reveal` ya sembrados en las tareas anteriores.

- [ ] **Step 1: Estado base de `.reveal` en CSS**

```css
.reveal{opacity:0;transform:translateY(30px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
.reveal.in{opacity:1;transform:none}
@media (prefers-reduced-motion: reduce){.reveal{opacity:1;transform:none}}
```

- [ ] **Step 2: IntersectionObserver en `js/main.js`**

```js
// reveals al entrar en viewport
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -10% 0px'});
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
}
```

- [ ] **Step 3: Verificar en el navegador**

Recargar y scrollear de arriba a abajo. Esperado: los bloques de cada sección aparecen con
fade + subida suave al entrar en pantalla (una sola vez). Con `prefers-reduced-motion`
activado (DevTools › Rendering), todo se ve sin animación, sin contenido oculto.

- [ ] **Step 4: Commit**

```bash
git add css/styles.css js/main.js
git commit -m "Animaciones de aparición al scroll con IntersectionObserver"
```

---

### Task 11: Pasada final — responsive, performance, SEO y deploy

**Files:**
- Modify: `index.html`, `css/styles.css`
- Create: `assets/favicon.svg`
- Create: `netlify.toml`
- Modify: `README.md` (pasos de publicación)

- [ ] **Step 1: Revisar responsive en 360px, 768px y 1440px**

Con DevTools (modo responsive) recorrer el sitio entero en esos tres anchos. Ajustar
cualquier desborde horizontal, texto que se corte o espaciado feo. Confirmar que el menú
mobile funciona y que ninguna sección genera scroll horizontal.

- [ ] **Step 2: Performance — `content-visibility` y favicon**

En `css/styles.css` agregar a las secciones de abajo del fold:
```css
.cv{content-visibility:auto;contain-intrinsic-size:auto 700px}
```
y sumar la clase `cv` a las `<section>` que no son el hero. Crear `assets/favicon.svg`
(un cuadrado negro con "TU" en blanco) y enlazarlo en `<head>`:
```html
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
```

- [ ] **Step 3: Crear `netlify.toml`**

```toml
[build]
  publish = "."
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- [ ] **Step 4: Documentar publicación en `README.md`**

Agregar una sección "Publicar en Netlify" con: conectar el repo en netlify.com, deploy
automático, configurar dominio `team-uniforms.com`, y dónde aparecen las respuestas del
formulario (panel Netlify › Forms).

- [ ] **Step 5: Verificar en el navegador**

Recargar. Esperado: favicon visible en la pestaña, sin scroll horizontal en ningún ancho,
todo legible y prolijo. Consola sin errores.

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css assets/favicon.svg netlify.toml README.md
git commit -m "Pasada final: responsive, performance, SEO y config de Netlify"
```

---

## Reemplazo de imágenes (después del plan)

Cuando Lucas exporte las fotos del deck, se reemplazan los placeholders `.ph` por
`background-image` reales (hero, prenda, tech pack, grilla de categorías) y se agregan
`logo-blanco`/`logo-negro` y `assets/og.jpg`. Es una pasada aparte, una imagen por commit.

## Pendientes que dependen del cliente

- Logo en SVG/PNG (negro y blanco).
- 6-8 fotos del deck exportadas.
- Confirmar copy final de cada sección.
- Cuenta de Netlify + acceso al DNS de team-uniforms.com para el dominio.
