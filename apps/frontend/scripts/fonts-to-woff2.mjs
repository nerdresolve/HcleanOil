/**
 * Converte as fontes variáveis de TTF para WOFF2.
 *
 *   node scripts/fonts-to-woff2.mjs
 *
 * O WOFF2 usa compressão Brotli específica para fontes e corta cerca de 40%
 * do peso — num arquivo de 296 kB no caminho crítico, é a economia mais barata
 * que existe. Todo navegador que roda o site suporta o formato.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compress } from 'wawoff2';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = join(HERE, '..', 'src', 'fonts');

const FILES = ['Exo2-VariableFont_wght', 'Exo2-Italic-VariableFont_wght'];

for (const name of FILES) {
  const src = join(DIR, `${name}.ttf`);
  if (!existsSync(src)) {
    console.log(`ausente: ${name}.ttf`);
    continue;
  }
  const ttf = readFileSync(src);
  const woff2 = Buffer.from(await compress(ttf));
  writeFileSync(join(DIR, `${name}.woff2`), woff2);

  const pct = Math.round((1 - woff2.length / ttf.length) * 100);
  console.log(
    `${name}: ${Math.round(ttf.length / 1024)} kB -> ${Math.round(woff2.length / 1024)} kB (-${pct}%)`,
  );
}
