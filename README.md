# MFB Engenharia — Landing Page

**No ar:** https://mfb-engenharia.vercel.app

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
2. **Dados de contato** — telefone `+55 (11) 0000-0000` é o placeholder do próprio
   layout. O e-mail `contato@mfbengenharia.com.br` veio do PDF.
3. **Envio do formulário** — hoje o formulário valida e limpa os campos, sem enviar
   para lugar nenhum. Falta plugar o destino (CRM, e-mail ou endpoint próprio);
   o ponto está marcado com `TODO` em `assets/js/main.js`.
4. **Depoimentos** — os três textos são genéricos ("Diretor de TI", "Empresa de
   Tecnologia"), como no layout. Substituir por depoimentos reais e autorizados.

### Ajustes deliberados em relação ao layout

**Coluna da "Visão de futuro".** Nessa seção o texto começa em x=369 no PDF,
enquanto todas as demais seções começam em x=344. Trata-se de um desalinhamento de
25 px do arquivo original; a coluna foi normalizada para 344 px, mantendo o grid
consistente. Para reproduzir o desalinhamento, basta acrescentar
`padding-left: 25px` em `.future__copy`.

**Cards de Soluções.** No PDF a imagem e a caixa de texto são dois blocos
encostados. A pedido, a caixa passou a invadir 38 px da base da imagem, com 12 px
de recuo lateral, para os dois lerem como uma peça só. A imagem foi de 162 px para
200 px de altura justamente para que a área visível continue sendo os 162 px do
layout — o que muda é só a sobra coberta. O recuo lateral estreita a caixa e faz
alguns títulos quebrarem em duas linhas, daí os 23 px a mais na altura da página.
