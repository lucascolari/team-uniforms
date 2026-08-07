import { supabase } from '../supabase.js';

const $ = (s) => document.querySelector(s);
const loginSec = $('#login');
const panelSec = $('#panel');

let pedidosCache = [];
let mesSel = 'todos';
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const claveMes = (iso) => { const d = new Date(iso); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };
const textoMes = (iso) => { const d = new Date(iso); return `${MESES[d.getMonth()]} ${d.getFullYear()}`; };

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
  const btn = e.target.querySelector('button[type="submit"]');
  err.hidden = true;
  btn.disabled = true;
  btn.textContent = 'Entrando…';
  const { error } = await supabase.auth.signInWithPassword({
    email: $('#email').value.trim(),
    password: $('#password').value,
  });
  btn.disabled = false;
  btn.textContent = 'Entrar';
  if (error) { err.textContent = error.message || 'No se pudo entrar.'; err.hidden = false; console.error('Login error:', error); return; }
  await iniciar();
});

$('#logout').addEventListener('click', async () => {
  await supabase.auth.signOut();
  location.reload();
});

async function cargarLista() {
  const lista = $('#lista');
  const { data, error } = await supabase
    .from('pedidos')
    .select('id, producto, codigo, estado, creado')
    .order('creado', { ascending: false });
  if (error) { lista.innerHTML = '<p class="error">No se pudieron cargar los pedidos.</p>'; return; }
  pedidosCache = data || [];
  pintarLista();
}

function pintarLista() {
  const lista = $('#lista');
  if (!pedidosCache.length) {
    lista.innerHTML = '<p style="color:#8b8b90">Todavía no hay pedidos. Creá el primero con “+ Nuevo pedido”.</p>';
    return;
  }

  const meses = new Map();
  pedidosCache.forEach((p) => meses.set(claveMes(p.creado), textoMes(p.creado)));
  const opciones = ['<option value="todos">Todos los meses</option>']
    .concat([...meses].map(([c, t]) => `<option value="${c}"${c === mesSel ? ' selected' : ''}>${t}</option>`)).join('');

  const filtrados = mesSel === 'todos' ? pedidosCache : pedidosCache.filter((p) => claveMes(p.creado) === mesSel);

  const filas = filtrados.map((p) => {
    const fecha = new Date(p.creado).toLocaleDateString('es-AR');
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

  lista.innerHTML = `<div class="barra-filtro">
      <select id="filtro-mes">${opciones}</select>
      <span class="conteo">${filtrados.length} pedido${filtrados.length === 1 ? '' : 's'}</span>
    </div>${filas}`;

  $('#filtro-mes').onchange = (e) => { mesSel = e.target.value; pintarLista(); };
}

$('#lista').addEventListener('click', async (e) => {
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

async function iniciar() {
  const hay = await requerirSesion();
  if (hay) await cargarLista();
}

iniciar();
