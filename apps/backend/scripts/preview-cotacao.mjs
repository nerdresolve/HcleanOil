/**
 * Pré-visualiza a proposta com item sob cotação — o caso do tanque, em que o
 * alerta vermelho precisa aparecer no topo.
 *
 *   node scripts/preview-cotacao.mjs [destino.png]
 */
import { chromium } from 'playwright';
import { montarHtmlProposta } from '../dist/proposta/template.js';
import { montarOrcamento } from '../dist/proposta/orcamento.js';

const destino = process.argv[2] ?? 'proposta-cotacao.png';

const orcamento = montarOrcamento(
  [
    { label: 'Dimensões e quantidade — Comprimento (m)', value: '2,10' },
    { label: 'Dimensões e quantidade — Largura (m)', value: '1,60' },
    { label: 'Dimensões e quantidade — Altura (m)', value: '0,45' },
    { label: 'Dimensões e quantidade — Quantidade', value: '2' },
    { label: 'Manta absorvente — Quantidade', value: '400' },
  ],
  { produto: 'Tanque Terrestre', estado: 'SP' },
);

const html = montarHtmlProposta({
  numero: '82/2026',
  data: '20/08/2026',
  validade: '04/09/2026',
  cliente: {
    nome: 'Teste Tanque',
    empresa: 'Empresa Teste',
    email: 'contato@empresa.com.br',
    telefone: '(11) 98888-0000',
  },
  prazoEntrega: '15 dias úteis',
  orcamento,
  observacoes: 'Precisa de dois tanques para operação em pátio.',
});

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
await page.setContent(html, { waitUntil: 'domcontentloaded' });
await page.screenshot({ path: destino, fullPage: true });
await browser.close();

console.log('gerado:', destino);
console.log('exige cotação:', orcamento.exigeCotacao);
