// Team Uniforms — interacciones. Se completa en tareas siguientes.
'use strict';
document.addEventListener('DOMContentLoaded', () => {
  console.log('Team Uniforms cargado');

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

  // tipografía cinética del hero: entra en secuencia al cargar
  const heroEls = document.querySelectorAll('.reveal-hero');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 120 + i * 130);
  });
});
