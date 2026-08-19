/**
 * Auditoria do pop-up de orçamento.
 *
 *   node scripts/audit-modal.mjs [baseUrl]
 *
 * O audit.mjs percorre as páginas, mas o formulário só existe depois de um
 * clique — então nada dele era verificado. Aqui checa teclado, foco, rótulos,
 * validação e o comportamento em tela pequena.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3000';
const problems = [];
const ok = [];
const check = (cond, label, detail = '') =>
  cond ? ok.push(label) : problems.push(`${label}${detail ? ` — ${detail}` : ''}`);

const browser = await chromium.launch();

/* --------------------------------------------------- desktop: acessibilidade */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 140));
  });

  await page.goto(`${BASE}/produtos/kit-sopep`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /solicitar cotação/i }).first().click();

  const dialog = page.locator('dialog[open]');
  await dialog.waitFor({ state: 'visible', timeout: 5000 });

  // 1. O foco entra no diálogo em vez de ficar na página atrás.
  const focusInside = await page.evaluate(() => {
    const d = document.querySelector('dialog[open]');
    return Boolean(d && d.contains(document.activeElement));
  });
  check(focusInside, 'foco entra no pop-up ao abrir');

  // 2. Todo campo tem rótulo associado.
  const unlabeled = await dialog.evaluate((d) =>
    [...d.querySelectorAll('input:not([type=hidden]), select, textarea')]
      .filter((el) => {
        if (el.closest('[aria-hidden="true"]')) return false; // honeypot
        if (el.getAttribute('aria-label')) return false;
        if (el.id && d.querySelector(`label[for="${el.id}"]`)) return false;
        if (el.closest('label')) return false;
        return true;
      })
      .map((el) => el.name || el.type),
  );
  check(unlabeled.length === 0, 'todo campo tem rótulo', unlabeled.join(', '));

  // 3. Tab não escapa para a página atrás (foco preso pelo <dialog>).
  for (let i = 0; i < 30; i++) await page.keyboard.press('Tab');
  const stillInside = await page.evaluate(() => {
    const d = document.querySelector('dialog[open]');
    return Boolean(d && d.contains(document.activeElement));
  });
  check(stillInside, 'Tab não escapa do pop-up');

  // 4. Esc fecha.
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  check(
    (await page.locator('dialog[open]').count()) === 0,
    'Esc fecha o pop-up',
  );

  // 5. Ao fechar, o foco volta para o botão que abriu.
  const focusBack = await page.evaluate(
    () => document.activeElement?.textContent?.trim().slice(0, 30) ?? '',
  );
  check(
    /cotação|orçamento|especialista/i.test(focusBack),
    'foco volta ao botão que abriu',
    `foco em: "${focusBack}"`,
  );

  // 6. Validação impede envio vazio.
  await page.getByRole('button', { name: /solicitar cotação/i }).first().click();
  await page.locator('dialog[open]').waitFor({ state: 'visible' });
  await page.getByRole('button', { name: /enviar mensagem/i }).click();
  await page.waitForTimeout(600);
  check(
    (await page.locator('dialog[open]').count()) === 1,
    'envio vazio não fecha o pop-up',
  );
  const enviado = await page.getByText('Solicitação enviada').count();
  check(enviado === 0, 'envio vazio não é aceito');

  // 7. O scroll da página fica travado enquanto o pop-up está aberto.
  const locked = await page.evaluate(
    () => getComputedStyle(document.body).overflow === 'hidden',
  );
  check(locked, 'scroll da página travado com o pop-up aberto');

  check(consoleErrors.length === 0, 'sem erros de console', consoleErrors.join(' | '));

  await ctx.close();
}

/* --------------------------------------------------------- mobile: caber */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/produtos/linha-branca`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /solicitar cotação/i }).first().click();
  const dialog = page.locator('dialog[open]');
  await dialog.waitFor({ state: 'visible' });

  const box = await dialog.boundingBox();
  check(box.width <= 390, 'pop-up cabe na largura do celular', `${Math.round(box.width)}px`);
  check(box.height <= 844, 'pop-up cabe na altura do celular', `${Math.round(box.height)}px`);

  // Marca todos os formatos: o corpo precisa rolar, não estourar.
  const boxes = dialog.locator('input[type="checkbox"]');
  const n = await boxes.count();
  for (let i = 0; i < n; i++) await boxes.nth(i).check();
  await page.waitForTimeout(300);

  const after = await dialog.boundingBox();
  check(after.height <= 844, 'pop-up cheio ainda cabe na tela', `${Math.round(after.height)}px`);

  const scrolls = await dialog.evaluate((d) => {
    const body = d.querySelector('form > div:nth-child(2)');
    return body ? body.scrollHeight > body.clientHeight : false;
  });
  check(scrolls, 'corpo do pop-up rola quando o conteúdo cresce');

  /* Alvos de toque. Numa caixa de seleção, quem recebe o dedo é o <label> que
     a envolve, não o quadradinho — então a medida que importa é a do rótulo. */
  const small = await dialog.evaluate((d) =>
    [...d.querySelectorAll('button, input[type=checkbox], select')]
      .map((el) => {
        const target = el.closest('label') ?? el;
        const r = target.getBoundingClientRect();
        return {
          t: el.tagName.toLowerCase(),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      })
      .filter((x) => x.h > 0 && x.h < 40)
      .map((x) => `${x.t} ${x.w}x${x.h}`),
  );
  check(small.length === 0, 'alvos de toque adequados no pop-up', small.join(', '));

  await ctx.close();
}

await browser.close();

console.log(`\n${ok.length} verificação(ões) OK`);
for (const o of ok) console.log(`  ✓ ${o}`);

if (problems.length) {
  console.log(`\n${problems.length} problema(s):`);
  for (const p of problems) console.log(`  ✗ ${p}`);
  process.exit(1);
}
console.log('\nNenhum problema no pop-up.');
