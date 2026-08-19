/**
 * Mede o peso e os sinais de performance de cada rota, contra o build de
 * produção (`next build && next start`).
 *
 *   node scripts/audit-perf.mjs [baseUrl]
 *
 * Não substitui o Lighthouse, mas pega o que costuma regredir sem ninguém
 * notar: JS demais no cliente, imagem grande no caminho crítico, LCP alto e
 * layout que pula (CLS).
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3000';

const ROUTES = ['/', '/produtos', '/produtos/linha-branca', '/sobre'];

/* Orçamentos.
   O JS inclui o runtime de React e Next (~390 kB), que é piso do framework e
   não dá para reduzir sem trocar de stack. O limite cobre esse piso mais uma
   folga para o código do site — se estourar, foi dependência nova entrando no
   bundle do cliente, que é o que interessa vigiar. */
const BUDGET = { js: 560 * 1024, css: 60 * 1024, img: 900 * 1024, lcp: 2500, cls: 0.1 };

const browser = await chromium.launch();
const rows = [];
const overBudget = [];

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await ctx.newPage();

  const bytes = { js: 0, css: 0, img: 0, font: 0, other: 0 };
  page.on('response', async (res) => {
    try {
      const type = res.request().resourceType();
      const len = Number(res.headers()['content-length'] ?? 0);
      const size = len || (await res.body().catch(() => Buffer.alloc(0))).length;
      const key =
        type === 'script' ? 'js'
        : type === 'stylesheet' ? 'css'
        : type === 'image' ? 'img'
        : type === 'font' ? 'font'
        : 'other';
      bytes[key] += size;
    } catch {}
  });

  await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });

  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const out = { lcp: 0, cls: 0 };
        new PerformanceObserver((l) => {
          const e = l.getEntries();
          out.lcp = e[e.length - 1]?.startTime ?? 0;
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        new PerformanceObserver((l) => {
          for (const entry of l.getEntries()) {
            if (!entry.hadRecentInput) out.cls += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => resolve(out), 1200);
      }),
  );

  const kb = (n) => Math.round(n / 1024);
  rows.push({
    rota: route,
    'JS (kB)': kb(bytes.js),
    'CSS (kB)': kb(bytes.css),
    'IMG (kB)': kb(bytes.img),
    'Fonte (kB)': kb(bytes.font),
    'LCP (ms)': Math.round(vitals.lcp),
    CLS: vitals.cls.toFixed(3),
  });

  if (bytes.js > BUDGET.js) overBudget.push(`${route}: JS ${kb(bytes.js)}kB > ${kb(BUDGET.js)}kB`);
  if (bytes.css > BUDGET.css) overBudget.push(`${route}: CSS ${kb(bytes.css)}kB > ${kb(BUDGET.css)}kB`);
  if (bytes.img > BUDGET.img) overBudget.push(`${route}: imagens ${kb(bytes.img)}kB > ${kb(BUDGET.img)}kB`);
  if (vitals.lcp > BUDGET.lcp) overBudget.push(`${route}: LCP ${Math.round(vitals.lcp)}ms > ${BUDGET.lcp}ms`);
  if (vitals.cls > BUDGET.cls) overBudget.push(`${route}: CLS ${vitals.cls.toFixed(3)} > ${BUDGET.cls}`);

  await ctx.close();
}

await browser.close();

console.table(rows);

if (overBudget.length) {
  console.log('\nFora do orçamento:');
  for (const o of overBudget) console.log(`  ✗ ${o}`);
  process.exit(1);
}
console.log('\nTudo dentro do orçamento.');
