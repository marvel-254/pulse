/**
 * Pulse Depth — the 3D layer.
 *
 * Two things, both dependency-free and both optional:
 *
 *  1. A perspective starfield canvas that sits behind the UI. Particles live in
 *     a real 3D volume (x, y, z), are projected with a simple camera, react to
 *     the pointer (parallax) and drift as you scroll.
 *  2. Card tilt + parallax helpers used by the UI (`data-tilt`, `data-depth`).
 *
 * Everything respects `prefers-reduced-motion`, pauses in hidden tabs, scales
 * down on small/low-power devices, and can be switched off by the visitor
 * (persisted in localStorage as `pulse-3d`).
 */
(() => {
  "use strict";

  const STORE_KEY = "pulse-3d";

  // matchMedia is missing in some older browsers and headless DOMs.
  const mq = (query) => {
    try {
      return window.matchMedia ? window.matchMedia(query) : { matches: false, addEventListener() {} };
    } catch {
      return { matches: false, addEventListener() {} };
    }
  };
  const reducedMotion = mq("(prefers-reduced-motion: reduce)");
  const finePointer = mq("(hover: hover) and (pointer: fine)");

  const readPref = () => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved === "off") return false;
      if (saved === "on") return true;
    } catch {}
    // Default: on, unless the visitor asked for reduced motion.
    return !reducedMotion.matches;
  };

  let enabled = readPref();
  let canvas = null;
  let ctx = null;
  let particles = [];
  let bursts = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let rafId = null;
  let running = false;
  let lastFrame = 0;

  // Camera / scene state
  const FOV = 420;
  const field = { rotY: 0, rotX: 0, targetRotY: 0, targetRotX: 0, drift: 0, scroll: 0 };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  const isSmallScreen = () => window.innerWidth < 720;
  const lowPower = () =>
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4);

  function particleCount() {
    const area = window.innerWidth * window.innerHeight;
    const base = Math.min(150, Math.max(45, Math.round(area / 20000)));
    const scaled = isSmallScreen() ? Math.round(base * 0.6) : base;
    return lowPower() ? Math.round(scaled * 0.65) : scaled;
  }

  function spawn() {
    particles = Array.from({ length: particleCount() }, () => ({
      x: (Math.random() - 0.5) * 1900,
      y: (Math.random() - 0.5) * 1400,
      z: Math.random() * 1500 + 90,
      // gentle per-particle drift so the field feels alive
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      hue: Math.random() < 0.22 ? "violet" : Math.random() < 0.4 ? "green" : "cyan",
      size: 0.7 + Math.random() * 1.5,
    }));
  }

  function resize() {
    if (!canvas) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawn();
    if (!running) drawStatic();
  }

  const COLOR = {
    cyan: "34, 211, 238",
    violet: "139, 92, 246",
    green: "16, 185, 129",
  };

  function project(p) {
    // rotate the volume a little around Y and X, then project perspective
    const cosY = Math.cos(field.rotY);
    const sinY = Math.sin(field.rotY);
    const cosX = Math.cos(field.rotX);
    const sinX = Math.sin(field.rotX);

    const x1 = p.x * cosY - p.z * sinY;
    const z1 = p.x * sinY + p.z * cosY;
    const y1 = p.y * cosX - z1 * sinX;
    const z2 = p.y * sinX + z1 * cosX;

    const z = z2 + field.drift;
    if (z < 30) return null; // behind the camera
    const scale = FOV / z;
    return {
      sx: width / 2 + x1 * scale + pointer.x * (1.6 - Math.min(1, z / 1600)) * 60,
      sy: height / 2 + y1 * scale + pointer.y * (1.6 - Math.min(1, z / 1600)) * 60 - field.scroll * 0.12,
      scale,
      alpha: Math.min(0.75, Math.max(0.05, 1 - z / 1700)) * 0.9,
      z,
    };
  }

  function drawStatic() {
    if (!ctx || !enabled) return;
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      const s = project(p);
      if (!s) continue;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${COLOR[p.hue]}, ${s.alpha})`;
      ctx.arc(s.sx, s.sy, Math.max(0.4, p.size * s.scale * 1.6), 0, Math.PI * 2);
      ctx.fill();
    }
    drawBursts();
  }

  function drawBursts() {
    if (!ctx) return;
    bursts = bursts.filter((b) => b.life > 0);
    for (const b of bursts) {
      b.life -= 0.02;
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.05;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${COLOR[b.hue]}, ${Math.max(0, b.life) * 0.9})`;
      ctx.arc(b.x, b.y, Math.max(0.5, b.life * 3.4), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame(now) {
    if (!enabled) return;
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(48, now - lastFrame || 16);
    lastFrame = now;

    const ease = 0.055;
    field.rotY += (field.targetRotY - field.rotY) * ease;
    field.rotX += (field.targetRotX - field.rotX) * ease;
    pointer.x += (pointer.tx - pointer.x) * ease;
    pointer.y += (pointer.ty - pointer.y) * ease;
    field.rotY += 0.00035 * dt; // slow ambient spin
    field.drift -= 0.02 * dt;

    for (const p of particles) {
      p.x += p.vx * dt * 0.06;
      p.y += p.vy * dt * 0.06;
      if (Math.abs(p.x) > 1100) p.vx *= -1;
      if (Math.abs(p.y) > 900) p.vy *= -1;
    }

    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      const s = project(p);
      if (!s) continue;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${COLOR[p.hue]}, ${s.alpha})`;
      ctx.arc(s.sx, s.sy, Math.max(0.4, p.size * s.scale * 1.6), 0, Math.PI * 2);
      ctx.fill();
    }
    drawBursts();
  }

  function start() {
    if (running || !enabled || reducedMotion.matches) return;
    running = true;
    lastFrame = 0;
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  /* ---- pointer / scroll input ---- */
  function onPointerMove(e) {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    pointer.tx = nx;
    pointer.ty = ny;
    field.targetRotY = nx * 0.16;
    field.targetRotX = ny * 0.1;
    applyParallax(nx, ny);
  }

  function onScroll() {
    field.scroll = window.scrollY || 0;
  }

  /* ---- CSS parallax for [data-depth] layers ---- */
  const depthLayers = () =>
    Array.from(document.querySelectorAll("[data-depth]")).slice(0, 24);

  function applyParallax(nx, ny) {
    if (!enabled) return;
    for (const el of depthLayers()) {
      const depth = Number(el.dataset.depth) || 6;
      el.style.transform = `translate3d(${(-nx * depth).toFixed(2)}px, ${(-ny * depth).toFixed(2)}px, 0)`;
    }
  }

  /* ---- 3D tilt for [data-tilt] cards (pointer devices only) ---- */
  const TILT_MAX = 6;

  function bindTilt(root = document) {
    if (!enabled || !finePointer.matches) return;
    const cards = root.querySelectorAll("[data-tilt]:not([data-tilt-bound])");
    cards.forEach((card) => {
      card.dataset.tiltBound = "1";
      let raf = null;
      const reset = () => {
        card.style.transform = "";
        card.classList.remove("tilting");
      };
      card.addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          const rx = (0.5 - py) * TILT_MAX * 2;
          const ry = (px - 0.5) * TILT_MAX * 2;
          card.classList.add("tilting");
          card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(6px)`;
          card.style.setProperty("--tilt-x", `${(px * 100).toFixed(1)}%`);
          card.style.setProperty("--tilt-y", `${(py * 100).toFixed(1)}%`);
        });
      });
      card.addEventListener("pointerleave", reset);
      card.addEventListener("pointercancel", reset);
      card.addEventListener("blur", reset);
    });
  }

  /* ---- celebration burst (level ups / badges) ---- */
  function burst(x, y, hue = "cyan", count = 26) {
    if (!enabled) return;
    const cx = x ?? window.innerWidth / 2;
    const cy = y ?? 120;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const speed = 1.2 + Math.random() * 2.6;
      bursts.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.1,
        life: 1,
        hue: Math.random() < 0.5 ? hue : "violet",
      });
    }
    if (!running) start();
  }

  /* ---- public API ---- */
  function setEnabled(next, opts = {}) {
    enabled = !!next;
    try {
      localStorage.setItem(STORE_KEY, enabled ? "on" : "off");
    } catch {}
    document.documentElement.classList.toggle("depth-off", !enabled);
    if (canvas) canvas.hidden = !enabled;
    if (!enabled) {
      stop();
      clearTransforms();
    } else {
      resize();
      start();
    }
    document.dispatchEvent(new CustomEvent("pulse:depth", { detail: { enabled } }));
    if (!opts.silent) return enabled;
  }

  function clearTransforms() {
    document.querySelectorAll("[data-depth]").forEach((el) => (el.style.transform = ""));
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      el.style.transform = "";
      el.classList.remove("tilting");
    });
  }

  function init() {
    canvas = document.getElementById("depthScene");
    if (!canvas) return;
    ctx = canvas.getContext("2d", { alpha: true });

    document.documentElement.classList.toggle("depth-off", !enabled);
    canvas.hidden = !enabled;

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    reducedMotion.addEventListener?.("change", () => {
      if (reducedMotion.matches) stop();
      else if (enabled) start();
    });

    if (enabled) start();
    else drawStatic();
  }

  window.PulseDepth = {
    init,
    setEnabled,
    isEnabled: () => enabled,
    bindTilt,
    burst,
    /** Re-render one frame (used after the UI rebuilds its DOM). */
    refresh: () => {
      if (enabled && !running) drawStatic();
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
