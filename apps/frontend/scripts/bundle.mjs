/** Lista os arquivos JS e de fonte que a home carrega, do maior para o menor. */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3100';
const browser = await chromium.launch();
const page = await browser.newPage();

const assets = [];
page.on('response', async (res) => {
  const type = res.request().resourceType();
  if (type !== 'script' && type !== 'font') return;
  const size = (await res.body().catch(() => Buffer.alloc(0))).length;
  const url = res.url().replace(BASE, '');
  assets.push({ type, url: url.length > 62 ? '…' + url.slice(-60) : url, kB: Math.round(size / 1024) });
});

await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);

assets.sort((a, b) => b.kB - a.kB);
console.table(assets.filter((a) => a.kB > 0));
console.log('total JS   :', assets.filter((a) => a.type === 'script').reduce((n, a) => n + a.kB, 0), 'kB');
console.log('total fonte:', assets.filter((a) => a.type === 'font').reduce((n, a) => n + a.kB, 0), 'kB');

await browser.close();
