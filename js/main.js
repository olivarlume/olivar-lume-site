(function () {
  "use strict";

  var cfg = window.OLIVAR_CONFIG || {};

  // Ligações de WhatsApp: usa o número de config.js; sem número, mantém o botão visível e marcado.
  var digits = String(cfg.whatsappNumber || "").replace(/\D/g, "");
  var hasNumber = digits.length >= 8;
  var text = encodeURIComponent(cfg.whatsappMessage || "");

  document.querySelectorAll("[data-wa]").forEach(function (link) {
    if (hasNumber) {
      link.href = "https://wa.me/" + digits + "?text=" + text;
      link.target = "_blank";
      link.rel = "noopener";
    } else {
      link.href = "#contacto";
      link.classList.add("is-placeholder");
      link.title = "Número de WhatsApp por preencher em config.js";
    }
  });

  // Telefone fixo do escritório: ligação tel: a partir de config.js.
  document.querySelectorAll("[data-tel]").forEach(function (a) {
    if (cfg.escritorioTel) a.href = "tel:" + cfg.escritorioTel;
  });

  // Preenche textos vindos de config.js (número, NIF, morada).
  document.querySelectorAll("[data-config]").forEach(function (el) {
    var value = cfg[el.getAttribute("data-config")];
    if (!value) return;
    el.textContent = value;
    if (value.charAt(0) === "[") el.classList.add("ph");
  });

  // Ano automático no rodapé.
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Menu mobile.
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  // Animação de entrada, desligada se o utilizador pedir movimento reduzido.
  var items = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { observer.observe(el); });
  }
})();

// Botões de marcação: só aparecem quando config.js tem agendaUrl preenchido.
(function () {
  var url = window.OLIVAR_CONFIG && window.OLIVAR_CONFIG.agendaUrl;
  if (!url || !/^https:\/\//.test(url)) return;
  document.querySelectorAll("[data-agenda]").forEach(function (el) {
    el.href = url;
    el.hidden = false;
  });
  document.querySelectorAll("[data-agenda-note]").forEach(function (el) {
    el.hidden = false;
  });
})();
