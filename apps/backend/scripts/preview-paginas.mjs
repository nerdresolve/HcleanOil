/**
 * Mostra a proposta paginada como o PDF sai — uma imagem por página A4.
 *
 * Diferente do preview de página única, aqui dá para ver o que cai no fim de
 * cada folha: figura cortada, tabela partida, título órfão.
 *
 *   node scripts/preview-paginas.mjs [pasta-destino]
 */
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { montarHtmlProposta } from '../dist/proposta/template.js';
import { montarOrcamento } from '../dist/proposta/orcamento.js';

const destino = resolve(process.argv[2] ?? 'preview-paginas');
mkdirSync(destino, { recursive: true });

const orcamento = montarOrcamento([{ label: 'Metragem desejada (m)', value: '20' }], {
  produto: 'Barreira de Contenção SeaFence',
  estado: 'RJ',
});

const html = montarHtmlProposta({
  numero: '86/2026',
  data: '20/08/2026',
  validade: '19/09/2026',
  cliente: {
    nome: 'Ana Souza',
    empresa: 'Empresa Exemplo',
    email: 'cliente@exemplo.com.br',
    telefone: '(11) 90000-0000',
  },
  prazoEntrega: '15 dias úteis',
  orcamento,
  observacoes: 'Operação em píer de transferência, corrente baixa.',
});

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });

/* Em mídia de tela as quebras de @page não se aplicam, e o recorte por
   scroll mentiria sobre onde cada folha termina. Com media=print o Chromium
   respeita break-before/inside, então o recorte por altura de A4 corresponde
   ao que o PDF gera. */
await page.emulateMedia({ media: 'print' });

// 794 x 1123 px = A4 a 96 dpi.
const A4 = { width: 794, height: 1123 };
await page.setViewportSize(A4);

const alturaTotal = await page.evaluate(() => document.documentElement.scrollHeight);
const paginas = Math.max(1, Math.ceil(alturaTotal / A4.height));

for (let i = 0; i < paginas; i++) {
  await page.screenshot({
    path: join(destino, `pagina-${i + 1}.png`),
    fullPage: true,
    clip: { x: 0, y: i * A4.height, width: A4.width, height: A4.height },
  });
}

await browser.close();
console.log(`${paginas} páginas em ${destino}`);
