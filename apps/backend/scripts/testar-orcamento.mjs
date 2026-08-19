/**
 * Casos de teste do cálculo de orçamento.
 *
 *   npm run build && node scripts/testar-orcamento.mjs
 *
 * Cobre as decisões que resolveram as ambiguidades da tabela: manta a R$ 2,40
 * a unidade, barreira absorvente a R$ 63,00 a unidade, rolo inteiro a R$ 540,
 * linha verde 20% acima, e a regra de frete.
 */
import { montarOrcamento, moeda } from '../dist/proposta/orcamento.js';

const casos = [
  {
    nome: '20 m de barreira SeaFence (o caso do cliente)',
    itens: [{ label: 'Metragem desejada (m)', value: '20' }],
    produto: 'Barreira de Contenção SeaFence',
    estado: 'RJ',
    esperado: { total: 3800, cif: true },
  },
  {
    nome: 'Manta linha branca, 1 pacote (200 un)',
    itens: [{ label: 'Manta absorvente — Quantidade', value: '200' }],
    produto: 'Linha Branca',
    estado: 'SP',
    esperado: { total: 480, cif: false }, // 200 x 2,40 = 480, abaixo do minimo
  },
  {
    nome: 'Manta linha verde, 200 un (+20%)',
    itens: [{ label: 'Manta absorvente — Quantidade', value: '200' }],
    produto: 'Linha Verde',
    estado: 'SP',
    esperado: { total: 576, cif: false }, // 2,40 x 1,2 = 2,88
  },
  {
    nome: 'Barreira absorvente em tiras, 10 un',
    itens: [{ label: 'Barreira absorvente em tiras — Quantidade', value: '10' }],
    produto: 'Linha Branca',
    estado: 'MG',
    esperado: { total: 630, cif: false }, // 10 x 63
  },
  {
    nome: 'Rolo, 2 un (rolo inteiro)',
    itens: [{ label: 'Rolo absorvente — Quantidade', value: '2' }],
    produto: 'Linha Cinza',
    estado: 'SP',
    esperado: { total: 1080, cif: true }, // 2 x 540, Sudeste e acima do minimo
  },
  {
    nome: 'Kit SOPEP 100 L e 200 L juntos',
    itens: [
      { label: 'Kit SOPEP 100 L — Quantidade', value: '2' },
      { label: 'Kit SOPEP 200 L — Quantidade', value: '1' },
    ],
    produto: 'Kit SOPEP',
    estado: 'BA',
    esperado: { total: 2450, cif: false }, // 1500 + 950, fora do Sudeste
  },
  {
    nome: 'Tanque terrestre — exige cotação',
    itens: [
      { label: 'Dimensões e quantidade — Comprimento (m)', value: '2.10' },
      { label: 'Dimensões e quantidade — Largura (m)', value: '1.60' },
      { label: 'Dimensões e quantidade — Altura (m)', value: '0.45' },
      { label: 'Dimensões e quantidade — Quantidade', value: '1' },
    ],
    produto: 'Tanque Terrestre',
    estado: 'SP',
    esperado: { total: 0, cif: false, cotacao: true },
  },
  {
    nome: 'Turfa, 10 un (1 kg = 1 un)',
    itens: [{ label: 'Quantidade', value: '10' }],
    produto: 'Turfa Orgânica',
    estado: 'RJ',
    esperado: { total: 100, cif: false },
  },
];

let falhas = 0;

for (const caso of casos) {
  const orc = montarOrcamento(caso.itens, {
    produto: caso.produto,
    estado: caso.estado,
  });

  const okTotal = Math.abs(orc.total - caso.esperado.total) < 0.01;
  const okFrete = orc.frete.cif === caso.esperado.cif;
  const okCotacao =
    caso.esperado.cotacao === undefined || orc.exigeCotacao === caso.esperado.cotacao;
  const ok = okTotal && okFrete && okCotacao;
  if (!ok) falhas++;

  console.log(`${ok ? '  ok  ' : ' FALHA'} ${caso.nome}`);
  for (const l of orc.linhas) {
    const valor =
      l.total !== undefined
        ? `${l.quantidade} ${l.unidade} × ${moeda(l.precoUnitario)} = ${moeda(l.total)}`
        : `${l.quantidade} ${l.unidade} — ${l.observacao}`;
    console.log(`         ${l.descricao}: ${valor}`);
  }
  console.log(
    `         total ${moeda(orc.total)} · ${orc.frete.rotulo}` +
      (orc.exigeCotacao ? ' · EXIGE COTAÇÃO' : ''),
  );
  if (!ok) {
    console.log(
      `         esperado: total ${moeda(caso.esperado.total)}, cif=${caso.esperado.cif}`,
    );
  }
  console.log('');
}

console.log(falhas ? `${falhas} caso(s) falharam.` : 'Todos os casos passaram.');
process.exit(falhas ? 1 : 0);
