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

  const validaciones = document.querySelector('#brief-validaciones');
  if (validaciones) validaciones.innerHTML = (c.validaciones || []).map((v) => `<li>${v}</li>`).join('');

  texto('#perf-target', c.perfTarget);

  const fibra = document.querySelector('#fibra');
  if (fibra) fibra.innerHTML = (c.fibra || []).map((f) => `<h4>${f[0]}<sup>%</sup><i>${f[1]}</i></h4>`).join('');
  texto('#fibra-nota', c.fibraNota);

  texto('#ing-subtitulo', c.ingSubtitulo);
  texto('#ing-critico', c.ingCritico);

  const ingNo = document.querySelector('#ing-no');
  if (ingNo) ingNo.innerHTML = (c.ingNo || []).map((x) => `<li>${x}</li>`).join('');
  const ingSi = document.querySelector('#ing-si');
  if (ingSi) ingSi.innerHTML = (c.ingSi || []).map((x) => `<li>${x}</li>`).join('');

  const notas = document.querySelector('#notas');
  if (notas) notas.innerHTML = (c.notas || '').split('\n').filter(Boolean).map((p) => `<p>${p}</p>`).join('');
  texto('#notas-cierre', c.notasCierre);

  const factoryCards = document.querySelector('#factory-cards');
  if (factoryCards) {
    factoryCards.innerHTML = (c.factory || []).map((f, i) =>
      `<article><b>${String(i + 1).padStart(2, '0')}</b><h3>${f.titulo || ''}</h3><ul>${(f.items || []).map((it) => `<li>${it}</li>`).join('')}</ul></article>`
    ).join('');
  }
  texto('#factory-target', c.factoryTarget);

  texto('#obj-titulo', c.objTitulo);
  texto('#obj-texto', c.objTexto);
  texto('#obj-strong', c.objStrong);
  const objLista = document.querySelector('#obj-lista');
  if (objLista) objLista.innerHTML = (c.objLista || []).map((x) => `<li>${x}</li>`).join('');

  const timeline = document.querySelector('#timeline');
  if (timeline) {
    timeline.innerHTML = (c.timeline || []).map((t, i) =>
      `<article><b>${String(i + 1).padStart(2, '0')} <i>${i === (c.timeline.length - 1) ? '✓' : '→'}</i></b><h3>${t.titulo || ''}</h3><small>${t.estado || ''}</small><ul>${(t.items || []).map((it) => `<li>${it}</li>`).join('')}</ul></article>`
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
