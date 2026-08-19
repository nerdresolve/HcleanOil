/**
 * Confere quais seções técnicas entram na proposta para cada tipo de pedido.
 *
 * O risco silencioso é a proposta sair com as 21 seções do catálogo, ou pior,
 * com nenhuma — o cliente recebe um PDF genérico sem perceber. Aqui a seleção
 * fica visível.
 *
 *   node scripts/testar-secoes.mjs
 */
import { montarOrcamento } from '../dist/proposta/orcamento.js';
import { montarHtmlProposta } from '../dist/proposta/template.js';

const CASOS = [
  {
    nome: 'SeaFence 20 m',
    produto: 'Barreira de Contenção SeaFence',
    itens: [{ label: 'Metragem desejada (m)', value: '20' }],
    espera: ['Seafence'],
  },
  {
    // O formulário manda a linha dentro do nome do produto, não em campo à parte.
    nome: 'Manta Linha Verde',
    produto: 'Linha Verde — líquidos agressivos',
    itens: [{ label: 'Manta absorvente', value: '400' }],
    espera: ['Linha Verde', 'Manta'],
    naoEspera: ['Linha Branca', 'Linha Cinza'],
  },
  {
    nome: 'Kit SOPEP 100 L',
    produto: 'Kit SOPEP 100 L',
    itens: [{ label: 'Quantidade', value: '2' }],
    espera: ['Kit SOPEP'],
    naoEspera: ['Primeiro Atendimento'],
  },
  {
    nome: 'Tanque terrestre (sob cotação)',
    produto: 'Tanque Terrestre Autoportante',
    itens: [{ label: 'Quantidade', value: '1' }],
    espera: ['Tanque Terrestre'],
  },
  {
    nome: 'Misto: barreira + cordão branco',
    produto: 'Barreira de Contenção AB-Fence',
    itens: [
      { label: 'Metragem desejada (m)', value: '50' },
      { label: 'Cordão Absorvente — Linha Branca', value: '20' },
    ],
    espera: ['Ab-Fence'],
  },
];

const cliente = {
  nome: 'Teste',
  empresa: 'Empresa Teste',
  email: 'teste@example.com',
};

let falhas = 0;

for (const caso of CASOS) {
  const orcamento = montarOrcamento(caso.itens, {
    produto: caso.produto,
    estado: 'RJ',
  });

  const html = montarHtmlProposta({
    numero: '00/2026',
    data: '20/08/2026',
    validade: '19/09/2026',
    cliente,
    prazoEntrega: '15 dias úteis',
    orcamento,
  });

  // Os <h3> são as seções de produto; os <h2>, os grupos.
  const h3 = [...html.matchAll(/<h3>([^<]+)<\/h3>/g)].map((m) => m[1]);
  const h2 = [...html.matchAll(/<h2>([^<]+)<\/h2>/g)].map((m) => m[1]);
  const figuras = (html.match(/Figura \d+:/g) ?? []).length;

  const erros = [];
  for (const termo of caso.espera ?? []) {
    if (!h3.some((t) => t.toLowerCase().includes(termo.toLowerCase()))) {
      erros.push(`faltou "${termo}"`);
    }
  }
  for (const termo of caso.naoEspera ?? []) {
    if (h3.some((t) => t.toLowerCase().includes(termo.toLowerCase()))) {
      erros.push(`não deveria trazer "${termo}"`);
    }
  }
  if (!h3.length) erros.push('nenhuma seção técnica');
  if (h3.length > 8) erros.push(`${h3.length} seções — catálogo inteiro?`);

  if (erros.length) falhas++;
  console.log(`${erros.length ? 'FALHOU' : 'ok    '}  ${caso.nome}`);
  console.log(`        grupos: ${h2.join(' | ') || '(nenhum)'}`);
  console.log(`        seções: ${h3.join(' | ') || '(nenhuma)'}  [${figuras} figuras]`);
  console.log(`        total: ${orcamento.total ? `R$ ${orcamento.total.toFixed(2)}` : '-'}` +
    `${orcamento.exigeCotacao ? ' (exige cotação)' : ''}`);
  for (const e of erros) console.log(`        -> ${e}`);
  console.log('');
}

console.log(falhas ? `${falhas} caso(s) com problema` : 'todos os casos ok');
process.exit(falhas ? 1 : 0);
