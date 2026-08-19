# HCLEAN — site institucional

Site institucional da HCLEAN, fornecedora técnica B2B de equipamentos para
resposta a emergências ambientais.

O posicionamento da copy é técnico e verificável: sustenta "referência
nacional", "mais de 18 anos" e "operações reais", e evita superlativos como
"líder absoluta" ou "a melhor do Brasil". O site funciona como plataforma de
geração de leads comerciais, não como e-commerce — por isso os CTAs são
"Solicitar atendimento", "Solicitar cotação" e "Falar com um especialista",
nunca "Comprar".

```
apps/
  frontend/   Next.js 16 (App Router) + TypeScript
  backend/    API Express que recebe o formulário e notifica por SMTP
infra/        (vazio)
hclean-designsystem.html   Design system de referência
```

## Frontend

Next.js com App Router. Páginas estáticas geradas no build (incluindo as 12
páginas de produto), o que mantém o LCP no tempo de resposta do CDN.

Decisões que sustentam o SEO:

- **CSS Modules + custom properties**, sem CSS-in-JS. Nenhum JS de estilo chega
  ao cliente; os tokens em `src/styles/tokens.css` são cópia fiel do design
  system.
- **Server Components por padrão.** Só `NavLinks` (link ativo) e `ContactForm`
  (envio) rodam no cliente.
- **`next/font`** auto-hospeda Archivo, Public Sans e IBM Plex Mono no build —
  sem requisição ao Google Fonts e sem layout shift.
- **Ícones SVG inline** desenhados no projeto, em vez de biblioteca.
- `sitemap.xml`, `robots.txt`, canonical, Open Graph e JSON-LD
  (`Organization` e `Product`) já configurados.

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
| Cores, tipografia, espaçamento | `src/styles/tokens.css` |
| Cabeçalho / rodapé | `src/components/site/` |
| Blocos reaproveitados (hero, CTA, cards) | `src/components/sections/` |

Todo o catálogo vive em `src/data/site.ts`. Adicionar um produto ali já gera a
página, o card, o sitemap e os "produtos relacionados".

## Backend

API Express com uma rota: `POST /api/contato`. Valida com Zod, envia a
notificação do lead por SMTP e responde ao formulário.

```bash
cd apps/backend
npm install
cp .env.example .env           # preencha SMTP_PASS
npm run dev                    # http://localhost:4000
npm run email:preview          # gera os e-mails em preview/ para conferir
```

### SMTP

Os leads chegam em `contato.hcleanoil@gmail.com`. Com Gmail é preciso uma
**Senha de App** (`myaccount.google.com/apppasswords`) — a senha da conta não
funciona com 2FA ativa. Configure em `SMTP_PASS`.

Dois e-mails saem por solicitação:

1. **Notificação interna** — dados do lead em tabela, com `Reply-To` apontando
   para quem preencheu, de modo que responder no cliente de e-mail já fala com
   o cliente.
2. **Confirmação** — mensagem institucional para quem preencheu. Desligue com
   `SEND_CONFIRMATION=false`.

Ambos usam a identidade visual da marca (faixa verde-escura com a logo, corpo
branco, rodapé verde), montada em tabelas com estilo inline para sobreviver ao
Outlook e ao Gmail. Rode `npm run email:preview` e abra os arquivos em
`apps/backend/preview/` para conferir no navegador.

### Proteções

- Validação de todos os campos com mensagens em português.
- Rate limit de 5 envios por IP a cada 15 minutos.
- Honeypot (`empresa_site`): campo escondido que só robô preenche. A requisição
  recebe `200` e é descartada em silêncio, sem revelar que foi detectada.
- CORS restrito às origens em `CORS_ORIGINS`.

## Pendências

O que falta depende de material que ainda não existe no projeto:

- **Fotos.** Todas as imagens são placeholders (`MediaFrame`) com o `alt` já
  descrito. Substituir por `next/image`.
- **Especificações técnicas.** `specs` está vazio em todos os produtos e a
  seção "Características" some enquanto assim for — preferível a publicar
  número inventado. Preencher em `src/data/site.ts` com os dados de fábrica.
- **Logos de clientes/órgãos/certificados** na página Sobre. É a seção de maior
  peso comercial; hoje são cinco espaços reservados.
- **Logo oficial.** O símbolo em `src/components/ui/Logo.tsx` e o PNG do e-mail
  foram redesenhados a partir do design system. Trocar pelo arquivo oficial.
- **CNPJ** no rodapé, se for para constar.
