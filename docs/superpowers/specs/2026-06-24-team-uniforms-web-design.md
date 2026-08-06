# Team Uniforms — Documento de diseño (spec)

- **Fecha:** 2026-06-24
- **Proyecto:** Landing premium para Team Uniforms
- **Estado:** Aprobado para implementación

---

## 1. Resumen

Landing de una sola página para **Team Uniforms**, partner de desarrollo, producción e
importación textil para marcas (Buenos Aires, Argentina). El sitio comunica el concepto
central **"De la idea al producto terminado"** y posiciona a la empresa como un **socio
estratégico de producción premium**, no como una fábrica, importador o catálogo.

**KPI principal:** generar consultas / reuniones / leads calificados. No es un ecommerce
ni un catálogo. El éxito se mide en que el visitante quiera dar el siguiente paso y
contactar (WhatsApp o formulario).

## 2. Idioma y tono

- **Idioma:** español, conservando los términos técnicos de la industria en inglés
  (tech pack, MOQ, streetwear, sportswear, gymwear, merchandising).
- **Tono:** confianza, criterio, precisión, sofisticación, profesionalismo, premium.
- **Evitar:** estética de fábrica, industria pesada, catálogo mayorista, ecommerce
  barato, landing corporativa genérica.

## 3. Enfoque técnico

- **Stack:** HTML + CSS + JavaScript **vanilla**. Sin frameworks, sin build, sin
  dependencias externas (más rápido = sensación premium, y acorde al nivel del desarrollador).
- **Organización en archivos separados** (un escalón por encima de los proyectos
  anteriores de un solo `index.html`):

```
team-uniforms/
├── index.html
├── css/styles.css
├── js/main.js
├── assets/
│   ├── logo-blanco.svg|png
│   ├── logo-negro.svg|png
│   └── (fotos exportadas del deck)
├── docs/superpowers/specs/2026-06-24-team-uniforms-web-design.md
├── .gitignore
└── README.md
```

## 4. Sistema visual

Fiel al deck de ventas que ya usa el cliente.

### Color
| Token | Valor | Uso |
|---|---|---|
| `--negro` | `#0A0A0A` | Fondo de secciones oscuras, texto sobre blanco |
| `--blanco` | `#FFFFFF` | Fondo de secciones claras, texto sobre negro |
| `--gris` | `#6B6B70` | Texto secundario |
| `--gris-claro` | `#E5E5E7` | Líneas, bordes sutiles |
| `--periwinkle` | `#A5B0E1` | **Acento.** Links, frases destacadas, números del proceso, `team-uniforms.com`. Usar con cuentagotas. |

Principios: **alto contraste**, **mucho aire**, **tipografía protagonista**.

### Tipografía
- **Familia única: Manrope** (Google Fonts), pesos 300 a 800.
  - Headlines: peso 800, tamaños enormes con `clamp()`, interlineado ajustado.
  - Logo / labels / "ARG, Buenos aires.": peso 300, con letter-spacing amplio.
  - Cuerpo: peso 400–500.
- Microetiquetas en mayúsculas con tracking amplio (look de especificación técnica).

### Ritmo editorial
Las secciones alternan **fondo negro ↔ fondo blanco** a pantalla completa, replicando el
sello visual del deck. Composición tipo: tipografía grande de un lado, imagen del otro,
con caption chico ("ARG, Buenos aires." / "team-uniforms.com").

## 5. Estructura y contenido (secciones)

Header fijo con blur + las 8 secciones del brief, en orden narrativo:

1. **Hero (negro).** Fondo: textura de tela negra. Logo Team Uniforms. Titular cinético:
   *"Desarrollamos, producimos e importamos colecciones para marcas que buscan crecer con
   estándares internacionales."* Caption "ARG, Buenos aires." Indicador de scroll.
2. **Socio de producción (blanco).** Foto de remera oversize negra + titular gigante
   *"Somos tu socio de producción."* Bajada: *"Conectamos marcas con producción
   internacional."* + párrafo de acompañamiento (idea → producto terminado).
3. **Qué hacemos / capacidades (blanco).** Lista grande: *Moldería · Materiales ·
   Impresiones · Muestras · Producción · Logística.* Foto: flatlay de tech pack + swatches.
   Frase: *"Te acompañamos en cada etapa del proceso."*
4. **Problema que resolvemos (negro).** Las fricciones del cliente típico (no entienden
   moldería, materiales, tech packs, producción confiable, validar muestras, escalar).
   Cierre: *"Somos el puente entre la visión creativa y la ejecución productiva."*
5. **Proceso ⭐ (negro).** Sección estrella. Los 6 pasos numerados (del deck):
   `01 Idea · 02 Diseño · 03 Tech Pack · 04 Muestra · 05 Producción · 06 Entrega`,
   en periwinkle. **Scroll narrativo con sección fijada (pinned)** y barra de progreso.
   Frase ancla: *"De la idea al producto terminado."*
6. **Categorías (blanco).** Grilla 3×3 de productos (hoodie, tee, jacket, shorts, tank,
   joggers, cap, tote, polo) + lista gigante: *Streetwear · Sportswear · Gymwear ·
   Uniformes · Merchandising · Producción personalizada.* Acento: *"Producción sin límite
   de categorías."* + *"Trabajamos sobre proyectos existentes o desarrollamos productos
   desde cero según las necesidades de cada marca."*
7. **MOQ flexible.** Dato fuerte: *"MOQ flexible — 120 unidades combinables."*
8. **Certificaciones / calidad (negro).** ISO 9001 · ISO 14001 · ISO 45001 · OEKO-TEX,
   presentadas con sobriedad. *"Producción por estándares internacionales."*
9. **Contacto "Empecemos".** CTA final: *"Transformá tu idea en un producto listo para
   vender."* Botón WhatsApp + formulario. Datos: Instagram, mail, ubicación.
10. **Footer.** Logo, links, "team-uniforms.com", copyright.

> Nota: el brief listaba 8 secciones; acá se desglosan en bloques para el render, pero el
> contenido es el mismo. El "Proceso" usa los 6 pasos sintetizados del deck (no los 8
> sub-pasos del brief), que es la versión canónica que el cliente comunica.

## 6. Motion / interacción

La web debe sentirse **inmersiva, no estática** (requisito del brief).

- **Smooth scroll** + reveals al entrar en viewport (`IntersectionObserver`: fade +
  translate sutil).
- **Tipografía cinética** en el hero (las líneas entran en secuencia).
- **Sección Proceso fijada (pinned)** con barra de progreso a medida que se scrollea.
- **Microinteracciones** en botones (hover elegante / efecto magnético sutil).
- **Transiciones suaves** entre secciones (el cambio negro↔blanco se siente fluido).
- **Accesibilidad:** respetar `prefers-reduced-motion` (desactiva animaciones si el
  usuario lo pidió en su sistema).
- Sin librerías de animación: todo `IntersectionObserver` + CSS.

## 7. Contacto (el KPI)

Doble vía, ambas sin backend propio:

1. **WhatsApp directo.** Botón con deep link a `+54 9 2364 34-1337` y mensaje pre-armado
   (ej: *"Hola, quiero desarrollar una colección con Team Uniforms…"*).
2. **Formulario.** Campos: nombre · marca · tipo de proyecto (streetwear/sportswear/
   gymwear/uniformes/merchandising/otro) · mensaje. Se envía al mail del cliente mediante
   **Netlify Forms** (sin servidor, sin cuenta de terceros extra).

Datos de contacto reales:
- Instagram: @teamuniformsarg
- Mail: teamuniformsgroup@gmail.com
- WhatsApp: +54 9 2364 34-1337
- Ubicación: Buenos Aires, Argentina

## 8. Performance y responsive

- **Mobile-first**, totalmente responsive (el grueso del tráfico B2B llega desde el
  celular vía Instagram).
- Imágenes optimizadas (formato `.webp` cuando se pueda).
- `content-visibility: auto` en secciones para rendimiento (patrón ya usado en el proyecto).
- Meta tags SEO + Open Graph (para que el link se vea bien al compartirlo).

## 9. Assets necesarios (el desarrollador exporta del PDF/cliente)

- Logo Team Uniforms en **negro** y en **blanco** (SVG ideal, PNG sirve).
- ~6-8 imágenes del deck: textura de tela del hero, remera oversize negra, flatlay de
  tech pack/swatches, grilla de productos, caja branded, workspace.
- Se piden **durante la implementación**, sección por sección. Mientras tanto se usan
  placeholders prolijos para no frenar el avance.

## 10. Publicación

- **Repo privado** en GitHub (cliente = privado, según la receta del desarrollador).
- **Hosting: Netlify** conectado al repo → gratis, HTTPS automático, repo privado OK,
  dominio propio `team-uniforms.com` gratis, y **Netlify Forms** resuelve el formulario.
- Se actualiza solo con cada `git push`.

## 11. Fuera de alcance (YAGNI)

- Sin ecommerce, carrito ni pagos.
- Sin catálogo navegable de productos ni fichas.
- Sin CMS ni panel de administración.
- Sin multi-idioma (solo español) en esta primera versión.
- Sin blog.

## 12. Criterios de éxito

- La web se siente premium, editorial y técnica (nivel Apple / Fear of God), no genérica.
- El visitante entiende en segundos qué hace Team Uniforms y para quién.
- El camino al contacto (WhatsApp / formulario) es claro y está siempre a mano.
- Carga rápido y funciona perfecto en celular.
- Respeta el sistema visual del cliente (negro/blanco/periwinkle, Manrope, ritmo editorial).
