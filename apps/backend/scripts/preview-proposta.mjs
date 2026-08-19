/**
 * Salva a proposta como PNG, para conferir o layout sem abrir o PDF.
 *
 *   node scripts/preview-proposta.mjs [destino.png]
 */
import { chromium } from 'playwright';
import { montarHtmlProposta } from '../dist/proposta/template.js';
import { montarOrcamento } from '../dist/proposta/orcamento.js';

const destino = process.argv[2] ?? 'proposta-preview.png';

const orcamento = montarOrcamento([{ label: 'Metragem desejada (m)', value: '20' }], {
  produto: 'Barreira de Contenção SeaFence',
  estado: 'RJ',
});

const html = montarHtmlProposta({
  numero: '01/2026',
  data: '20/08/2026',
  validade: '04/09/2026',
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
// 794 x 1123 px = A4 a 96 dpi.
const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
await page.setContent(html, { waitUntil: 'domcontentloaded' });
await page.screenshot({ path: destino, fullPage: true });
await browser.close();

console.log('gerado:', destino);
