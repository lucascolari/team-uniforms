// Team Uniforms — interacciones. Se completa en tareas siguientes.
'use strict';
document.addEventListener('DOMContentLoaded', () => {
  console.log('Team Uniforms cargado');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      destino.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block:'start'});
      navMob.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
    });
  });

  // tipografía cinética del hero: entra en secuencia al cargar
  const heroEls = document.querySelectorAll('.reveal-hero');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 120 + i * 130);
  });

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
});
