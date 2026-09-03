# MFB Engenharia — Landing Page

**No ar:** https://pages.mfbengenharia.com.br

Reprodução fiel da landing page da MFB Engenharia a partir do layout original
(artboard de 1920 px exportado em PDF).

HTML, CSS e JavaScript puros — sem build, sem dependências, sem requisições externas.
Basta servir a pasta por HTTP.

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

> As fontes são carregadas via `@font-face` a partir de `assets/fonts/`. Navegadores
> bloqueiam esse carregamento no protocolo `file://` — abra sempre por HTTP.

---

## Especificação extraída do layout

Todos os valores abaixo foram medidos diretamente no PDF, não estimados.

### Tipografia — **Poppins**

Identificada por comparação de contornos: a fonte foi testada contra 8 candidatas
geométricas e confirmada por sobreposição de glifos, com **98,9% de IoU** contra
Poppins Bold. O tracking de −2% dos títulos também foi derivado da medição
(largura real 682,5 px contra 713,3 px da largura natural em 72 px).

| Uso | Tamanho | Entrelinha | Peso | Tracking |
|---|---|---|---|---|
| H1 (hero) | 72 px | 68,5 px | 700 | −0,02em |
| H2 (seções) | 48 px | 60 px | 700 | −0,02em |
| H2 (contato) | 60 px | 57 px | 700 | −0,02em |
| Números decorativos | 60 px / 48 px | 1 | 700 | −0,02em |
| Banner CTA | 30 px | 38 px | 700 | −0,02em |
| Título do formulário | 24 px | 32 px | 700 | −0,02em |
| Títulos de card | 20 px / 18 px | 28 px / 24 px | 700 | −0,02em |
| Texto de apoio | 18 px | 28–29 px | 400 | 0 |
| Corpo | 16 px | 26 px | 400 | 0 |
| Texto pequeno | 14 px | 22–23 px | 400 | 0 |
| Eyebrow | 12 px | 1 | 600 | 0,11em, caixa alta |

Pesos 400, 500, 600 e 700 são auto-hospedados em `woff2` (subsets `latin` e
`latin-ext`), cobrindo todos os acentos do português.

### Cores

| Token | Hex | Uso |
|---|---|---|
| `--orange` | `#F97C3D` | Cor primária: botões, destaques, ícones |
| `--orange-soft` | `#FDEEE4` | Fundo dos losangos claros |
| `--ink` | `#0A0A0A` | Títulos e rodapé |
| `--black` | `#000000` | Seções escuras, banner CTA |
| `--text` | `#333333` | Texto corrente |
| `--muted` | `#7A7A7A` | Texto secundário |
| `--soft` | `#F7F7F5` | Fundo das seções alternadas |
| `--line` | `#E9E9E9` | Bordas e divisores |

### Grid

Conteúdo de **1232 px** centrado (margens de 344 px em 1920 px). Cards de soluções
e passos em 4 colunas de 290 px com 24 px de gutter; diferenciais e depoimentos em
3 colunas de 395 px. O acordeão do FAQ usa uma coluna mais estreita, de 850 px.

---

## Assets

As imagens foram extraídas do PDF com suas máscaras de transparência (SMask) e
recompostas. Detalhes que exigiram atenção:

- **Hero** — composição de duas camadas do original (fundo de data center + recorte
  dos profissionais). A ordem de empilhamento foi determinada por comparação
  numérica contra o render do PDF (MAE 11,3 contra 59,7 da ordem invertida). O
  esmaecimento branco à esquerda é reproduzido em CSS, para acompanhar a
  reflow responsiva em vez de ficar gravado no arquivo.
- **Contato** — a imagem é **espelhada na horizontal** no layout original
  (matriz de transformação do PDF: `a = -1577`). Reproduzido com `transform: scaleX(-1)`.
- **Cards de soluções** — recortados na janela visível de cada card (290 × 162 px),
  calculada a partir da posição de cada imagem no PDF.
- **Logo** — usa-se o arquivo original do PDF (400 × 220 px com transparência).
  Exibido a 115 px de largura, o que dá 3,5× de densidade — mais nítido que 2× retina.
- **Favicon** — arquivos próprios em 16, 32 e 48 px, mais um `apple-touch-icon` de
  180 px. O logo tem 2,18:1 e o navegador espremia isso num quadrado, distorcendo
  a marca; agora ela é encaixada sem esticar, com o wordmark "ENGENHARIA" removido
  por ser ilegível nesses tamanhos. O ícone da Apple leva fundo branco e mais
  folga, porque o iOS pinta transparência de preto e arredonda os cantos.
- **Ícones** — refeitos como SVG inline (traçado, padrão Lucide) em vez dos JPEGs
  rasterizados do PDF, ficando nítidos em qualquer resolução e permitindo herdar cor.

Total de imagens: ~830 KB.

---

## Estrutura

```
index.html                 marcação das 10 seções + sprite SVG de ícones
assets/css/style.css       tokens, layout e 3 breakpoints
assets/js/main.js          acordeão, menu mobile, rolagem, scrollspy, formulário
assets/fonts/              Poppins 400/500/600/700 (woff2, latin + latin-ext)
assets/img/                imagens extraídas do layout
```

### Seções

Header · Hero · Soluções · Diferenciais · Visão de Futuro · Metodologia ·
Depoimentos · FAQ · Contato · Rodapé

---

## Formulário de contato

O envio tem duas pernas: registrar o lead por e-mail em
`comercial@mfbengenharia.com.br` e levar a pessoa para o WhatsApp comercial
(+55 11 4858-4921) com a conversa já iniciada.

**WhatsApp (formulário).** Ao enviar, a saudação é montada com os dados recém-digitados e
codificada num link `wa.me`, de modo que a equipe recebe nome, empresa, e-mail e o
contexto da operação sem precisar perguntar de novo. O redirecionamento é em
mesma aba, após 1,4 s de confirmação na tela; se algo bloquear a navegação, um link
visível fica no lugar.

**E-mail.** O formulário faz `POST` de um JSON para um webhook do n8n, que cuida do
envio. Payload:

```json
{
  "nome": "Ana Ribeiro",
  "email": "ana@empresa.com.br",
  "empresa": "Empresa Alfa",
  "mensagem": "Data center com 40 racks.",
  "site": "",
  "origem": "https://pages.mfbengenharia.com.br/"
}
```

Se o `POST` falhar — rede, CORS ou erro no workflow —, o visitante ainda é levado ao
WhatsApp com os mesmos dados: uma indisponibilidade do n8n não pode fazer o lead se
perder. A falha vai para o console do navegador.

### Produção x teste

O webhook de teste do n8n só responde depois de clicar em "Execute workflow" no
editor e vale por uma única chamada — não serve para o site publicado. Por isso a
escolha é automática, em `endpoint()`:

| Onde | Webhook |
|---|---|
| Site publicado | produção |
| Site publicado com `?wh=test` na URL | teste |
| `localhost` / `127.0.0.1` | teste |

O `?wh=test` permite exercitar o workflow contra o site no ar sem republicar nada:
abra `https://pages.mfbengenharia.com.br/?wh=test`, clique em "Execute workflow" no
n8n e envie o formulário.

### CORS

O `POST` sai do navegador para outro domínio, então o nó Webhook precisa responder
ao preflight com CORS — sem isso o navegador bloqueia a chamada antes de ela sair.
Já está configurado: um `OPTIONS` para o webhook de produção devolve `204` com
`Access-Control-Allow-Origin`, `-Methods: OPTIONS, POST` e `-Headers: content-type`.

Vale saber que o nó **ecoa qualquer origem** que peça — testado com um domínio
aleatório, que também foi liberado. Na prática o CORS ali não restringe nada; ele
só destrava a chamada do navegador. A proteção real precisa estar no workflow.

### Sobre o endereço ficar visível

O webhook aparece no `main.js`, como acontece com qualquer integração feita do lado
do navegador — não há onde esconder uma URL que o próprio navegador precisa chamar.
Vale tratar a validação no workflow: descartar envio com `site` preenchido (é a isca
anti-robô), exigir `nome`, `email` e `empresa`, e limitar a taxa por IP.

**Anti-spam.** O campo `site` é uma isca: fica a −9999 px da tela, fora da ordem de
tabulação e com `aria-hidden`. Nenhum visitante o preenche, então qualquer envio com
ele preenchido deve ser descartado por quem receber o `POST`.

---

## Política de privacidade

Abre num `<dialog>` nativo pelo link do rodapé. O nativo entrega de graça a
armadilha de foco, o fechamento por `Esc` e o fundo escurecido; há um fallback em
JavaScript para navegadores sem suporte.

O `id` serve de âncora, então `pages.mfbengenharia.com.br/#politica-de-privacidade`
abre o documento direto — um endereço compartilhável, útil se alguma plataforma de
anúncios pedir a URL da política.

### Dados cadastrais

Preenchida com **MFB Engenharia Ltda**, CNPJ 24.949.310/0001-15, Rua Jurubatuba,
1350, Sala 404, São Bernardo do Campo – SP, CEP 09725-000.

Duas escolhas que valem registro. O **bairro ficou fora do endereço**: o cadastro
recebido trazia "Centro (ou Vila Lusitânia)", e publicar a dúvida — ou chutar entre
as duas — não cabe num documento jurídico; o CEP já identifica a localidade. E o
**e-mail de privacidade** usa `contato@mfbengenharia.com.br`, o endereço público que
já consta no rodapé, por falta de um canal dedicado ao encarregado de dados; trocar
por um específico é uma linha.

### Detalhe do `<dialog>`

O `display` do `.policy` fica preso a `[open]`. Declarado solto, ele venceria o
`display:none` que o navegador aplica ao `<dialog>` fechado — estilos de autor
sempre vencem os do agente de usuário —, e o modal entraria no fluxo da página,
somando ~750 px de espaço vazio no fim do documento e deslocando a rolagem ao abrir.

---

## Chatbot LeadStaker

O snippet fica no fim do `<head>`. Ele busca a configuração em
`api.leadstaker.com/chats` e injeta o script devolvido.

A configuração vem do servidor, não do código, e declara **dois** chats:

| Chat | Como aparece | Gatilho |
|---|---|---|
| `floater` | balão fixo no canto inferior direito | sempre visível |
| `modal` | janela sobre a página | seletor `.cta-leadstaker` |

Por isso os 7 CTAs que levam ao contato receberam a classe `cta-leadstaker`. Foi
verificado no payload da API: o campo `toggles` traz `[".cta-leadstaker"]` — **uma
classe, não um id**. O `id="leadstaker"` existe em um único botão (o CTA do hero),
porque `id` precisa ser único no documento e repeti-lo quebraria
`getElementById` para todos menos o primeiro.

O botão de enviar do formulário ficou **de fora** de propósito: ele registra o lead
no n8n e encaminha ao WhatsApp, não abre chat.

Os CTAs mantêm `href="#contato"` e a rolagem suave. Como o chat abre em modal,
cobrindo a página, a rolagem por trás não aparece — e se o LeadStaker não carregar,
o botão continua levando ao formulário em vez de não fazer nada.

---

## Google Tag Manager

Container `GTM-NG8VH6K8`. O trecho principal fica no topo do `<head>`, logo após as
metatags essenciais, e o `<noscript>` é o primeiro elemento do `<body>`.

**O gatilho nativo de Form Submission não vai disparar neste formulário.** Ele
depende do evento `submit` seguir seu curso, e aqui o envio é interceptado com
`preventDefault()` para fazer o `POST` ao n8n e depois redirecionar ao WhatsApp.
Para medir conversão é preciso um `dataLayer.push` no ponto de sucesso do envio,
dentro de `assets/js/main.js` — ainda não incluído, porque o nome do evento deve
seguir a taxonomia usada no container.

O mesmo vale para os cliques que levam ao WhatsApp: o botão flutuante é um link
comum e o gatilho de clique pega sem problema, mas o redirecionamento do formulário
acontece via `window.location`, que não gera clique nenhum.

---

## Movimento e interações

**Entrada dos elementos.** Um `IntersectionObserver` marca `.is-in` quando o bloco
entra na viewport; a transição é de opacidade e deslocamento vertical, uma única
vez por elemento. Blocos marcados com `data-reveal-group` escalonam os filhos em
80 ms cada, o que dá o efeito de cascata nas grades.

O estado inicial escondido é aplicado apenas quando um script no `<head>` adiciona
`.reveal-on` ao `<html>`, e ele só faz isso se houver `IntersectionObserver` e o
visitante não tiver pedido menos movimento. Sem JavaScript, em navegador antigo ou
com `prefers-reduced-motion: reduce`, nada é escondido e a página aparece inteira.
Há ainda uma rede de segurança: se o `main.js` não carregar, o `load` desfaz o
estado escondido — a página nunca fica em branco por causa da animação.

**Borda com gradiente rotativo.** No hover de `.scard`, `.fcard`, `.qcard` e `.acc`,
um `conic-gradient` gira ao redor da caixa. O ângulo é registrado via `@property`
como `<angle>`, que é o que permite interpolá-lo; onde `@property` não existe o
gradiente aparece parado, o que continua sendo uma borda válida.

**Ícone do FAQ.** O losango gira 180° ao abrir e o `+` cruza com o `−` girando 90°
em sentidos opostos. Os dois ícones dividem a mesma célula do grid porque
`display:none` não é animável.

---

## Verificação

A página foi conferida contra o PDF seção a seção. Altura total renderizada em
1920 px: **7902 px** contra **7879 px** do original. A diferença de 23 px vem da
sobreposição pedida nos cards de Soluções (ver abaixo); nenhuma outra seção
diverge mais de 4 px do seu topo ou altura de referência.

Interações cobertas por teste automatizado (22 verificações, todas passando):
acordeão do FAQ, menu mobile, rolagem com compensação do header, validação do
formulário, ausência de rolagem horizontal e ausência de erros de JavaScript.

Responsivo em 3 breakpoints: 1360 px (container fluido), 1024 px (menu hambúrguer,
grids de 2 colunas, hero empilhado) e 720 px (coluna única).

### Contraste do texto sobre foto (seção Contato)

Medido nos pixels de glifo renderizados, não por estimativa: a página é capturada
com e sem cada bloco de texto, o diff isola o traço das letras e a luminância do
fundo é lida exatamente nessas posições. Valores no percentil 95 (quase pior caso):

| Texto | Antes | Depois | Exigido |
|---|---|---|---|
| Título (branco, 60 px) | 3,69:1 | 16,91:1 | 3:1 |
| Parágrafo (`#D8D8D8`, 18 px) | 3,39:1 ❌ | 12,39:1 | 4,5:1 |
| Eyebrow (laranja, 12 px) | 3,69:1 ❌ | 5,90:1 | 4,5:1 |

O parágrafo e o eyebrow reprovavam em WCAG AA. O gradiente tinha sua janela mais
clara em 28% da largura, exatamente onde o texto começa; ela foi deslocada para os
6% iniciais — à esquerda do texto, o que preserva a figura da foto — e o
escurecimento passa a subir a partir dali.

---

## Deploy

Hospedado na Vercel, projeto `v4-sites-ais-projects/mfb-engenharia`. Site estático
servido a partir da raiz, sem etapa de build.

O `vercel.json` define:

| Recurso | Cache-Control |
|---|---|
| HTML | `max-age=0, must-revalidate` |
| `assets/fonts/` | `max-age=31536000, immutable` |
| `assets/img/` | `max-age=604800, stale-while-revalidate=86400` |
| `assets/css/`, `assets/js/` | `max-age=3600, must-revalidate` |

CSS e JS ficam com cache curto de propósito: os arquivos não têm hash no nome, então
cache longo impediria que uma correção chegasse aos visitantes.

Também aplica `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy` e `Permissions-Policy` em todas as respostas.

`cleanUrls` está ligado: `/index.html` responde 308 para `/`.

### Publicar uma nova versão

```bash
vercel --prod          # a partir da raiz do repositório
```

Vale conectar o repositório em vercel.com para ter deploy automático a cada push
e preview por pull request.

---

## Pontos que precisam de decisão do cliente

1. **Respostas do FAQ** — o PDF traz apenas a resposta da primeira pergunta; as
   outras três aparecem fechadas, sem texto. As respostas de "A MFB realiza apenas
   execução?", "Vocês atendem projetos de expansão?" e "Como funciona a avaliação
   técnica?" foram redigidas no mesmo tom da marca e **precisam de revisão**.
2. **E-mail do rodapé** — o rodapé exibe `contato@mfbengenharia.com.br`, que veio do
   PDF, enquanto o formulário registra os leads em `comercial@mfbengenharia.com.br`.
   Os dois endereços podem conviver de propósito; se não for o caso, unificar.
4. **Depoimentos** — os três textos são genéricos ("Diretor de TI", "Empresa de
   Tecnologia"), como no layout. Substituir por depoimentos reais e autorizados.

### Ajustes deliberados em relação ao layout

**Coluna da "Visão de futuro".** Nessa seção o texto começa em x=369 no PDF,
enquanto todas as demais seções começam em x=344. Trata-se de um desalinhamento de
25 px do arquivo original; a coluna foi normalizada para 344 px, mantendo o grid
consistente. Para reproduzir o desalinhamento, basta acrescentar
`padding-left: 25px` em `.future__copy`.

**Altura do hero.** O layout pede 1070 px fixos, mais do que a área visível de um
notebook comum (~950 px com a barra do navegador). O texto ficava centralizado numa
altura que ninguém via inteira, e na prática aparecia empurrado para baixo. A altura
passou a ser `min-height: min(1070px, 100svh)`: em telas altas mantém os 1070 px do
design, em telas menores acompanha a viewport. É `min-height`, não `height`, para o
conteúdo nunca ficar espremido — em telas muito baixas o hero cresce e a página
rola normalmente. `svh` em vez de `vh` evita o salto que a barra de endereço causa
no mobile, com uma declaração `vh` antes como fallback.

**Cards de Soluções.** No PDF a imagem e a caixa de texto são dois blocos
encostados. A pedido, a caixa passou a invadir 38 px da base da imagem, com 12 px
de recuo lateral, para os dois lerem como uma peça só. A imagem foi de 162 px para
200 px de altura justamente para que a área visível continue sendo os 162 px do
layout — o que muda é só a sobra coberta. O recuo lateral estreita a caixa e faz
alguns títulos quebrarem em duas linhas, daí os 23 px a mais na altura da página.
