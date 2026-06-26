// Team Uniforms — interacciones (vanilla, sin dependencias).
'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const hdr = document.getElementById('hdr');
  const burger = document.getElementById('burger');
  const navMob = document.getElementById('navMob');

  // ── fondo del header al scrollear ──
  const onScroll = () => hdr.classList.toggle('sc', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  // ── menú mobile ──
  burger.addEventListener('click', () => {
    const abierto = navMob.classList.toggle('open');
    burger.classList.toggle('open', abierto);
    burger.setAttribute('aria-expanded', String(abierto));
  });

  // ── scroll suave a secciones ──
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

  // ── hero: tipografía cinética (se dispara al terminar el loader) ──
  let heroListo = false;
  const revealHero = () => {
    if (heroListo) return;
    heroListo = true;
    document.querySelectorAll('.reveal-hero').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), reduceMotion ? 0 : i * 130);
    });
  };

  // ── loader / intro de marca (se oculta solo por CSS; el JS solo coordina el hero) ──
  const loader = document.getElementById('loader');
  if (reduceMotion) {
    if (loader) loader.remove();
    revealHero();
  } else {
    // el hero entra justo cuando el telón empieza a subir
    setTimeout(revealHero, 1300);
    setTimeout(revealHero, 2600); // red de seguridad
    if (loader) loader.addEventListener('animationend', () => loader.remove());
  }

  // ── prenda del hero: tilt 2.5D sutil con el mouse ──
  const heroPrenda = document.querySelector('.hero-prenda');
  const heroSec = document.getElementById('hero');
  if (heroPrenda && heroSec && !reduceMotion && finePointer) {
    let raf = null, nx = 0, ny = 0;
    heroSec.addEventListener('mousemove', (e) => {
      const r = heroSec.getBoundingClientRect();
      nx = (e.clientX - r.left) / r.width - 0.5;
      ny = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(() => {
        heroPrenda.style.transform = `rotateY(${(nx * 6).toFixed(2)}deg) rotateX(${(-ny * 6).toFixed(2)}deg)`;
        raf = null;
      });
    });
    heroSec.addEventListener('mouseleave', () => { heroPrenda.style.transform = ''; });
  }

  // ── barra de progreso + paso activo del proceso ──
  const proceso = document.getElementById('proceso');
  const progBarra = document.getElementById('progBarra');
  const pasos = proceso ? proceso.querySelectorAll('.pasos li') : [];
  if (proceso && progBarra) {
    const actualizarProgreso = () => {
      const r = proceso.getBoundingClientRect();
      const total = proceso.offsetHeight - window.innerHeight;
      const avance = Math.min(Math.max(-r.top / total, 0), 1);
      progBarra.style.width = (avance * 100).toFixed(1) + '%';
      if (pasos.length) {
        const activo = Math.min(Math.floor(avance * pasos.length), pasos.length - 1);
        pasos.forEach((li, i) => li.classList.toggle('activo', i <= activo));
      }
    };
    actualizarProgreso();
    window.addEventListener('scroll', actualizarProgreso, {passive:true});
  }

  // ── reveals al entrar en viewport, escalonados por grupo ──
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el) => {
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.dataset.delay = Math.min(sibs.indexOf(el), 6) * 80;
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = e.target.dataset.delay + 'ms';
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {threshold:0.15, rootMargin:'0px 0px -10% 0px'});
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // ── scrollspy: resalta en el nav la sección visible ──
  const navBtns = document.querySelectorAll('.nav-dsk button[data-target]');
  const targetMap = new Map();
  navBtns.forEach((b) => {
    const s = document.querySelector(b.dataset.target);
    if (s) targetMap.set(s, b);
  });
  if (targetMap.size && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          navBtns.forEach((b) => b.classList.remove('activo'));
          const activo = targetMap.get(e.target);
          if (activo) activo.classList.add('activo');
        }
      });
    }, {rootMargin:'-45% 0px -50% 0px', threshold:0});
    targetMap.forEach((b, s) => spy.observe(s));
  }

  // ── contador animado de la banda de confianza ──
  const statsNums = document.querySelectorAll('.stat-n[data-target]');
  const animarNumero = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const b = el.querySelector('b');
    if (!b) return;
    if (reduceMotion) { b.textContent = target; return; }
    const dur = 1500, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      b.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (statsNums.length && 'IntersectionObserver' in window) {
    const statObs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) { animarNumero(e.target); statObs.unobserve(e.target); }
      });
    }, {threshold:0.6});
    statsNums.forEach((el) => statObs.observe(el));
  } else {
    statsNums.forEach((el) => { const b = el.querySelector('b'); if (b) b.textContent = el.dataset.target; });
  }

  // ── botón flotante de WhatsApp: aparece al pasar el hero ──
  const waFloat = document.querySelector('.wa-float');
  if (waFloat) {
    const toggleWa = () => waFloat.classList.toggle('visible', window.scrollY > window.innerHeight * 0.6);
    toggleWa();
    window.addEventListener('scroll', toggleWa, {passive:true});
  }

  // ── videos lazy: cargan y reproducen solo al entrar en viewport ──
  const lazyVideos = document.querySelectorAll('.lazy-video');
  if (lazyVideos.length && 'IntersectionObserver' in window) {
    const vObs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) {
          if (!v.src) v.src = v.dataset.src;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }, {threshold:0.25});
    lazyVideos.forEach((v) => vObs.observe(v));
  }

  // ── botones magnéticos (solo mouse, sin reduced-motion) ──
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.btn-cta, .btn-wa, .btn-enviar').forEach((btn) => {
      btn.style.transition = 'transform .2s var(--ease)';
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // ── parallax sutil en imágenes (efecto pleno con fotos reales) ──
  const paraEls = document.querySelectorAll('[data-parallax]');
  if (paraEls.length && !reduceMotion) {
    let ticking = false;
    const aplicarParallax = () => {
      const vh = window.innerHeight;
      paraEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const desplaz = ((r.top + r.height / 2) - vh / 2) * -0.05;
        el.style.backgroundPositionY = `calc(50% + ${desplaz.toFixed(1)}px)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(aplicarParallax); ticking = true; }
    }, {passive:true});
    aplicarParallax();
  }
});
