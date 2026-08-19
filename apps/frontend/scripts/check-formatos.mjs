/**
 * Confere o índice derivado de formatos: quantas variantes cada um reúne e se
 * algum formato do catálogo ficou de fora por falta de metadados.
 *
 *   node scripts/check-formatos.mjs
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const site = readFileSync(join(HERE, '..', 'src', 'data', 'site.ts'), 'utf8');
const fmt = readFileSync(join(HERE, '..', 'src', 'data', 'formatos.ts'), 'utf8');

/* Nomes de formato presentes no catálogo, por linha.
   Só o que está dentro de `formats:` — o `name:` do topo é o nome da própria
   linha ("Linha Branca — Absorventes para…"), não um formato. */
const linhas = {};
for (const slug of ['linha-branca', 'linha-cinza', 'linha-verde']) {
  const i = site.indexOf(`slug: '${slug}'`);
  const fim = site.indexOf("    slug: '", i + 20);
  const bloco = site.slice(i, fim === -1 ? site.length : fim);
  const fi = bloco.indexOf('formats: [');
  const formatos = fi === -1 ? '' : bloco.slice(fi);
  linhas[slug] = [...formatos.matchAll(/name: '([^']+)'/g)].map((m) => m[1]);
}

/* Formatos que ganharam metadados (viram página). */
const comMeta = [...fmt.matchAll(/'([^']+)': \{\s*\n\s*slug: '([\w-]+)'/g)].map((m) => ({
  nome: m[1],
  slug: m[2],
}));

console.log('Formatos por linha:');
for (const [slug, nomes] of Object.entries(linhas)) {
  console.log(`  ${slug.padEnd(14)} ${nomes.length}: ${nomes.join(', ')}`);
}

console.log('\nPáginas de formato que serão geradas:');
const todos = new Set(Object.values(linhas).flat());
for (const { nome, slug } of comMeta) {
  const n = Object.values(linhas).filter((l) => l.includes(nome)).length;
  console.log(`  /produtos/formato/${slug.padEnd(30)} ${n} linha(s)`);
}

const semMeta = [...todos].filter((n) => !comMeta.some((m) => m.nome === n));
if (semMeta.length) {
  console.log('\nNo catálogo mas SEM página (falta metadado):');
  for (const n of semMeta) console.log(`  ✗ ${n}`);
  process.exit(1);
}
console.log('\nTodo formato do catálogo tem página.');
