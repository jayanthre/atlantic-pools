
/* Creative ambient water bubbles on hero canvas */
(function waterBubblesAmbient() {
  try {
    const canvas = document.getElementById('rippleCanvas');
    if (!canvas) return;
    const hero = canvas.closest('.hero') || canvas.parentElement;
    if (!hero) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w, h, dpr, bubbles = [];
    function resize() {
      dpr = window.devicePixelRatio || 1;
      const r = canvas.getBoundingClientRect();
      w = canvas.width = r.width * dpr;
      h = canvas.height = r.height * dpr;
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
    }
    resize();
    window.addEventListener('resize', resize);
    // spawn extra bubbles on mouse move
    hero.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      for (let i = 0; i < 2; i++) {
        bubbles.push({
          x: mx + (Math.random() - 0.5) * 12,
          y: my + (Math.random() - 0.5) * 12,
          r: 5 + Math.random() * 8,
          vy: -(0.6 + Math.random() * 1.2),
          vx: (Math.random() - 0.5) * 0.8,
          life: 1,
          decay: 0.008 + Math.random() * 0.006,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.03 + Math.random() * 0.05
        });
      }
    });
    // spawn a burst of bubbles on click
    hero.addEventListener('click', (e) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      for (let i = 0; i < 12; i++) {
        bubbles.push({
          x: mx + (Math.random() - 0.5) * 20,
          y: my + (Math.random() - 0.5) * 20,
          r: 4 + Math.random() * 7,
          vy: -(0.8 + Math.random() * 1.5),
          vx: (Math.random() - 0.5) * 1.2,
          life: 1,
          decay: 0.006 + Math.random() * 0.004,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.03 + Math.random() * 0.05
        });
      }
    });
    function spawn() {
      const cw = w / dpr, ch = h / dpr;
      bubbles.push({
        x: Math.random() * cw,
        y: ch + 10,
        r: 6 + Math.random() * 10,
        vy: -(0.5 + Math.random() * 1.0),
        vx: (Math.random() - 0.5) * 0.5,
        life: 1,
        decay: 0.003 + Math.random() * 0.004,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.04
      });
    }
    setInterval(spawn, 450);
    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.scale(dpr, dpr);
      const cw = w / dpr, ch = h / dpr;
      bubbles = bubbles.filter(b => b.life > 0.02 && b.y > -b.r);
      bubbles.forEach(b => {
        b.y += b.vy;
        b.x += b.vx + Math.sin(b.wobble) * 0.3;
        b.wobble += b.wobbleSpeed;
        b.life -= b.decay;
        const a = Math.min(b.life, 1) * 0.9;
        // bubble body: mostly transparent with a thin rim
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(95,179,179,' + (a * 0.08) + ')';
        ctx.fill();
        // rim / edge
        ctx.strokeStyle = 'rgba(200,230,230,' + (a * 0.55) + ')';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // bright specular highlight (top-left)
        const hg = ctx.createRadialGradient(b.x - b.r * 0.35, b.y - b.r * 0.35, 0, b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.5);
        hg.addColorStop(0, 'rgba(255,255,255,' + (a * 0.95) + ')');
        hg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.45, 0, Math.PI * 2);
        ctx.fill();
        // secondary reflection (bottom-right, faint)
        ctx.fillStyle = 'rgba(95,179,179,' + (a * 0.15) + ')';
        ctx.beginPath();
        ctx.arc(b.x + b.r * 0.2, b.y + b.r * 0.25, b.r * 0.18, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
      requestAnimationFrame(draw);
    }
    draw();
  } catch (e) { /* ignore */ }
})();

/* Atlantic Pools — Interactions (part 1) */
(function () {
  'use strict';

  const header = document.getElementById('siteHeader');
  const headerBar = header ? header.querySelector('.header-bar') : null;
  const heroBg = document.querySelector('.hero-bg');
  const heroContent = document.querySelector('.hero-content');

  const onScroll = () => {
    const y = window.scrollY;
    if (y > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    if (headerBar) {
      const blur = Math.min(y / 15, 20);
      const bg = Math.min(y / 300, 0.85);
      headerBar.style.backdropFilter = 'blur(' + blur + 'px) saturate(1.5)';
      headerBar.style.webkitBackdropFilter = 'blur(' + blur + 'px) saturate(1.5)';
      headerBar.style.background = 'rgba(11,13,16,' + bg + ')';
    }

    if (heroBg) {
      const blur = Math.min(y / 30, 12);
      heroBg.style.filter = 'blur(' + blur + 'px)';
      heroBg.style.transform = 'scale(1.1) translateY(' + (y * 0.2) + 'px)';
    }
    if (heroContent) {
      heroContent.style.transform = 'translateY(' + (y * 0.2) + 'px)';
      heroContent.style.opacity = Math.max(1 - y / 700, 0.15);
    }
    document.querySelectorAll('.section-title').forEach((t) => {
      const r = t.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const vh = window.innerHeight;
      const offset = (center - vh / 2) * 0.08;
      t.style.transform = 'translateY(' + offset + 'px)';
    });
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 50) el.classList.add('in');
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      if (id === '#top' || id === '#home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in');
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  };
  const counterEls = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    const parents = new Set();
    counterEls.forEach((el) => { if (el.parentElement) parents.add(el.parentElement); });
    parents.forEach((p) => cio.observe(p));
  } else {
    counterEls.forEach(animateCounter);
  }  // Portfolio filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.masonry-item');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const f = btn.dataset.filter;
      items.forEach((it) => {
        if (f === 'all' || it.dataset.cat === f) it.classList.remove('is-hidden');
        else it.classList.add('is-hidden');
      });
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCaption');
  const lbClose = document.getElementById('lightboxClose');
  function openLb(src, alt, cap) {
    lbImg.src = src; lbImg.alt = alt || '';
    lbCap.textContent = cap || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  items.forEach((it) => {
    it.addEventListener('click', () => {
      const img = it.querySelector('img');
      const overlay = it.querySelector('.masonry-overlay');
      const title = overlay && overlay.querySelector('h4') ? overlay.querySelector('h4').textContent : '';
      const sub = overlay && overlay.querySelector('p') ? overlay.querySelector('p').textContent : '';
      openLb(img.src.replace(/w=\d+/, 'w=1600'), img.alt, [title, sub].filter(Boolean).join(' · '));
    });
  });
  if (lbClose) lbClose.addEventListener('click', closeLb);
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });

  // Contact form
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const mobile = form.mobile.value.trim();
      const service = form.service.value;
      let ok = true;
      if (!name) ok = false;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ok = false;
      if (!mobile || mobile.length < 7) ok = false;
      if (!service) ok = false;
      if (!ok) {
        form.querySelectorAll('input, select').forEach((el) => {
          if (!el.value.trim()) el.style.borderColor = '#e07a7a';
        });
        return;
      }
      form.querySelectorAll('input, select').forEach((el) => { el.style.borderColor = ''; });
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>Sending…</span>';
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = original;
        form.reset();
        if (success) { success.hidden = false; success.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
      }, 900);
    });
    form.querySelectorAll('input, select, textarea').forEach((el) => {
      el.addEventListener('input', () => { el.style.borderColor = ''; });
    });
  }

  // Button ripple
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const r = document.createElement('span');
      r.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = size + 'px';
      r.style.left = (e.clientX - rect.left - size / 2) + 'px';
      r.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(r);
      setTimeout(() => r.remove(), 650);
    });
  });

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Fallback: ensure all reveals become visible (no permanent gaps) after 3s
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => el.classList.add('in'));
  }, 3000);
})();