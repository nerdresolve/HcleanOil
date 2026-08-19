/**
 * Confere as imagens do catálogo.
 *
 *   node scripts/check-imagens.mjs
 *
 * Aponta três coisas que passam despercebidas:
 *   - referência para arquivo que não existe em public/
 *   - dois produtos diferentes apontando para o mesmo arquivo
 *   - arquivo em public/produtos que ninguém usa
 *
 * O caso que motivou o script: "barreira em tiras" e "barreira flocada"
 * apontavam para a mesma foto, apesar de a foto correta já estar no projeto.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PUB = join(HERE, '..', 'public');
const site = readFileSync(join(HERE, '..', 'src', 'data', 'site.ts'), 'utf8');

/* Cada `image:` precedido pelo `name:` ou `slug:` mais próximo. */
const refs = [];
const linhas = site.split('\n');
let ultimoNome = '(?)';
for (const l of linhas) {
  const nome = l.match(/^\s*(?:name|slug): '([^']+)'/);
  if (nome) ultimoNome = nome[1];
  const img = l.match(/^\s*image: '([^']+)'/);
  if (img) refs.push({ dono: ultimoNome, arquivo: img[1] });
}

const problemas = [];

/* 1. Arquivo inexistente. */
for (const r of refs) {
  if (!existsSync(join(PUB, r.arquivo.replace(/^\//, '')))) {
    problemas.push(`${r.dono}: arquivo não existe — ${r.arquivo}`);
  }
}

/* 2. Mesmo arquivo em produtos diferentes.
      Categoria e linha reaproveitam de propósito a foto do item principal —
      "Kits de Emergência" mostra o Kit SOPEP, "Linha Branca" mostra a manta.
      O que não pode é dois PRODUTOS distintos dividirem a mesma foto, que foi
      o caso de "barreira em tiras" e "barreira flocada". */
const CATEGORIAS = new Set([
  'Barreiras de Contenção',
  'Materiais Absorventes',
  'Kits de Emergência',
  'Tanque Terrestre',
]);
const ehLinha = (n) => n.startsWith('Linha ');
const ehVitrine = (n) => CATEGORIAS.has(n) || ehLinha(n);

const porArquivo = new Map();
for (const r of refs) {
  const lista = porArquivo.get(r.arquivo) ?? [];
  lista.push(r.dono);
  porArquivo.set(r.arquivo, lista);
}
for (const [arquivo, donos] of porArquivo) {
  const itens = donos.filter((d) => !ehVitrine(d));
  if (itens.length > 1) {
    problemas.push(
      `dois produtos com a mesma foto: ${arquivo}\n      ${itens.join(', ')}`,
    );
  }
}

/* 3. Arquivo órfão em public/produtos.
      Além do catálogo, as páginas referenciam imagens direto no JSX — a foto
      de operação aparece na home e em Quem somos, por exemplo. */
const usados = new Set(refs.map((r) => r.arquivo.replace(/^\/produtos\//, '')));

const varrer = (dir) => {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, item.name);
    if (item.isDirectory()) varrer(p);
    else if (/\.(tsx|ts)$/.test(item.name)) {
      for (const m of readFileSync(p, 'utf8').matchAll(/\/produtos\/([\w.-]+\.(?:webp|jpg|png))/g)) {
        usados.add(m[1]);
      }
    }
  }
};
varrer(join(HERE, '..', 'src'));

const orfaos = readdirSync(join(PUB, 'produtos')).filter((f) => !usados.has(f));

console.log(`${refs.length} referências de imagem no catálogo\n`);

if (orfaos.length) {
  console.log('Em public/produtos mas sem uso no catálogo:');
  for (const o of orfaos) console.log(`  · ${o}`);
  console.log('');
}

if (problemas.length) {
  console.log(`${problemas.length} problema(s):`);
  for (const p of problemas) console.log(`  ✗ ${p}`);
  process.exit(1);
}
console.log('Nenhuma imagem faltando ou repetida.');
