import { supabase } from '../supabase.js';

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
let id = params.get('id');

window._detalles = [];
window._fotos = { fotoReferencia: '', flatLimpio: '', flatPom: '' };
window._factory = [];
window._timeline = [];

async function requerirSesion() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { location.href = 'index.html'; return false; }
  return true;
}

/* ── Medidas (POM) ── */
function pomRow(medida = '', target = '') {
  const div = document.createElement('div');
  div.className = 'pom-row';
  div.innerHTML = `<input placeholder="Medida" value="${medida}"><input placeholder="Target" value="${target}"><button type="button" class="btn btn-ghost">✕</button>`;
  div.querySelector('button').onclick = () => div.remove();
  return div;
}
$('#add-pom').onclick = () => $('#poms').appendChild(pomRow());

/* ── Fibra (target fiber content) ── */
function fibraRow(porcentaje = '', material = '') {
  const div = document.createElement('div');
  div.className = 'pom-row';
  div.innerHTML = `<input placeholder="%" value="${porcentaje}"><input placeholder="Material" value="${material}"><button type="button" class="btn btn-ghost">✕</button>`;
  div.querySelector('button').onclick = () => div.remove();
  return div;
}
$('#add-fibra').onclick = () => $('#fibras').appendChild(fibraRow());

/* ── Factory cards (manufacturing requirements) ── */
function pintarFactory() {
  const cont = $('#factory-lista');
  cont.innerHTML = window._factory.map((f, i) => `
    <div class="pom-row" style="align-items:flex-start" data-i="${i}">
      <input placeholder="Título" value="${f.titulo || ''}" data-tipo="titulo">
      <textarea placeholder="Items (uno por línea)" rows="3" style="flex:1" data-tipo="items">${(f.items || []).join('\n')}</textarea>
      <button type="button" class="btn btn-ghost" data-tipo="quitar">✕</button>
    </div>`).join('');

  cont.querySelectorAll('.pom-row').forEach((row) => {
    const i = Number(row.dataset.i);
    row.querySelector('[data-tipo="titulo"]').oninput = (e) => { window._factory[i].titulo = e.target.value; };
    row.querySelector('[data-tipo="items"]').oninput = (e) => {
      window._factory[i].items = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
    };
    row.querySelector('[data-tipo="quitar"]').onclick = () => { window._factory.splice(i, 1); pintarFactory(); };
  });
}
$('#add-factory').onclick = () => {
  window._factory.push({ titulo: '', items: [] });
  pintarFactory();
};

/* ── Timeline cards (sampling roadmap) ── */
function pintarTimeline() {
  const cont = $('#timeline-lista');
  cont.innerHTML = window._timeline.map((t, i) => `
    <div class="pom-row" style="align-items:flex-start" data-i="${i}">
      <input placeholder="Título" value="${t.titulo || ''}" data-tipo="titulo">
      <input placeholder="Estado" value="${t.estado || ''}" data-tipo="estado">
      <textarea placeholder="Items (uno por línea)" rows="3" style="flex:1" data-tipo="items">${(t.items || []).join('\n')}</textarea>
      <button type="button" class="btn btn-ghost" data-tipo="quitar">✕</button>
    </div>`).join('');

  cont.querySelectorAll('.pom-row').forEach((row) => {
    const i = Number(row.dataset.i);
    row.querySelector('[data-tipo="titulo"]').oninput = (e) => { window._timeline[i].titulo = e.target.value; };
    row.querySelector('[data-tipo="estado"]').oninput = (e) => { window._timeline[i].estado = e.target.value; };
    row.querySelector('[data-tipo="items"]').oninput = (e) => {
      window._timeline[i].items = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
    };
    row.querySelector('[data-tipo="quitar"]').onclick = () => { window._timeline.splice(i, 1); pintarTimeline(); };
  });
}
$('#add-timeline').onclick = () => {
  window._timeline.push({ titulo: '', estado: '', items: [] });
  pintarTimeline();
};

/* ── Leer / pintar formulario ── */
function leerForm() {
  const poms = [...document.querySelectorAll('#poms .pom-row')]
    .map((r) => [...r.querySelectorAll('input')].map((i) => i.value))
    .filter((p) => p[0] || p[1]);
  const materiales = $('#f-materiales').value.split('\n').map((s) => s.trim()).filter(Boolean);
  const fibra = [...document.querySelectorAll('#fibras .pom-row')]
    .map((r) => [...r.querySelectorAll('input')].map((i) => i.value))
    .filter((f) => f[0] || f[1]);
  const validaciones = $('#f-validaciones').value.split('\n').map((s) => s.trim()).filter(Boolean);
  const ingNo = $('#f-ing-no').value.split('\n').map((s) => s.trim()).filter(Boolean);
  const ingSi = $('#f-ing-si').value.split('\n').map((s) => s.trim()).filter(Boolean);
  const objLista = $('#f-obj-lista').value.split('\n').map((s) => s.trim()).filter(Boolean);
  return {
    producto: $('#f-producto').value.trim(),
    codigo: $('#f-codigo').value.trim(),
    contenido: {
      hero: $('#f-hero').value,
      brief: $('#f-brief').value,
      materiales,
      poms,
      detalles: window._detalles,
      fotoReferencia: window._fotos.fotoReferencia,
      flatLimpio: window._fotos.flatLimpio,
      flatPom: window._fotos.flatPom,
      validaciones,
      perfTarget: $('#f-perf-target').value,
      fibra,
      fibraNota: $('#f-fibra-nota').value,
      ingSubtitulo: $('#f-ing-subtitulo').value,
      ingCritico: $('#f-ing-critico').value,
      ingNo,
      ingSi,
      notas: $('#f-notas').value,
      notasCierre: $('#f-notas-cierre').value,
      factory: window._factory,
      factoryTarget: $('#f-factory-target').value,
      objTitulo: $('#f-obj-titulo').value,
      objTexto: $('#f-obj-texto').value,
      objLista,
      objStrong: $('#f-obj-strong').value,
      timeline: window._timeline,
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
  window._fotos = {
    fotoReferencia: c.fotoReferencia || '',
    flatLimpio: c.flatLimpio || '',
    flatPom: c.flatPom || '',
  };
  pintarFotos();

  $('#f-validaciones').value = (c.validaciones || []).join('\n');
  $('#f-perf-target').value = c.perfTarget || '';
  $('#fibras').innerHTML = '';
  (c.fibra || []).forEach((f) => $('#fibras').appendChild(fibraRow(f[0], f[1])));
  $('#f-fibra-nota').value = c.fibraNota || '';
  $('#f-ing-subtitulo').value = c.ingSubtitulo || '';
  $('#f-ing-critico').value = c.ingCritico || '';
  $('#f-ing-no').value = (c.ingNo || []).join('\n');
  $('#f-ing-si').value = (c.ingSi || []).join('\n');
  $('#f-notas').value = c.notas || '';
  $('#f-notas-cierre').value = c.notasCierre || '';
  window._factory = c.factory || [];
  pintarFactory();
  $('#f-factory-target').value = c.factoryTarget || '';
  $('#f-obj-titulo').value = c.objTitulo || '';
  $('#f-obj-texto').value = c.objTexto || '';
  $('#f-obj-lista').value = (c.objLista || []).join('\n');
  $('#f-obj-strong').value = c.objStrong || '';
  window._timeline = c.timeline || [];
  pintarTimeline();
}

/* ── Fotos (Supabase Storage) ── */
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

function pintarFotos() {
  const zona = $('#zona-fotos');
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
      if (url) { window._fotos[inp.dataset.clave] = url; pintarFotos(); }
    };
  });

  pintarDetalles();
  $('#add-detalle').onclick = () => {
    window._detalles.push({ imagen: '', titulo: '', descripcion: '' });
    pintarDetalles();
  };
}

function pintarDetalles() {
  const cont = $('#detalles-lista');
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

/* ── Guardar ── */
$('#guardar').onclick = async () => {
  const payload = { ...leerForm(), actualizado: new Date().toISOString() };
  const { error } = await supabase.from('pedidos').update(payload).eq('id', id);
  if (error) { alert('No se pudo guardar.'); return; }
  const ok = $('#estado-guardado'); ok.hidden = false; setTimeout(() => { ok.hidden = true; }, 1500);
};

/* ── Carga inicial ── */
async function cargar() {
  if (!(await requerirSesion())) return;
  if (!id) {
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

cargar();
