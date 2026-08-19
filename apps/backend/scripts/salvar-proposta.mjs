/**
 * Gera a proposta em PDF no disco, sem enviar e-mail e sem gastar número do
 * contador — serve para conferir o arquivo como o cliente recebe.
 *
 *   node scripts/salvar-proposta.mjs [destino.pdf]
 */
import { writeFileSync } from 'node:fs';
import { gerarProposta, encerrarNavegador } from '../dist/proposta/gerar.js';

const destino = process.argv[2] ?? 'proposta-teste.pdf';

const { numero, pdf, orcamento } = await gerarProposta({
  nome: 'Ana Souza',
  empresa: 'Empresa Exemplo',
  email: 'cliente@exemplo.com.br',
  telefone: '(11) 90000-0000',
  estado: 'RJ',
  produto: 'Barreira de Contenção SeaFence',
  mensagem: 'Operação em píer de transferência, corrente baixa.',
  itens: [{ label: 'Metragem desejada (m)', value: '20' }],
});

writeFileSync(destino, pdf);
await encerrarNavegador();

console.log(
  `proposta ${numero} — ${(pdf.length / 1024).toFixed(0)} kB — ` +
    `total R$ ${orcamento.total.toFixed(2)} — ${destino}`,
);
