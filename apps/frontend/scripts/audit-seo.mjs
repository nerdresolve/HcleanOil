/**
 * Confere os metadados de SEO de cada rota, contra o build de produção.
 *
 *   node scripts/audit-seo.mjs [baseUrl]
 *
 * Verifica título e descrição (presença e tamanho útil no resultado de busca),
 * canonical, Open Graph, dados estruturados válidos, e se o conteúdo está no
 * HTML entregue — não só depois do JS rodar, que é o que o robô mais simples
 * consegue ler.
 */
const BASE = process.argv[2] || 'http://localhost:3100';

const ROUTES = [
  '/',
  '/produtos',
  '/produtos/barreira-de-contencao-seafence',
  '/produtos/linha-branca',
  '/produtos/kit-sopep',
  '/produtos/formato/cordao-absorvente',
  '/produtos/formato/barreira-absorvente-flocada',
  '/sobre',
];

const problems = [];
const rows = [];

const pick = (html, re) => (html.match(re) || [])[1] ?? '';

for (const route of ROUTES) {
  const res = await fetch(BASE + route);
  const html = await res.text();

  const title = pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const desc = pick(html, /<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
  const canonical = pick(html, /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i);
  const ogTitle = pick(html, /<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i);
  const ogDesc = pick(html, /<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i);
  const ogImage = pick(html, /<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i);
  const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]*>/g, '').trim();

  const add = (msg) => problems.push(`${route}: ${msg}`);

  if (!title) add('sem <title>');
  else if (title.length > 60) add(`título com ${title.length} caracteres (o Google corta perto de 60)`);

  if (!desc) add('sem meta description');
  else if (desc.length > 160) add(`descrição com ${desc.length} caracteres (o Google corta perto de 160)`);
  else if (desc.length < 70) add(`descrição curta demais (${desc.length} caracteres)`);

  if (!canonical) add('sem canonical');
  if (!ogTitle || !ogDesc) add('Open Graph incompleto');
  if (!ogImage) add('sem og:image — link compartilhado aparece sem miniatura');
  if (!h1) add('sem <h1> no HTML entregue');

  // Dados estruturados: precisam ser JSON válido e ter @type.
  const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  const types = [];
  for (const b of blocks) {
    try {
      const data = JSON.parse(b[1]);
      types.push(data['@type'] ?? '?');
    } catch {
      add('JSON-LD inválido');
    }
  }

  // O texto principal precisa estar no HTML, não só depois da hidratação.
  const textLength = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length;
  if (textLength < 600) add(`pouco texto no HTML entregue (${textLength} caracteres)`);

  rows.push({
    rota: route,
    título: title.length,
    desc: desc.length,
    canonical: canonical ? 'ok' : '—',
    og: ogImage ? 'ok' : 'sem imagem',
    'JSON-LD': types.join(', ') || '—',
    texto: textLength,
  });
}

/* robots.txt e sitemap.xml */
for (const path of ['/robots.txt', '/sitemap.xml']) {
  const res = await fetch(BASE + path);
  if (!res.ok) problems.push(`${path}: HTTP ${res.status}`);
  else {
    const body = await res.text();
    if (path === '/sitemap.xml') {
      const n = (body.match(/<loc>/g) || []).length;
      console.log(`sitemap.xml: ${n} URLs`);
      if (n < 5) problems.push('sitemap com poucas URLs');
      if (/\/contato/.test(body)) problems.push('sitemap ainda lista /contato, que foi removida');
    } else if (!/Sitemap:/i.test(body)) {
      problems.push('robots.txt não aponta o sitemap');
    }
  }
}

console.table(rows);

if (problems.length) {
  console.log(`\n${problems.length} problema(s):`);
  for (const p of problems) console.log(`  ✗ ${p}`);
  process.exit(1);
}
console.log('\nSEO sem pendências.');
