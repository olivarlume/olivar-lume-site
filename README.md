# Olivar Lume: site

Site estático em HTML, CSS e JavaScript puro. Sem frameworks, sem build, sem serviços pagos.

## Editar textos e o número de WhatsApp

Abra `config.js` e altere os valores:

```js
window.OLIVAR_CONFIG = {
  nomeNegocio: "Olivar Lume",
  whatsappNumber: "351965669983",       // indicativo + número, só dígitos (ligações wa.me)
  whatsappDisplay: "+351 965 669 983",   // como o número aparece escrito no site
  whatsappMessage: "Olá! Gostava de saber mais sobre a Olivar Lume.",
  nif: "296932540",
  morada: "Rua de Moutides, 299"
};
```

Todos os botões de WhatsApp e os dados do rodapé usam estes valores. Não é preciso mexer no código. Se mudar o número, altere `whatsappNumber` e `whatsappDisplay` juntos.

## Dados da empresa (referência)

| Dado | Valor |
|---|---|
| Nome | Olivar Lume |
| WhatsApp | +351 965 669 983 (`wa.me/351965669983`) |
| NIF | 296932540 |
| Morada | Rua de Moutides, 299 |

Estes dados aparecem no rodapé de todas as páginas e na identificação do responsável pelo tratamento, em `politica-privacidade.html` (o texto da política é fixo no ficheiro: se mudar os dados, altere-o também).

Os textos das páginas estão diretamente nos ficheiros `.html`. Para alterar um texto, procure-o com a pesquisa do editor e substitua-o.

## Estrutura

| Ficheiro | Conteúdo |
|---|---|
| `index.html` | Página principal: hero, serviços, como funciona, para quem é, FAQ, contacto |
| `servicos.html` | Detalhe dos três serviços |
| `como-funciona.html` | Três passos e o que precisa de enviar para começar |
| `politica-privacidade.html` | Rascunho de política de privacidade (RGPD). Tem de ser revisto antes de publicar |
| `config.js` | Número de WhatsApp, NIF e morada |
| `css/style.css` | Cores, tipografia e layout (variáveis `--navy-*`, `--gold*`, `--silver`, `--warm-white` no topo) |
| `js/main.js` | Ligações de WhatsApp, menu mobile, animação de entrada |
| `assets/` | Logótipo: `logo-transparente.png` (alternativa), `logo-600.webp` e `logo-1200.webp` (usados na página principal), `logo.png` (fundo opaco, para pré-visualizações sociais) e `emblema.png` (cabeçalho e ícone) |

## Campos por preencher

Os campos com `[PREENCHER: ...]` aparecem destacados a dourado no site. Os que restam estão todos em `politica-privacidade.html`:

- Confirmação sobre cookies ou ferramentas de análise
- Lista de subcontratantes e países de tratamento
- Prazos de conservação por categoria de dados
- Medidas de segurança concretas

## Ver localmente

Abra `index.html` no navegador. Para testar o menu e as animações, use também um telemóvel na mesma rede ou o modo de desenvolvimento do navegador.

## Publicação

Está alojado no GitHub Pages a partir da branch principal. Cada alteração enviada para essa branch é publicada automaticamente após alguns minutos.
