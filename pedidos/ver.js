import { supabase } from './supabase.js';

// El id puede venir por query (?id=) o por la ruta limpia /pedidos/<id>
// (el redirect de Netlify es un rewrite: mantiene la ruta y no expone ?id=).
let id = new URLSearchParams(location.search).get('id');
if (!id) {
  const m = location.pathname.match(/\/pedidos\/([^/]+)\/?$/);
  if (m && m[1] !== 'ver.html') id = decodeURIComponent(m[1]);
}

function mostrarError() {
  document.querySelectorAll('body > *:not(#pedido-error):not(script)').forEach((el) => { el.hidden = true; });
  document.querySelector('#pedido-error').hidden = false;
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

  texto('#hero-producto', pedido.producto);
  texto('#hero-codigo', pedido.codigo);
  texto('#brief', c.brief);
  document.title = `${pedido.producto || 'Pedido'} — Team Uniforms`;

  imagen('[data-foto-referencia]', c.fotoReferencia);
  imagen('[data-technical-image="clean"]', c.flatLimpio);
  imagen('[data-technical-image="pom"]', c.flatPom);

  const mats = document.querySelector('#materiales');
  if (mats) mats.innerHTML = (c.materiales || []).map((m) => `<i>${m}</i>`).join('');

  const pomtable = document.querySelector('#pomtable');
  if (pomtable) {
    pomtable.innerHTML = '<div class="tr th"><span>MEASUREMENT</span><b>TARGET</b></div>' +
      (c.poms || []).map((r, i) =>
        `<div class="tr"><span><i>${String(i + 1).padStart(2, '0')}</i>${r[0]}</span><b>${r[1]}</b></div>`
      ).join('');
  }

  const details = document.querySelector('.details');
  if (details) {
    details.innerHTML = (c.detalles || []).map((d, i) =>
      `<article class="detail-card"><figure class="detail-media"><img src="${d.imagen || ''}" alt="${d.titulo || ''}" loading="lazy"></figure>
       <div class="caption"><b>${String(i + 1).padStart(2, '0')}</b><strong>${d.titulo || ''}</strong><small>${d.descripcion || ''}</small></div></article>`
    ).join('');
  }
}

async function cargar() {
  if (!id) return mostrarError();
  const { data, error } = await supabase
    .from('pedidos')
    .select('producto, codigo, estado, contenido')
    .eq('id', id)
    .single();
  if (error || !data) return mostrarError();
  render(data);
}

cargar();
