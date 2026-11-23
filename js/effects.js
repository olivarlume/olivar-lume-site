(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Estrelas: canvas fixo, ~30 fps, parado se a aba estiver escondida ou se houver movimento reduzido. */
  function stars() {
    var canvas = document.getElementById("stars");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var list = [];
    var w = 0, h = 0, raf = 0, last = 0;

    function build() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(130, (w * h) / 9000));
      list = [];
      for (var i = 0; i < n; i++) {
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.3 + Math.random() * 1.1,
          gold: Math.random() < 0.3,
          p: Math.random() * 6.283,
          s: 0.6 + Math.random() * 1.6
        });
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < list.length; i++) {
        var s = list[i];
        ctx.globalAlpha = reduce ? 0.7 : 0.3 + 0.7 * (0.5 + 0.5 * Math.sin((t / 1000) * s.s + s.p));
        ctx.fillStyle = s.gold ? "#E8CB6A" : "#FFFFFF";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.283);
        ctx.fill();
      }
    }

    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return;
      last = now;
      draw(now);
    }

    function run() {
      cancelAnimationFrame(raf);
      if (reduce) { draw(0); return; }
      raf = requestAnimationFrame(loop);
    }

    build();
    run();
    var timer;
    window.addEventListener("resize", function () {
      clearTimeout(timer);
      timer = setTimeout(function () { build(); run(); }, 150);
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) cancelAnimationFrame(raf); else run();
    });
  }

  /* Luz que segue o rato e acende as bordas por onde passa. Só com rato (sem ecrã tátil). */
  function mouseLight() {
    if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var spot = document.createElement("div");
    spot.className = "spotlight";
    spot.setAttribute("aria-hidden", "true");
    document.body.appendChild(spot);

    var els = Array.prototype.slice.call(document.querySelectorAll(".card, .cta-band, .section"));
    var tx = 0, ty = 0, x = 0, y = 0, active = false, raf = 0;
    var ease = reduce ? 1 : 0.16;

    function setVars(cx, cy) {
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (cx === null) {
          el.style.removeProperty("--cx");
          el.style.removeProperty("--cy");
          continue;
        }
        var r = el.getBoundingClientRect();
        if (r.bottom < -300 || r.top > window.innerHeight + 300) continue;
        el.style.setProperty("--cx", cx - r.left + "px");
        el.style.setProperty("--cy", cy - r.top + "px");
      }
    }

    function frame() {
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      spot.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
      setVars(x, y);
      raf = active ? requestAnimationFrame(frame) : 0;
    }

    document.addEventListener("mousemove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!active) {
        active = true;
        x = tx;
        y = ty;
        spot.classList.add("is-on");
        if (!raf) raf = requestAnimationFrame(frame);
      }
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", function () {
      active = false;
      spot.classList.remove("is-on");
      setVars(null);
    });
  }

  /* Animação de abertura: ponto de luz sobe o arco da lua até à estrela e ilumina a árvore (~3,5 s). */
  function logoIntro() {
    var box = document.getElementById("logo-anim");
    if (!box || !box.animate) return;
    var arc = box.querySelector("#ll-arc");
    var trail = box.querySelector("#ll-trail");
    var dot = box.querySelector("#ll-dot");
    var halo = box.querySelector("#ll-halo");
    var star = box.querySelector("#ll-star");
    var glow = box.querySelector(".logo-glow");
    var img = box.querySelector("img");
    var len = arc.getTotalLength();
    var DELAY = 200, TRAVEL = 1700, t0 = null;
    var base = "drop-shadow(0 0 28px rgba(212, 175, 55, 0.18))";

    trail.style.strokeDasharray = "0 " + len;

    function frame(now) {
      if (t0 === null) {
        t0 = now;
        try { performance.mark("logo-intro-start"); } catch (e) { /* sem User Timing */ }
      }
      var t = now - t0 - DELAY;
      if (t < 0) { requestAnimationFrame(frame); return; }
      var p = Math.min(t / TRAVEL, 1);
      var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      var pt = arc.getPointAtLength(len * e);
      dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y);
      halo.setAttribute("cx", pt.x); halo.setAttribute("cy", pt.y);
      dot.style.opacity = "1"; halo.style.opacity = "0.9";
      trail.style.opacity = "0.6";
      trail.style.strokeDasharray = len * e + " " + len;
      if (p < 1) requestAnimationFrame(frame); else finish();
    }

    function finish() {
      var hold = { duration: 300, fill: "forwards" };
      dot.animate([{ opacity: 1 }, { opacity: 0 }], hold);
      halo.animate([{ opacity: 0.9 }, { opacity: 0 }], hold);
      trail.animate([{ opacity: 0.6 }, { opacity: 0 }], { duration: 800, fill: "forwards" });
      pulse();
    }

    // Brilho da estrela e pulso dourado sobre a árvore (também usado com movimento reduzido, sem o percurso).
    function pulse() {
      star.animate([
        { opacity: 0, transform: "scale(1)" },
        { opacity: 1, transform: "scale(7)", offset: 0.3 },
        { opacity: 0, transform: "scale(12)" }
      ], { duration: 800 });
      glow.animate([{ opacity: 0 }, { opacity: 1, offset: 0.4 }, { opacity: 0 }], { duration: 1300, delay: 150 });
      img.animate([
        { filter: base },
        { filter: "drop-shadow(0 0 22px rgba(232, 203, 106, 0.95)) brightness(1.12)", offset: 0.4 },
        { filter: base }
      ], { duration: 1300, delay: 150 });
    }

    function start() {
      if (reduce) { pulse(); return; }
      requestAnimationFrame(frame);
    }

    // Só arranca com a página carregada, fontes e imagem WebP descodificadas, separador visível
    // e depois do primeiro desenho, para a animação não decorrer antes de o logótipo se ver.
    var loaded = document.readyState === "complete"
      ? Promise.resolve()
      : new Promise(function (res) { window.addEventListener("load", res, { once: true }); });
    var decoded = img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    var guard = new Promise(function (res) { setTimeout(res, 5000); });
    Promise.race([Promise.all([loaded, decoded, fonts]), guard]).then(function () {
      if (!document.hidden) return;
      return new Promise(function (res) {
        document.addEventListener("visibilitychange", function onVis() {
          if (!document.hidden) { document.removeEventListener("visibilitychange", onVis); res(); }
        });
      });
    }).then(function () {
      requestAnimationFrame(function () { requestAnimationFrame(start); });
    });
  }

  /* Cursor de luz: ponto dourado com brilho e cauda de faíscas (canvas). Só com rato; em ecrãs tácteis não existe. */
  function cursorLight() {
    if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var canvas = document.createElement("canvas");
    canvas.id = "cursor-fx";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    document.documentElement.classList.add("has-light-cursor");

    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = 0, h = 0;
    function size() {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener("resize", size);

    var px = 0, py = 0, x = 0, y = 0, lx = 0, ly = 0;
    var shown = false, grow = 0, growTarget = 0, parts = [], raf = 0, prev = 0;
    var follow = reduce ? 1 : 0.35;
    var interactive = "a, button, summary, label, input, select, textarea, [role='button'], .btn";

    function spawn(x0, y0, x1, y1) {
      var dist = Math.hypot(x1 - x0, y1 - y0);
      var n = Math.min(6, Math.floor(dist / 5));
      for (var i = 0; i < n; i++) {
        var k = (i + 1) / n;
        var spark = Math.random() < 0.3;
        var a = Math.random() * 6.283;
        var v = spark ? 25 + Math.random() * 45 : 6 + Math.random() * 14;
        parts.push({
          x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k,
          vx: Math.cos(a) * v, vy: Math.sin(a) * v,
          life: 0.6 + Math.random() * 0.3, age: 0,
          r: spark ? 0.7 + Math.random() * 0.8 : 1 + Math.random() * 1.8,
          silver: Math.random() < 0.35, spark: spark
        });
      }
      if (parts.length > 140) parts.splice(0, parts.length - 140);
    }

    function frame(now) {
      var dt = Math.min((now - (prev || now)) / 1000, 0.05);
      prev = now;
      x += (px - x) * follow; y += (py - y) * follow;
      grow += (growTarget - grow) * 0.2;
      if (!reduce) spawn(lx, ly, x, y);
      lx = x; ly = y;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.age += dt;
        if (p.age >= p.life) { parts.splice(i, 1); continue; }
        var f = 1 - p.age / p.life;
        p.x += p.vx * dt; p.y += p.vy * dt;
        ctx.globalAlpha = f * f * 0.9;
        ctx.fillStyle = p.silver ? "#DDE1EA" : "#E8CB6A";
        if (p.spark) {
          ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = p.r;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.04, p.y - p.vy * 0.04); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.4 + 0.6 * f), 0, 6.283); ctx.fill();
        }
      }
      if (shown) {
        var r = 4 + 3.5 * grow;
        var g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
        g.addColorStop(0, "rgba(255, 240, 190, 0.85)");
        g.addColorStop(0.3, "rgba(212, 175, 55, 0.35)");
        g.addColorStop(1, "rgba(212, 175, 55, 0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r * 5, 0, 6.283); ctx.fill();
        ctx.fillStyle = "#FFF6D6";
        ctx.beginPath(); ctx.arc(x, y, r * 0.6, 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      var settled = Math.abs(px - x) < 0.1 && Math.abs(py - y) < 0.1 && Math.abs(growTarget - grow) < 0.01;
      if ((shown && !(settled && !parts.length)) || (!shown && parts.length)) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0; prev = 0;
        if (!shown) ctx.clearRect(0, 0, w, h);
      }
    }

    function wake() { if (!raf) raf = requestAnimationFrame(frame); }

    document.addEventListener("mousemove", function (e) {
      px = e.clientX; py = e.clientY;
      if (!shown) { shown = true; x = lx = px; y = ly = py; }
      growTarget = e.target && e.target.closest && e.target.closest(interactive) ? 1 : 0;
      wake();
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () { shown = false; growTarget = 0; wake(); });
    document.documentElement.addEventListener("mouseenter", function (e) { px = e.clientX; py = e.clientY; });
  }

  stars();
  mouseLight();
  cursorLight();
  logoIntro();
})();
