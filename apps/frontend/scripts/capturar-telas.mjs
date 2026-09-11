/**
 * Gera as capturas de tela do README.
 *
 * Para cada tela saem dois arquivos: a pagina inteira e um recorte "card" do
 * primeiro dobra, que e o que aparece no README. O card evita que uma pagina
 * longa vire uma tira estreita e ilegivel na listagem do GitHub.
 *
 *   node scripts/capturar-telas.mjs [base-url]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const BASE = process.argv[2] ?? 'https://hclean.nerdresolve.com';
const SAIDA = fileURLToPath(new URL('../../../docs/telas/', import.meta.url));

const TELAS = [
  { id: '01-home',      rota: '/',                          largura: 1440, altura: 900 },
  { id: '02-produtos',  rota: '/produtos',                  largura: 1440, altura: 900 },
  { id: '03-produto',   rota: '/produtos/linha-branca',     largura: 1440, altura: 900 },
  { id: '04-formato',   rota: '/produtos/formato/manta-absorvente', largura: 1440, altura: 900 },
  { id: '05-sobre',     rota: '/sobre',                     largura: 1440, altura: 900 },
  /* A home em 414px passa de 12.000px de altura; a 2x isso estoura o limite
     de textura do Chromium e a captura sai vazia. Escala 1 resolve e a
     imagem continua legivel no README. */
  { id: '06-mobile',    rota: '/',                          largura: 414,  altura: 896, escala: 1 },
];

await mkdir(SAIDA, { recursive: true });
const navegador = await chromium.launch();

for (const t of TELAS) {
  const pagina = await navegador.newPage({
    viewport: { width: t.largura, height: t.altura },
    deviceScaleFactor: t.escala ?? 2, // retina: o README encolhe a imagem, 2x mantem a nitidez
  });
  await pagina.goto(`${BASE}${t.rota}`, { waitUntil: 'networkidle' });
  // As fontes proprias entram depois do primeiro paint; sem esperar, a captura
  // sai com a fonte de fallback.
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(600);

  await pagina.screenshot({ path: join(SAIDA, `${t.id}.webp`), fullPage: true, quality: 82 });
  await pagina.screenshot({ path: join(SAIDA, `${t.id}-card.webp`), quality: 82 });
  console.log(`${t.id}  ${t.largura}x${t.altura}  ${t.rota}`);
  await pagina.close();
}

// O pop-up de orcamento e o coracao do projeto: merece tela propria.
const pagina = await navegador.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
await pagina.goto(BASE, { waitUntil: 'networkidle' });
await pagina.evaluate(() => document.fonts.ready);
await pagina.locator('header').getByRole('button', { name: /solicitar|orçamento/i }).first().click();
await pagina.waitForSelector('#q-produto', { state: 'visible' });
for (const slug of ['linha-branca', 'kit-sopep']) {
  await pagina.selectOption('#q-produto', slug);
  await pagina.waitForTimeout(350);
}
// Marca a primeira variante de cada cartao, para a captura mostrar os campos.
const cartoes = pagina.locator('[class*=cartItem]');
for (let i = 0; i < await cartoes.count(); i++) {
  const caixa = cartoes.nth(i).locator('input[type=checkbox]');
  if (await caixa.count()) { await caixa.nth(0).check(); await pagina.waitForTimeout(150); }
}
/* Marcar as variantes rola o corpo do modal ate o ultimo campo tocado. A
   captura precisa comecar do topo, senao o card mostra o meio do formulario
   sem deixar claro que sao dois produtos no mesmo pedido. */
await pagina.evaluate(() => {
  const corpo = document.querySelector('dialog [class*=body]');
  if (corpo) corpo.scrollTop = 0;
});
await pagina.waitForTimeout(400);
await pagina.screenshot({ path: join(SAIDA, '07-orcamento-card.webp'), quality: 82 });
await pagina.screenshot({ path: join(SAIDA, '07-orcamento.webp'), fullPage: true, quality: 82 });
console.log('07-orcamento  pop-up com dois produtos');

await navegador.close();
