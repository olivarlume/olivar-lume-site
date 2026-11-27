// Simulador de custo com os preços de lançamento aprovados. Só calcula; não guarda nem envia nada.
(function () {
  var precos = {
    whatsapp: { nome: "Só WhatsApp", inst: 59.90, mens: 19.90 },
    sites: { nome: "Site + WhatsApp", inst: 149.90, mens: 29.90 },
    assistentes: { nome: "Assistentes de IA", inst: null, mens: null }
  };

  function eur(v) {
    return v.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  }

  // Devolve o total aproximado para o serviço e o número de meses. Assistentes não tem preço fixo.
  function calcula(id, meses) {
    var p = precos[id];
    if (!p || p.inst === null) return null;
    return { inst: p.inst, mens: p.mens, total: p.inst + p.mens * meses };
  }

  window.OlivarSimulador = { calcula: calcula };

  var botoes = document.querySelectorAll(".sim-opt");
  var range = document.getElementById("sim-range");
  var out = document.getElementById("sim-meses");
  if (!botoes.length || !range) return;

  var atual = "whatsapp";

  function atualiza() {
    var meses = parseInt(range.value, 10);
    out.textContent = meses;
    var r = calcula(atual, meses);
    var inst = document.getElementById("sim-inst");
    var mens = document.getElementById("sim-mens");
    var total = document.getElementById("sim-total");
    if (!r) {
      inst.textContent = "Solução personalizada";
      mens.textContent = "A definir";
      total.textContent = "Orçamento após uma conversa sobre o seu negócio.";
      return;
    }
    inst.textContent = eur(r.inst) + " + IVA";
    mens.textContent = eur(r.mens) + " + IVA por mês";
    total.innerHTML = "Total aproximado em " + meses + " meses: <strong>" + eur(r.total) + " + IVA</strong>";
  }

  botoes.forEach(function (b) {
    b.addEventListener("click", function () {
      atual = b.getAttribute("data-id");
      botoes.forEach(function (x) {
        x.setAttribute("aria-checked", x === b ? "true" : "false");
      });
      atualiza();
    });
  });
  range.addEventListener("input", atualiza);
  atualiza();
})();
