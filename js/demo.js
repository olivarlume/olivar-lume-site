// Demonstração fictícia do assistente de WhatsApp. Não envia nada: só mostra exemplos.
(function () {
  var chat = document.getElementById("chat");
  var opts = document.getElementById("chat-opts");
  if (!chat || !opts) return;

  var fluxo = {
    inicio: { texto: "Olá! Sou o assistente do Salão Exemplo. Em que posso ajudar?", opcoes: [["Quais os serviços?", "servicos"], ["Quero marcar", "marcar"], ["Qual o horário?", "horario"]] },
    servicos: { texto: "Corte, coloração e tratamentos. Escolha uma opção para marcar.", opcoes: [["Quero marcar", "marcar"], ["Voltar ao início", "inicio"]] },
    horario: { texto: "De terça a sábado, das 9h às 19h.", opcoes: [["Quero marcar", "marcar"], ["Voltar ao início", "inicio"]] },
    marcar: { texto: "Claro. Para quando gostava?", opcoes: [["Amanhã, 10h", "confirmar"], ["Sexta, 15h", "confirmar"], ["Voltar ao início", "inicio"]] },
    confirmar: { texto: "Fica marcado (exemplo). Até já!", opcoes: [["Começar de novo", "inicio"]] }
  };

  var reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function bolha(texto, quem) {
    var b = document.createElement("div");
    b.className = "bubble " + quem;
    b.textContent = texto;
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
  }

  function mostra(id, depois) {
    var etapa = fluxo[id];
    opts.innerHTML = "";
    setTimeout(function () {
      bolha(etapa.texto, "bot");
      etapa.opcoes.forEach(function (o) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chat-opt";
        btn.textContent = o[0];
        btn.addEventListener("click", function () {
          opts.innerHTML = "";
          bolha(o[0], "me");
          mostra(o[1]);
        });
        opts.appendChild(btn);
      });
      if (depois) depois();
    }, reduzir ? 0 : 500);
  }

  chat.innerHTML = "";
  mostra("inicio");
})();
