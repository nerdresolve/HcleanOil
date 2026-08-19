/**
 * Rasteriza cada página de um PDF em PNG, para conferir o arquivo final.
 *
 * O preview em HTML não serve para julgar quebras de página: ele é um scroll
 * contínuo, e o recorte por altura não corresponde às quebras que o Chromium
 * aplica ao imprimir. Aqui lemos o PDF de verdade, com o pdf.js rodando dentro
 * do próprio Chromium do Playwright (que já traz o canvas do navegador).
 *
 *   node scripts/pdf-paginas.mjs arquivo.pdf [pasta-destino]
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const arquivo = resolve(process.argv[2]);
const destino = resolve(process.argv[3] ?? 'paginas');
mkdirSync(destino, { recursive: true });

/* Serve o pdf.js do node_modules como texto e injeta na página: evita
   depender de CDN e de módulo nativo de canvas. */
const pdfjsDir = dirname(require.resolve('pdfjs-dist/package.json'));
const pdfjsSrc = readFileSync(join(pdfjsDir, 'build/pdf.min.mjs'), 'utf8');
const workerSrc = readFileSync(join(pdfjsDir, 'build/pdf.worker.min.mjs'), 'utf8');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<body style="margin:0"><canvas id="c"></canvas></body>');

await page.evaluate(
  ([lib, worker]) => {
    const url = URL.createObjectURL(new Blob([lib], { type: 'text/javascript' }));
    return import(url).then((m) => {
      window.pdfjsLib = m;
      m.GlobalWorkerOptions.workerSrc = URL.createObjectURL(
        new Blob([worker], { type: 'text/javascript' }),
      );
    });
  },
  [pdfjsSrc, workerSrc],
);

const total = await page.evaluate(async (b64) => {
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  window.__doc = await window.pdfjsLib.getDocument({ data: bin }).promise;
  return window.__doc.numPages;
}, readFileSync(arquivo).toString('base64'));

for (let n = 1; n <= total; n++) {
  const b64 = await page.evaluate(async (num) => {
    const p = await window.__doc.getPage(num);
    const vp = p.getViewport({ scale: 1.4 });
    const c = document.getElementById('c');
    c.width = vp.width;
    c.height = vp.height;
    await p.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
    return c.toDataURL('image/png').split(',')[1];
  }, n);
  writeFileSync(join(destino, `pagina-${n}.png`), Buffer.from(b64, 'base64'));
}

await browser.close();
console.log(`${total} páginas em ${destino}`);
