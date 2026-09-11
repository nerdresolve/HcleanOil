<div align="center">

<img src="docs/brand/banner.svg" alt="HCLEAN: equipamentos para resposta a emergências ambientais" width="100%">

Site institucional de uma fornecedora técnica B2B de equipamentos para resposta
a emergências ambientais. O visitante monta o pedido num pop-up e recebe a
proposta comercial em PDF, gerada na hora.

[![Licença](https://img.shields.io/badge/licen%C3%A7a-todos%20os%20direitos%20reservados-0e3d27)](LICENSE) ![Stack](https://img.shields.io/badge/Next.js%2016-React%2019-061a11) ![API](https://img.shields.io/badge/Express-Playwright-175034) ![Deploy](https://img.shields.io/badge/Docker-Cloudflare%20Tunnel-00bf63)

**[Ver o site](https://hclean.nerdresolve.com)** · [As telas](#as-telas) · [O que resolve](#o-que-o-projeto-resolve) · [Publicação](#publicação) · [Licença](#licença)

</div>

---

```
apps/
  frontend/   Next.js 16 (App Router) + TypeScript
  backend/    API Express que recebe o formulário e gera a proposta
infra/        configuração do túnel de publicação
```

## O que o projeto resolve

A operação anterior era manual: o lead chegava por e-mail, alguém abria uma
planilha, montava a proposta no Word e devolvia em PDF. O gargalo estava nas
horas entre o pedido e a resposta.

Aqui o caminho inteiro é automático. O formulário coleta produto, variante e
quantidade; a API valida, calcula o orçamento com a tabela de preços, renderiza
o PDF e dispara três mensagens: notificação interna, confirmação para quem
preencheu e a proposta com o anexo.

Quando algum item do pedido não tem preço de tabela, a proposta não sai para o
cliente. Ela vai apenas para a equipe, com alerta, para que alguém complete os
valores à mão. Errar um preço numa proposta comercial custa mais caro do que
atrasar o envio.

## As telas

O pop-up de orçamento é o centro do projeto: cada produto escolhido vira um
cartão com suas variantes e quantidades, e o seletor fica livre para o próximo.

<div align="center">
<img src="docs/telas/07-orcamento-card.webp" alt="Pop-up de orçamento com vários produtos no mesmo pedido" width="88%">
</div>

<table>
<tr>
<td width="50%"><a href="docs/telas/01-home.webp" title="ver a página inteira"><img src="docs/telas/01-home-card.webp" alt="Home do site"></a><br><sub><b>Home</b> · hero em tela cheia e os números da operação</sub></td>
<td width="50%"><a href="docs/telas/02-produtos.webp" title="ver a página inteira"><img src="docs/telas/02-produtos-card.webp" alt="Vitrine de produtos"></a><br><sub><b>Produtos</b> · as três linhas, barreiras, kits e o tanque</sub></td>
</tr>
<tr>
<td width="50%"><a href="docs/telas/03-produto.webp" title="ver a página inteira"><img src="docs/telas/03-produto-card.webp" alt="Página da Linha Branca"></a><br><sub><b>Produto</b> · dados técnicos de fábrica por linha</sub></td>
<td width="50%"><a href="docs/telas/04-formato.webp" title="ver a página inteira"><img src="docs/telas/04-formato-card.webp" alt="Página por formato"></a><br><sub><b>Formato</b> · o mesmo formato nas três linhas, lado a lado</sub></td>
</tr>
<tr>
<td width="50%"><a href="docs/telas/05-sobre.webp" title="ver a página inteira"><img src="docs/telas/05-sobre-card.webp" alt="Página institucional"></a><br><sub><b>Sobre</b> · a operação e a experiência da empresa</sub></td>
<td width="50%"><a href="docs/telas/07-orcamento.webp" title="ver a página inteira"><img src="docs/telas/07-orcamento-card.webp" alt="Pop-up de orçamento"></a><br><sub><b>Orçamento</b> · vários produtos no mesmo pedido</sub></td>
</tr>
</table>

### No celular

O mesmo conteúdo se reorganiza em uma coluna, com os alvos de toque em 44px.

<div align="center">
<a href="docs/telas/06-mobile.webp" title="ver a página inteira"><img src="docs/telas/06-mobile-card.webp" alt="Home no telefone" width="320"></a>
</div>

---

## Frontend

Next.js com App Router. As páginas são geradas no build, incluindo as de
produto, o que mantém o LCP no tempo de resposta do CDN.

Decisões que sustentam o SEO e a performance:

* **CSS Modules com custom properties**, sem CSS-in-JS. Nenhum JavaScript de
  estilo chega ao cliente.
* **Server Components por padrão.** Só o link ativo da navegação e o pop-up de
  orçamento rodam no cliente.
* **`next/font`** auto-hospeda a tipografia em WOFF2 no build, sem requisição
  externa e sem layout shift.
* **Ícones SVG inline** desenhados no projeto, em vez de biblioteca.
* `sitemap.xml`, `robots.txt`, canonical, Open Graph e JSON-LD já configurados.

```bash
cd apps/frontend
npm install
cp .env.example .env.local     # aponte NEXT_PUBLIC_API_URL para a API
npm run dev                    # http://localhost:3000
npm run build && npm start     # produção
```

### Onde mexer

| O que | Arquivo |
| --- | --- |
| Copy, produtos, categorias, contato | `src/data/site.ts` |
| Quantidades e mínimos do orçamento | `src/data/quote.ts` |
| Cores, tipografia, espaçamento | `src/styles/tokens.css` |
| Cabeçalho e rodapé | `src/components/site/` |
| Blocos reaproveitados | `src/components/sections/` |

Todo o catálogo vive em `src/data/site.ts`. Adicionar um produto ali já gera a
página, o card, o sitemap e os "produtos relacionados".

---

## Backend

API Express com uma rota: `POST /api/contato`. Valida com Zod, monta o
orçamento, gera o PDF e envia por SMTP.

```bash
cd apps/backend
npm install
cp .env.example .env           # preencha as credenciais SMTP
npm run dev                    # http://localhost:4000
npm run email:preview          # gera os e-mails em preview/ para conferir
```

### Pedido com vários produtos

O pop-up funciona como um carrinho: cada produto escolhido vira um cartão com
suas variantes e quantidades, e o seletor fica livre para o próximo. As
quantidades já digitadas não se perdem ao adicionar outro item.

Cada campo de quantidade carrega o nome do produto no próprio rótulo. É isso que
permite ao backend precificar linha a linha quando o pedido mistura produtos
diferentes, cada um com sua tabela.

### Proposta em PDF

O PDF é renderizado num Chromium headless via Playwright, a partir de HTML. Isso
substituiu a dependência de Word do processo anterior: o mesmo binário roda em
Windows e Linux, sem interface, sem licença.

A numeração é sequencial por ano e fica num contador em disco, montado como
volume para sobreviver a um novo deploy.

### SMTP

Dois e-mails saem por solicitação, mais a proposta:

1. **Notificação interna** com os dados do lead em tabela, e `Reply-To`
   apontando para quem preencheu, de modo que responder no cliente de e-mail já
   fala com o cliente.
2. **Confirmação** para quem preencheu. Desligue com `SEND_CONFIRMATION=false`.

Ambos usam a identidade visual da marca, montada em tabelas com estilo inline
para sobreviver ao Outlook e ao Gmail.

`MAIL_BCC` põe uma cópia oculta em tudo que sai. Fica oculta de verdade: quem
recebe a confirmação não vê o endereço.

### Proteções

* Validação de todos os campos com mensagens em português.
* Rate limit de 5 envios por IP a cada 15 minutos.
* Honeypot: campo escondido que só robô preenche. A requisição recebe `200` e é
  descartada em silêncio, sem revelar que foi detectada.
* CORS restrito às origens em `CORS_ORIGINS`.

---

## Publicação

Site, API e túnel sobem juntos em containers:

```bash
docker compose up -d --build     # sobe tudo
docker compose ps                # estado e saúde
docker compose logs -f backend   # acompanha a API
docker compose down              # derruba
```

`restart: unless-stopped` mantém o site no ar: o Docker religa os containers
quando eles quebram e quando o próprio Docker inicia, inclusive depois de
reiniciar a máquina. Um container parado à mão continua parado, que é o que o
"unless-stopped" significa.

O backend usa a imagem oficial do Playwright, e não uma Node enxuta, porque a
proposta é renderizada num Chromium. A tag precisa casar com a versão da
biblioteca no `package.json`.

Credenciais nunca entram nas imagens. Chegam por `env_file` na subida, e os
`.dockerignore` excluem os arquivos de ambiente.

| O que | Onde |
| --- | --- |
| Serviços e política de restart | `docker-compose.yml` |
| Roteamento do túnel | `infra/cloudflared/config.yml` |
| Variáveis da API | `apps/backend/.env` (fora do versionamento) |

---

## Licença

© 2026 NerdResolve. Todos os direitos reservados.

O repositório é público para avaliação técnica e demonstração de portfólio. O
código pode ser lido e estudado; não há licença de uso, cópia ou
redistribuição. Ver [LICENSE](LICENSE).

A marca, as fotografias e o conteúdo institucional da HCLEAN pertencem à
titular e não são licenciados por este repositório.

<div align="center">
<img src="apps/frontend/public/marca/hclean-simbolo.webp" width="64" alt="">
</div>
