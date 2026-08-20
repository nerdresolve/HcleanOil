/**
 * Testa o fluxo completo como um cliente faria: abre o site, preenche o
 * pop-up de orçamento e envia.
 *
 *   node scripts/testar-fluxo-proposta.mjs [baseUrl] [email]
 *
 * Diferente de chamar a API direto, isso exercita o formulário de verdade —
 * inclusive o campo de estado, que define o frete.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3100';
const EMAIL = process.argv[3] ?? 'cliente@exemplo.com.br';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const erros = [];
page.on('console', (m) => {
  if (m.type() === 'error') erros.push(m.text().slice(0, 160));
});

/* A requisição real que sai do navegador — para conferir o que foi enviado. */
let enviado = null;
page.on('request', (r) => {
  if (r.url().includes('/api/contato') && r.method() === 'POST') {
    try {
      enviado = JSON.parse(r.postData() ?? '{}');
    } catch {}
  }
});

await page.goto(`${BASE}/produtos/barreira-de-contencao-seafence`, {
  waitUntil: 'networkidle',
});

await page.getByRole('button', { name: /solicitar cotação/i }).first().click();
const dialog = page.locator('dialog[open]');
await dialog.waitFor({ state: 'visible' });

await dialog.locator('#q-nome').fill('Ana Souza');
await dialog.locator('#q-empresa').fill('Empresa Exemplo');
await dialog.locator('#q-email').fill(EMAIL);
await dialog.locator('#q-telefone').fill('(11) 90000-0000');
await dialog.locator('#q-estado').selectOption('RJ');
await page.waitForTimeout(300);

// O produto já vem pré-selecionado pela página; preenche a metragem.
await dialog.locator('input[type="number"]').first().fill('20');
await dialog
  .locator('#q-mensagem')
  .fill('Teste do fluxo completo: 20 metros de barreira de contenção.');

await page.screenshot({ path: 'fluxo-antes-de-enviar.png' });

await dialog.getByRole('button', { name: /enviar mensagem/i }).click();
await dialog.getByText('Solicitação enviada').waitFor({ timeout: 20000 });

console.log('formulário enviado com sucesso\n');
console.log('payload que saiu do navegador:');
for (const [k, v] of Object.entries(enviado ?? {})) {
  if (v) console.log(`  ${k}: ${v}`);
}

console.log(erros.length ? `\nerros de console:\n  ${erros.join('\n  ')}` : '\nsem erros de console');

await browser.close();
