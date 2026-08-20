/**
 * Transforma o que o formulário enviou num orçamento com valores.
 *
 * O formulário manda campos de nome dinâmico, montados a partir do produto e
 * da variante escolhidos — "Kit SOPEP 200 L — Quantidade", "Metragem desejada
 * (m)", "Manta absorvente — Quantidade". Aqui esses nomes são reconhecidos,
 * casados com a tabela de preços e somados.
 *
 * O que não casar não é descartado nem chutado: entra como item **sob
 * cotação**, para a equipe precificar à mão. Errar um preço numa proposta
 * comercial custa mais caro do que deixar uma linha em aberto.
 */
import {
  PRECOS,
  acharPreco,
  precoDaLinha,
  definirFrete,
  moeda,
  unidadePlural,
  type ItemPreco,
} from './precos.js';
import type { QuoteItem } from '../lib/schema.js';

export type LinhaOrcamento = {
  descricao: string;
  quantidade: number;
  /** Já concordada com a quantidade: "1 metro", "20 metros". */
  unidade: string;
  /** Id do catálogo de preços; a proposta usa para escolher as seções. */
  precoId?: string;
  /** "Linha Branca" | "Linha Verde" | "Linha Cinza", nos absorventes. */
  linhaProduto?: string;
  /** Ausente quando o item exige cotação. */
  precoUnitario?: number;
  total?: number;
  /** Motivo de não ter preço, exibido na proposta. */
  observacao?: string;
};

export type Orcamento = {
  linhas: LinhaOrcamento[];
  total: number;
  /** Algum item ficou sem preço e a proposta não pode sair automática. */
  exigeCotacao: boolean;
  frete: { cif: boolean; sudeste: boolean; rotulo: string };
  estado: string;
};

/* Como reconhecer cada produto no rótulo que o formulário envia.
   A ordem importa: o primeiro que casar vence, então os mais específicos vêm
   antes ("barreira absorvente" antes de "barreira"). */
const RECONHECIMENTO: { id: string; padrao: RegExp }[] = [
  { id: 'sopep-50', padrao: /sopep\s*50/i },
  { id: 'sopep-100', padrao: /sopep\s*100/i },
  { id: 'sopep-200', padrao: /sopep\s*200/i },
  { id: 'kit-primeiro-atendimento', padrao: /primeiro\s*atendimento/i },
  { id: 'barreira-tiras', padrao: /barreira.*tiras/i },
  { id: 'barreira-flocada', padrao: /barreira.*flocada/i },
  { id: 'cordao', padrao: /cord(ã|a)o/i },
  { id: 'manta', padrao: /manta/i },
  { id: 'rolo', padrao: /rolo/i },
  { id: 'travesseiro', padrao: /travesseiro/i },
  { id: 'turfa-organica', padrao: /turfa/i },
  { id: 'tanque-terrestre', padrao: /tanque|comprimento|largura|altura/i },
  { id: 'barreira-de-contencao-abfence', padrao: /ab-?fence/i },
  { id: 'barreira-de-contencao-seafence', padrao: /seafence/i },
];

/* Rótulos genéricos, que só dizem o produto quando combinados com a escolha
   feita no formulário. "Metragem desejada (m)" serve tanto para a SeaFence
   quanto para a AB-Fence, então sozinho não decide nada. */
const RECONHECIMENTO_GENERICO: { id: string; padrao: RegExp }[] = [
  { id: 'barreira-de-contencao-seafence', padrao: /metragem/i },
];

/** Linha (branca, cinza, verde) mencionada no rótulo ou no produto. */
function detectarLinha(...textos: (string | undefined)[]): string | undefined {
  const junto = textos.filter(Boolean).join(' ').toLowerCase();
  if (junto.includes('verde')) return 'Linha Verde';
  if (junto.includes('cinza')) return 'Linha Cinza';
  if (junto.includes('branca')) return 'Linha Branca';
  return undefined;
}

function reconhecer(rotulo: string, produto?: string): ItemPreco | undefined {
  // Rótulo específico ("Cordão Absorvente — Linha Branca") decide sozinho.
  for (const r of RECONHECIMENTO) {
    if (r.padrao.test(rotulo)) return acharPreco(r.id);
  }
  // Senão vale o produto escolhido no formulário.
  if (produto) {
    for (const r of RECONHECIMENTO) {
      if (r.padrao.test(produto)) return acharPreco(r.id);
    }
  }
  // Por último, os rótulos genéricos — nunca antes do produto, senão
  // "Metragem desejada" transformaria toda AB-Fence em SeaFence.
  for (const r of RECONHECIMENTO_GENERICO) {
    if (r.padrao.test(rotulo)) return acharPreco(r.id);
  }
  return undefined;
}

/** Converte "1.234,56" ou "1234.56" em número. */
function paraNumero(valor: string): number | undefined {
  const limpo = valor.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.');
  const n = Number(limpo);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function montarOrcamento(
  itens: QuoteItem[],
  opcoes: { produto?: string; estado?: string } = {},
): Orcamento {
  const linhas: LinhaOrcamento[] = [];
  /* Dimensões do tanque chegam em três campos separados; viram uma nota. */
  const dimensoes: string[] = [];

  for (const item of itens) {
    if (/comprimento|largura|altura/i.test(item.label)) {
      const medida = item.label.match(/comprimento|largura|altura/i)?.[0] ?? '';
      dimensoes.push(`${medida.toLowerCase()} ${item.value} m`);
      continue;
    }

    const quantidade = paraNumero(item.value);
    if (quantidade === undefined) continue;

    const preco = reconhecer(item.label, opcoes.produto);
    const linha = detectarLinha(item.label, opcoes.produto);

    if (!preco) {
      linhas.push({
        descricao: item.label,
        quantidade,
        unidade: 'un',
        observacao: 'Sob cotação — produto não identificado na tabela',
      });
      continue;
    }

    const unitario = precoDaLinha(preco, linha);
    const descricao = linha ? `${preco.nome} — ${linha}` : preco.nome;

    if (unitario === undefined) {
      linhas.push({
        descricao,
        quantidade,
        unidade: unidadePlural(preco.unidade, quantidade),
        precoId: preco.id,
        linhaProduto: linha,
        observacao: preco.observacao ?? 'Sob cotação',
      });
      continue;
    }

    linhas.push({
      descricao,
      quantidade,
      unidade: unidadePlural(preco.unidade, quantidade),
      precoId: preco.id,
      linhaProduto: linha,
      precoUnitario: unitario,
      total: Number((unitario * quantidade).toFixed(2)),
    });
  }

  if (dimensoes.length) {
    const tanque = linhas.find((l) => /tanque/i.test(l.descricao));
    const nota = `Dimensões: ${dimensoes.join(' × ')}`;
    if (tanque) tanque.observacao = `${tanque.observacao ?? ''} · ${nota}`.replace(/^ · /, '');
    else {
      linhas.push({
        descricao: 'Tanque Terrestre',
        quantidade: 1,
        unidade: 'un',
        observacao: `Sob cotação · ${nota}`,
      });
    }
  }

  const total = linhas.reduce((s, l) => s + (l.total ?? 0), 0);
  const estado = (opcoes.estado ?? '').trim();

  return {
    linhas,
    total: Number(total.toFixed(2)),
    exigeCotacao: linhas.some((l) => l.total === undefined),
    frete: definirFrete(estado, total),
    estado,
  };
}

export { moeda, PRECOS };
