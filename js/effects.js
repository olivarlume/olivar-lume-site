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
    if (!box || reduce || !box.animate) return;
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
      if (t0 === null) t0 = now;
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

    function start() { requestAnimationFrame(frame); }
    if (img.complete) start(); else img.addEventListener("load", start, { once: true });
  }

  stars();
  mouseLight();
  logoIntro();
})();
