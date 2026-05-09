'use strict';

/* ── CANVAS ANIMATED BACKGROUND ── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], time = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function initParticles() {
    particles = [];
    const n = Math.floor((W * H) / 13000);
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.4,
        vy: Math.random() * 0.18 + 0.04,
        alpha: Math.random() * 0.55 + 0.2,
        cyan: Math.random() > 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw() {
    time++;

    // Animated dark gradient bg
    const cx = W * (0.5 + 0.1 * Math.sin(time * 0.0004));
    const cy = H * (0.45 + 0.07 * Math.cos(time * 0.0003));
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.8);
    g.addColorStop(0,   'rgba(10,5,30,1)');
    g.addColorStop(0.4, 'rgba(4,6,20,1)');
    g.addColorStop(1,   'rgba(2,4,8,1)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // Purple nebula
    const pg = ctx.createRadialGradient(
      W * (0.72 + 0.08 * Math.sin(time * 0.00035)), H * (0.35 + 0.1 * Math.cos(time * 0.0005)), 0,
      W * (0.72 + 0.08 * Math.sin(time * 0.00035)), H * (0.35 + 0.1 * Math.cos(time * 0.0005)), W * 0.4
    );
    pg.addColorStop(0, `rgba(80,20,160,${0.14 + 0.06 * Math.sin(time * 0.0006)})`);
    pg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = pg; ctx.fillRect(0, 0, W, H);

    // Cyan nebula
    const cg = ctx.createRadialGradient(
      W * (0.22 + 0.07 * Math.cos(time * 0.00045)), H * (0.55 + 0.08 * Math.sin(time * 0.00038)), 0,
      W * (0.22 + 0.07 * Math.cos(time * 0.00045)), H * (0.55 + 0.08 * Math.sin(time * 0.00038)), W * 0.3
    );
    cg.addColorStop(0, `rgba(0,140,200,${0.1 + 0.04 * Math.sin(time * 0.0007)})`);
    cg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H);

    // Particles
    particles.forEach(p => {
      p.y -= p.vy;
      if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
      const a = p.alpha * (0.6 + 0.4 * Math.sin(time * 0.002 + p.phase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.cyan ? `rgba(0,212,255,${a})` : `rgba(155,68,255,${a})`;
      ctx.fill();
    });

    // Scan lines
    for (let y = 0; y < H; y += 4) {
      ctx.fillStyle = 'rgba(0,0,0,0.016)';
      ctx.fillRect(0, y, W, 1);
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });
  resize(); initParticles(); draw();
})();

/* ── CUSTOM CURSOR ── */
(function () {
  const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.appendChild(dot); document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function loop() {
    rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
  });
})();

/* ── SCROLL REVEAL ── */
(function () {
  const els = document.querySelectorAll('[data-reveal]');
  const delays = [0, 0.1, 0.2, 0.32];
  els.forEach((el, i) => { el.style.transitionDelay = delays[i % delays.length] + 's'; });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));

  // Hero items trigger on load
  document.querySelectorAll('.hero [data-reveal]').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 350 + i * 150);
  });
})();

/* ── NAV SCROLL ── */
window.addEventListener('scroll', () => {
  document.querySelector('.nav').classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── CYCLING GLITCH WORD ── */
(function () {
  const el = document.getElementById('cycling-word');
  if (!el) return;
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const words = ['GROWS', 'SCALES', 'THRIVES', 'EVOLVES', 'ADAPTS'];
  let idx = 0;

  function scramble(word) {
    let f = 0; const frames = 14;
    const iv = setInterval(() => {
      const p = f / frames;
      const rev = Math.floor(p * word.length);
      el.textContent = word.split('').map((c, i) =>
        i < rev ? c : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join('');
      if (++f > frames) { el.textContent = word; clearInterval(iv); }
    }, 40);
  }

  setInterval(() => { idx = (idx + 1) % words.length; scramble(words[idx]); }, 3800);
})();

/* ── COUNT-UP STATS ── */
(function () {
  const els = document.querySelectorAll('.stat-num[data-count]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const target = +e.target.dataset.count;
      const start = performance.now();
      const dur = 1600;
      (function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        e.target.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target);
        if (t < 1) requestAnimationFrame(tick);
        else e.target.textContent = target;
      })(start);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
})();

/* ── RIPPLE ── */
(function () {
  const style = document.createElement('style');
  style.textContent = '@keyframes _rpl{to{transform:scale(1);opacity:0}}';
  document.head.appendChild(style);

  document.querySelectorAll('.btn-primary, .btn-secondary, .nav__cta').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect();
      const s = Math.max(r.width, r.height) * 2;
      const sp = document.createElement('span');
      Object.assign(sp.style, {
        position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
        width: s + 'px', height: s + 'px',
        left: (e.clientX - r.left - s / 2) + 'px',
        top:  (e.clientY - r.top  - s / 2) + 'px',
        background: 'rgba(255,255,255,.14)', transform: 'scale(0)',
        animation: '_rpl .55s ease-out forwards',
      });
      btn.style.position = 'relative'; btn.style.overflow = 'hidden';
      btn.appendChild(sp);
      setTimeout(() => sp.remove(), 580);
    });
  });
})();