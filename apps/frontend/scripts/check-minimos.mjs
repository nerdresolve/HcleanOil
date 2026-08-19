/**
 * Confere no navegador os mínimos de pedido de cada formato.
 *
 *   node scripts/check-minimos.mjs [baseUrl]
 *
 * Os valores vêm de data/quote.ts, mas o que importa é o que chega ao campo:
 * este script abre o pop-up, marca cada variante e lê `min` e `step` do input.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3100';

/** produto -> variante -> [min, step] esperados. */
const ESPERADO = {
  'barreira-de-contencao-seafence': { 'Metragem desejada': [1, 1] },
  'linha-branca': {
    'Cordão absorvente': [10, 1],
    'Manta absorvente': [200, 200],
    'Barreira absorvente em tiras': [10, 1],
    'Barreira absorvente flocada': [10, 1],
    'Rolo absorvente': [1, 1],
    'Travesseiro absorvente': [10, 1],
  },
  'turfa-organica': { Quantidade: [10, 1] },
  'kit-sopep': { 'Kit SOPEP 200 L': [1, 1] },
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const rows = [];
const problems = [];

await page.goto(`${BASE}/produtos`, { waitUntil: 'networkidle' });

for (const [slug, variantes] of Object.entries(ESPERADO)) {
  await page.goto(`${BASE}/produtos/${slug}`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /solicitar cotação/i }).first().click();
  const dialog = page.locator('dialog[open]');
  await dialog.waitFor({ state: 'visible' });

  for (const [variante, [minEsperado, stepEsperado]] of Object.entries(variantes)) {
    const box = dialog.getByRole('checkbox', { name: variante, exact: true });
    if (await box.count()) await box.check();
    await page.waitForTimeout(150);

    const campo = dialog.locator(`input[type="number"][name*="${variante}"]`).first();
    if (!(await campo.count())) {
      problems.push(`${slug} / ${variante}: campo não encontrado`);
      continue;
    }

    const min = Number(await campo.getAttribute('min'));
    const step = Number(await campo.getAttribute('step'));
    const okMin = min === minEsperado;
    const okStep = step === stepEsperado;

    rows.push({
      produto: slug,
      variante,
      min,
      step,
      status: okMin && okStep ? 'ok' : 'DIVERGE',
    });
    if (!okMin || !okStep) {
      problems.push(
        `${slug} / ${variante}: min=${min} step=${step}, esperado min=${minEsperado} step=${stepEsperado}`,
      );
    }
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
}

await browser.close();

console.table(rows);
if (problems.length) {
  console.log('\nDivergências:');
  for (const p of problems) console.log(`  ✗ ${p}`);
  process.exit(1);
}
console.log('\nTodos os mínimos conferem.');
