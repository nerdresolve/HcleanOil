/**
 * Gera uma proposta de teste em PDF e salva em disco, sem enviar e-mail.
 *
 *   npm run build && node scripts/testar-pdf.mjs
 *
 * Serve para conferir o layout antes de disparar para alguém.
 */
import { writeFile } from 'node:fs/promises';
import { gerarProposta, encerrarNavegador } from '../dist/proposta/gerar.js';
import { moeda } from '../dist/proposta/precos.js';

const pedido = {
  nome: 'Ana Souza',
  empresa: 'Empresa Exemplo',
  email: 'cliente@exemplo.com.br',
  telefone: '(11) 90000-0000',
  estado: 'RJ',
  produto: 'Barreira de Contenção SeaFence',
  mensagem: 'Operação em píer de transferência, corrente baixa.',
  itens: [{ label: 'Metragem desejada (m)', value: '20' }],
};

const t0 = Date.now();
const p = await gerarProposta(pedido);
const ms = Date.now() - t0;

await writeFile(p.arquivo, p.pdf);

console.log(`proposta : ${p.numero}`);
console.log(`arquivo  : ${p.arquivo}`);
console.log(`tamanho  : ${Math.round(p.pdf.length / 1024)} kB`);
console.log(`tempo    : ${ms} ms`);
console.log('');
for (const l of p.orcamento.linhas) {
  console.log(
    `  ${l.descricao}: ${l.quantidade} ${l.unidade} × ${
      l.precoUnitario !== undefined ? moeda(l.precoUnitario) : 'sob cotação'
    } = ${l.total !== undefined ? moeda(l.total) : '—'}`,
  );
}
console.log(`  total: ${moeda(p.orcamento.total)} · ${p.orcamento.frete.rotulo}`);

await encerrarNavegador();
