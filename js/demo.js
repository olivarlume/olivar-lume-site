// Demonstração fictícia do assistente de WhatsApp. Não envia nada: só mostra exemplos.
(function () {
  var chat = document.getElementById("chat");
  var opts = document.getElementById("chat-opts");
  if (!chat || !opts) return;

  var reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var escolha = { dia: "", hora: "" };
  var VOLTAR = ["Voltar ao início", "inicio"];

  var horas = {
    "Amanhã": ["10h", "11h30", "15h"],
    "Sexta": ["9h30", "14h", "17h"]
  };

  var fluxo = {
    inicio: {
      texto: "Olá! Sou o assistente do Salão Exemplo. Em que posso ajudar?",
      opcoes: [["Quais os serviços?", "servicos"], ["Quero marcar", "dia"], ["Qual o horário?", "horario"]]
    },
    servicos: {
      texto: "Corte, coloração e tratamentos (exemplo). Quer marcar um?",
      opcoes: [["Quero marcar", "dia"], VOLTAR]
    },
    horario: {
      texto: "De terça a sábado, das 9h às 19h (exemplo).",
      opcoes: [["Quero marcar", "dia"], VOLTAR]
    },
    dia: {
      texto: "Claro. Para que dia?",
      opcoes: [["Amanhã", "hora:Amanhã"], ["Sexta", "hora:Sexta"], VOLTAR]
    },
    confirmar: {
      texto: function () {
        return "Fica marcado (exemplo): " + escolha.dia.toLowerCase() + " às " + escolha.hora + ". Esta confirmação é só demonstração.";
      },
      opcoes: [["Começar de novo", "inicio"]]
    }
  };

  // Ações dinâmicas: "hora:<dia>" mostra os horários livres desse dia; "escolhe:<hora>" fixa a marcação.
  function resolve(destino) {
    if (destino.indexOf("hora:") === 0) {
      var dia = destino.slice(5);
      escolha.dia = dia;
      return {
        texto: dia + ", tenho livres estes horários (exemplo). Qual prefere?",
        opcoes: horas[dia].map(function (h) { return [h, "escolhe:" + h]; }).concat([VOLTAR])
      };
    }
    if (destino.indexOf("escolhe:") === 0) {
      escolha.hora = destino.slice(8);
      return fluxo.confirmar;
    }
    return fluxo[destino];
  }

  function bolha(texto, quem) {
    var b = document.createElement("div");
    b.className = "bubble " + quem;
    b.textContent = texto;
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
  }

  function mostra(destino) {
    var etapa = resolve(destino);
    opts.innerHTML = "";
    setTimeout(function () {
      bolha(typeof etapa.texto === "function" ? etapa.texto() : etapa.texto, "bot");
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
    }, reduzir ? 0 : 500);
  }

  chat.innerHTML = "";
  mostra("inicio");
})();
