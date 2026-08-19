/**
 * Auditoria visual e estrutural de todas as páginas.
 *
 *   node scripts/audit.mjs [baseUrl]
 *
 * Verifica, em desktop e mobile:
 *   - erros de console e requisições que falharam (imagem quebrada, 404)
 *   - scroll horizontal e elementos que vazam da viewport
 *   - imagens sem alt, imagens esticadas ou exibidas muito acima da resolução
 *   - hierarquia de títulos (h1 único, sem pulo de nível)
 *   - contraste insuficiente em texto sobre fundo sólido
 *   - alvos de toque pequenos demais no mobile
 *
 * Salva um screenshot inteiro de cada página em scripts/screenshots/.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.argv[2] || 'http://localhost:3000';
const HERE = dirname(fileURLToPath(import.meta.url));
const SHOTS = join(HERE, 'screenshots');
mkdirSync(SHOTS, { recursive: true });

const ROUTES = [
  '/',
  '/produtos',
  '/produtos/barreira-de-contencao-seafence',
  '/produtos/barreira-de-contencao-abfence',
  '/produtos/linha-branca',
  '/produtos/linha-cinza',
  '/produtos/linha-verde',
  '/produtos/turfa-organica',
  '/produtos/kit-sopep',
  '/produtos/kit-primeiro-atendimento',
  '/produtos/tanque-terrestre',
  '/produtos/formato/cordao-absorvente',
  '/produtos/formato/barreira-absorvente-flocada',
  '/sobre',
  '/rota-que-nao-existe',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

/** Luminância relativa, para o cálculo de contraste WCAG. */
function luminance([r, g, b]) {
  const f = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const parseRgb = (s) => {
  const m = String(s).match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(',').map((n) => parseFloat(n));
  if (p.length > 3 && p[3] < 0.9) return null; // semitransparente: não avaliar
  return [p[0], p[1], p[2]];
};

const problems = [];
const add = (route, viewport, kind, detail) =>
  problems.push({ route, viewport, kind, detail });

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });

  for (const route of ROUTES) {
    const page = await context.newPage();
    const consoleErrors = [];
    const failed = [];

    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160));
    });
    page.on('requestfailed', (r) =>
      failed.push(`${r.url().replace(BASE, '')} (${r.failure()?.errorText})`),
    );
    page.on('response', (r) => {
      if (r.status() >= 400 && !route.includes('nao-existe')) {
        failed.push(`${r.url().replace(BASE, '')} -> HTTP ${r.status()}`);
      }
    });

    const res = await page.goto(BASE + route, {
      waitUntil: 'networkidle',
      timeout: 45000,
    });

    const expected404 = route.includes('nao-existe');
    if (!expected404 && res && res.status() !== 200) {
      add(route, vp.name, 'http', `status ${res.status()}`);
    }

    await page.waitForTimeout(400);

    for (const e of consoleErrors) add(route, vp.name, 'console', e);
    for (const f of [...new Set(failed)]) add(route, vp.name, 'requisição', f);

    const report = await page.evaluate((vpWidth) => {
      const out = {
        overflowX: false,
        docWidth: 0,
        wide: [],
        images: [],
        headings: [],
        contrast: [],
        smallTargets: [],
      };

      out.docWidth = document.documentElement.scrollWidth;
      out.overflowX = document.documentElement.scrollWidth > window.innerWidth + 1;

      /* Elementos que ultrapassam a largura da viewport.
         Só interessa o que realmente causa scroll: peças decorativas que
         sangram pela borda ficam dentro de um pai com overflow:hidden e são
         recortadas, então não contam. */
      const isClipped = (el) => {
        let n = el.parentElement;
        while (n && n !== document.documentElement) {
          const o = getComputedStyle(n);
          if (o.overflow !== 'visible' || o.overflowX !== 'visible') return true;
          n = n.parentElement;
        }
        return false;
      };

      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right <= window.innerWidth + 2 && r.left >= -2) continue;

        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' || cs.overflow === 'hidden') continue;
        if (el.closest('[aria-hidden="true"]')) continue; // ornamento
        if (isClipped(el)) continue;
        // Totalmente fora da tela de propósito: skip-link e honeypot.
        if (r.right < 0 || r.left > window.innerWidth) continue;

        out.wide.push(
          `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} ` +
            `left=${Math.round(r.left)} right=${Math.round(r.right)}`,
        );
      }

      // Imagens: alt, proporção e resolução.
      for (const img of document.querySelectorAll('img')) {
        const r = img.getBoundingClientRect();
        if (r.width < 4) continue;
        const src = (img.currentSrc || img.src).split('/').pop().slice(0, 60);
        if (!img.alt && img.getAttribute('aria-hidden') !== 'true') {
          out.images.push(`sem alt: ${src}`);
        }
        if (img.naturalWidth && img.naturalHeight) {
          const natRatio = img.naturalWidth / img.naturalHeight;
          const boxRatio = r.width / r.height;
          const fit = getComputedStyle(img).objectFit;
          /* `cover` e `contain` preservam a proporção (recortam ou encaixam).
             `fill` e `none` só deformam quando a caixa tem proporção diferente
             da do arquivo — com as duas iguais, a imagem sai correta. */
          const preserves = fit === 'cover' || fit === 'contain' || fit === 'scale-down';
          if (!preserves && Math.abs(natRatio - boxRatio) > 0.05) {
            out.images.push(
              `distorcida: ${src} (arquivo ${natRatio.toFixed(2)}, caixa ${boxRatio.toFixed(2)})`,
            );
          }
          // Servida com resolução muito acima do necessário.
          if (img.naturalWidth > r.width * 3 && r.width > 40) {
            out.images.push(
              `superdimensionada: ${src} (${img.naturalWidth}px para ${Math.round(r.width)}px)`,
            );
          }
        }
        if (img.complete && img.naturalWidth === 0) {
          out.images.push(`nao carregou: ${src}`);
        }
      }

      // Hierarquia de títulos.
      const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
      const h1s = hs.filter((h) => h.tagName === 'H1');
      if (h1s.length === 0) out.headings.push('nenhum h1');
      if (h1s.length > 1) out.headings.push(`${h1s.length} h1 na mesma página`);
      let prev = 0;
      for (const h of hs) {
        const lvl = +h.tagName[1];
        if (prev && lvl > prev + 1) {
          out.headings.push(
            `pulo h${prev} -> h${lvl}: "${h.textContent.trim().slice(0, 40)}"`,
          );
        }
        prev = lvl;
      }

      // Contraste de texto sobre fundo sólido.
      const bgOf = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const c = getComputedStyle(n).backgroundColor;
          const m = c.match(/rgba?\(([^)]+)\)/);
          if (m) {
            const p = m[1].split(',').map(parseFloat);
            if (p.length < 4 || p[3] > 0.9) return c;
          }
          n = n.parentElement;
        }
        return 'rgb(255,255,255)';
      };
      const seen = new Set();
      for (const el of document.querySelectorAll(
        'p, a, span, li, h1, h2, h3, h4, button, label, dt, dd',
      )) {
        const txt = el.textContent?.trim();
        if (!txt || txt.length < 4) continue;
        if (el.children.length > 0) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
        const key = cs.color + '|' + bgOf(el) + '|' + cs.fontSize;
        if (seen.has(key)) continue;
        seen.add(key);
        out.contrast.push({
          color: cs.color,
          bg: bgOf(el),
          size: parseFloat(cs.fontSize),
          weight: cs.fontWeight,
          sample: txt.slice(0, 46),
        });
      }

      // Alvos de toque no mobile.
      if (vpWidth < 700) {
        for (const el of document.querySelectorAll('a, button, [role="button"], summary')) {
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) continue;
          if (r.height < 32 && r.width < 180) {
            out.smallTargets.push(
              `${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 26)}" ` +
                `${Math.round(r.width)}x${Math.round(r.height)}`,
            );
          }
        }
      }

      return out;
    }, vp.width);

    if (report.overflowX) {
      add(
        route,
        vp.name,
        'overflow',
        `documento com ${report.docWidth}px em viewport de ${vp.width}px`,
      );
    }
    for (const w of [...new Set(report.wide)].slice(0, 5)) {
      add(route, vp.name, 'vazamento', w);
    }
    for (const i of [...new Set(report.images)]) add(route, vp.name, 'imagem', i);
    for (const h of [...new Set(report.headings)]) add(route, vp.name, 'títulos', h);
    for (const t of [...new Set(report.smallTargets)].slice(0, 6)) {
      add(route, vp.name, 'alvo pequeno', t);
    }

    for (const c of report.contrast) {
      const fg = parseRgb(c.color);
      const bg = parseRgb(c.bg);
      if (!fg || !bg) continue;
      const ratio = contrast(fg, bg);
      const large = c.size >= 24 || (c.size >= 18.66 && +c.weight >= 700);
      const min = large ? 3 : 4.5;
      if (ratio < min) {
        add(
          route,
          vp.name,
          'contraste',
          `${ratio.toFixed(2)}:1 (mín ${min}) ${c.size}px "${c.sample}"`,
        );
      }
    }

    const shotName = (route === '/' ? 'home' : route.replace(/\//g, '_')).replace(
      /^_/,
      '',
    );
    await page.screenshot({
      path: join(SHOTS, `${shotName}-${vp.name}.png`),
      fullPage: true,
    });

    await page.close();
  }

  await context.close();
}

await browser.close();

/* -------------------------------------------------------------- relatório */

if (!problems.length) {
  console.log('Nenhum problema encontrado.');
  process.exit(0);
}

const byKind = {};
for (const p of problems) (byKind[p.kind] ||= []).push(p);

console.log(`\n${problems.length} ocorrência(s):\n`);
for (const [kind, list] of Object.entries(byKind).sort(
  (a, b) => b[1].length - a[1].length,
)) {
  console.log(`\n### ${kind.toUpperCase()} (${list.length})`);
  for (const p of list.slice(0, 24)) {
    console.log(`  [${p.viewport}] ${p.route}`);
    console.log(`      ${p.detail}`);
  }
  if (list.length > 24) console.log(`  ... e mais ${list.length - 24}`);
}
console.log(`\nScreenshots em ${SHOTS}`);
