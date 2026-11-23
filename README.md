# Olivar Lume: site

Site estático em HTML, CSS e JavaScript puro. Sem frameworks, sem build, sem serviços pagos.

## Editar textos e o número de WhatsApp

Abra `config.js` e altere os valores:

```js
window.OLIVAR_CONFIG = {
  nomeNegocio: "Olivar Lume",
  whatsappNumber: "[PREENCHER: número]",   // com indicativo, só dígitos. Ex.: 351912345678
  whatsappMessage: "Olá! Gostava de saber mais sobre a Olivar Lume.",
  nif: "[PREENCHER: NIF]",
  morada: "[PREENCHER: morada]"
};
```

Todos os botões de WhatsApp e os dados do rodapé usam estes valores. Não é preciso mexer no código.

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
| `assets/` | Logótipo (`logo.png`) e emblema (`emblema.png`, usado no cabeçalho e como ícone) |
| `logo.png` | Original do logótipo, em tamanho completo |

## Campos por preencher

Os campos com `[PREENCHER: ...]` aparecem destacados a dourado no site:

- Número de WhatsApp (`config.js`)
- NIF e morada (`config.js`, e a política de privacidade)
- Subcontratantes, prazos de conservação, medidas de segurança e confirmação de cookies (`politica-privacidade.html`)

## Ver localmente

Abra `index.html` no navegador. Para testar o menu e as animações, use também um telemóvel na mesma rede ou o modo de desenvolvimento do navegador.

## Publicação

Está alojado no GitHub Pages a partir da branch principal. Cada alteração enviada para essa branch é publicada automaticamente após alguns minutos.
