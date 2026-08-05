# Team Uniforms

Landing premium para **Team Uniforms** — partner de desarrollo, producción e importación
textil para marcas (Buenos Aires, ARG).

> De la idea al producto terminado.

## Qué es
Sitio de una sola página (landing) con scroll narrativo, pensado para generar
**consultas y reuniones** (leads), no para vender online.

## Stack
- HTML + CSS + JavaScript **vanilla** (sin frameworks, sin build).
- Tipografía: Manrope (Google Fonts).
- Animaciones con `IntersectionObserver` y CSS.

## Estructura
```
team-uniforms/
├── index.html          Estructura y contenido
├── css/styles.css      Diseño
├── js/main.js          Animaciones y scroll
├── assets/             Logo e imágenes
└── docs/               Documentación de diseño (spec)
```

## Cómo verlo
Abrir `index.html` en el navegador (doble clic), o usar un servidor local.

## Publicación
Repo privado en GitHub + hosting en Netlify (dominio **tu-teamuniforms.com**, comprado en Namecheap).

## Publicar en Netlify

1. **Conectar el repo:** entrá a [netlify.com](https://netlify.com), hacé clic en "Add new site" › "Import an existing project" y seleccioná el repo `team-uniforms` de GitHub.
2. **Deploy automático:** Netlify detecta el `netlify.toml` y publica la raíz del repo. Cada `git push` a `main` dispara un nuevo deploy automáticamente.
3. **Configurar el dominio:** en el panel de Netlify, andá a "Domain management" › "Add a domain" e ingresá `tu-teamuniforms.com`. Luego apuntá los DNS en Namecheap a los nameservers de Netlify (te los muestra en pantalla).
4. **Ver respuestas del formulario:** las consultas enviadas desde el formulario de contacto aparecen en el panel de Netlify, sección "Forms". Cada submission llega también por mail si configurás una notificación en "Form notifications".

## Contacto del cliente
- Web: tu-teamuniforms.com
- Instagram: [@teamuniformsarg](https://instagram.com/teamuniformsarg)
- Mail: teamuniformsgroup@gmail.com
- WhatsApp: +54 9 2364 34-1337
