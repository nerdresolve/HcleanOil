/**
 * Configuração de quantidade por produto no formulário de orçamento.
 *
 * Cada item do catálogo é vendido numa unidade diferente — barreira em metro
 * linear, manta em pacote fechado, kit por capacidade, tanque sob medida. Este
 * arquivo descreve essas regras para que o formulário peça exatamente o que a
 * equipe comercial precisa saber para cotar.
 */

/** Um campo de quantidade dentro de uma opção. */
export type QuantityField =
  | {
      kind: 'number';
      name: string;
      label: string;
      unit: string;
      /** Menor valor aceito. */
      min: number;
      /** Incremento; o valor precisa ser múltiplo dele. */
      step: number;
      placeholder?: string;
      hint?: string;
    }
  | {
      kind: 'dimensions';
      name: string;
      label: string;
      unit: string;
      hint?: string;
    };

/**
 * Uma variante do produto que pode ser pedida. Produtos com `options` deixam
 * escolher mais de uma variante, cada uma com sua quantidade — é o caso dos
 * kits SOPEP, em que o cliente pode querer 50 L e 200 L ao mesmo tempo.
 */
export type QuoteOption = {
  id: string;
  label: string;
  fields: QuantityField[];
};

export type QuoteProduct = {
  /** Corresponde ao slug em data/site.ts. */
  slug: string;
  name: string;
  /** Texto acima da lista de variantes. */
  intro?: string;
  options: QuoteOption[];
};

/* Campos reaproveitados entre produtos. ------------------------------------ */

const metrosLineares = (name = 'metros'): QuantityField => ({
  kind: 'number',
  name,
  label: 'Metragem',
  unit: 'm',
  min: 1,
  step: 1,
  placeholder: 'Ex.: 150',
  hint: 'Metro linear. Fabricamos sob medida; a seção padrão é de 25 m.',
});

const unidades = (name = 'unidades', hint?: string): QuantityField => ({
  kind: 'number',
  name,
  label: 'Quantidade',
  unit: 'un',
  min: 1,
  step: 1,
  placeholder: 'Ex.: 10',
  hint,
});

/** Manta é fornecida em pacote fechado de 200 unidades. */
const mantaPacote = (name: string): QuantityField => ({
  kind: 'number',
  name,
  label: 'Quantidade',
  unit: 'un',
  min: 200,
  step: 200,
  placeholder: 'Ex.: 400',
  hint: 'Pacote fechado de 200 unidades — informe múltiplos de 200.',
});

/** Os seis formatos das linhas de absorvente, com a manta em pacote. */
const formatosAbsorvente = (prefix: string, comBarreiras: boolean): QuoteOption[] => {
  const base: QuoteOption[] = [
    { id: `${prefix}-cordao`, label: 'Cordão absorvente', fields: [unidades(`${prefix}-cordao-qtd`)] },
    { id: `${prefix}-manta`, label: 'Manta absorvente', fields: [mantaPacote(`${prefix}-manta-qtd`)] },
    { id: `${prefix}-rolo`, label: 'Rolo absorvente', fields: [unidades(`${prefix}-rolo-qtd`)] },
    { id: `${prefix}-travesseiro`, label: 'Travesseiro absorvente', fields: [unidades(`${prefix}-travesseiro-qtd`)] },
  ];

  if (comBarreiras) {
    base.splice(
      2,
      0,
      {
        id: `${prefix}-barreira-tiras`,
        label: 'Barreira absorvente em tiras',
        fields: [unidades(`${prefix}-tiras-qtd`)],
      },
      {
        id: `${prefix}-barreira-flocada`,
        label: 'Barreira absorvente flocada',
        fields: [unidades(`${prefix}-flocada-qtd`)],
      },
    );
  }

  return base;
};

/* Catálogo de orçamento. ---------------------------------------------------- */

export const quoteProducts: QuoteProduct[] = [
  {
    slug: 'barreira-de-contencao-seafence',
    name: 'Barreira de Contenção SeaFence',
    options: [
      { id: 'seafence', label: 'Metragem desejada', fields: [metrosLineares('seafence-metros')] },
    ],
  },
  {
    slug: 'barreira-de-contencao-abfence',
    name: 'Barreira de Contenção ABFence',
    options: [
      { id: 'abfence', label: 'Metragem desejada', fields: [metrosLineares('abfence-metros')] },
    ],
  },
  {
    slug: 'linha-branca',
    name: 'Linha Branca — hidrocarbonetos',
    intro: 'Selecione os formatos e informe a quantidade de cada um.',
    options: formatosAbsorvente('branca', true),
  },
  {
    slug: 'linha-cinza',
    name: 'Linha Cinza — líquidos em geral',
    intro: 'Selecione os formatos e informe a quantidade de cada um.',
    options: formatosAbsorvente('cinza', false),
  },
  {
    slug: 'linha-verde',
    name: 'Linha Verde — líquidos agressivos',
    intro: 'Selecione os formatos e informe a quantidade de cada um.',
    options: formatosAbsorvente('verde', false),
  },
  {
    slug: 'turfa-organica',
    name: 'Turfa Orgânica',
    options: [
      {
        id: 'turfa',
        label: 'Quantidade',
        fields: [
          {
            kind: 'number',
            name: 'turfa-kg',
            label: 'Peso',
            unit: 'kg',
            min: 1,
            step: 1,
            placeholder: 'Ex.: 500',
            hint: '1 kg absorve até 12 litros de óleo.',
          },
        ],
      },
    ],
  },
  {
    slug: 'kit-sopep',
    name: 'Kit SOPEP',
    intro: 'Selecione as capacidades e informe a quantidade de cada uma.',
    options: [
      { id: 'sopep-50', label: 'Kit SOPEP 50 L', fields: [unidades('sopep-50-qtd')] },
      { id: 'sopep-100', label: 'Kit SOPEP 100 L', fields: [unidades('sopep-100-qtd')] },
      { id: 'sopep-200', label: 'Kit SOPEP 200 L', fields: [unidades('sopep-200-qtd')] },
      { id: 'sopep-1000', label: 'Kit SOPEP 1.000 L', fields: [unidades('sopep-1000-qtd')] },
    ],
  },
  {
    slug: 'kit-primeiro-atendimento',
    name: 'Kit Primeiro Atendimento',
    options: [
      {
        id: 'primeiro-atendimento',
        label: 'Quantidade',
        fields: [
          unidades(
            'primeiro-atendimento-qtd',
            'A composição pode ser personalizada conforme o produto a conter.',
          ),
        ],
      },
    ],
  },
  {
    slug: 'tanque-terrestre',
    name: 'Tanque Terrestre',
    options: [
      {
        id: 'tanque',
        label: 'Dimensões e quantidade',
        fields: [
          {
            kind: 'dimensions',
            name: 'tanque-dim',
            label: 'Dimensões',
            unit: 'm',
            hint: 'Comprimento × largura × altura. O modelo padrão é 2,10 × 1,60 × 0,45 m (15.000 L).',
          },
          unidades('tanque-qtd'),
        ],
      },
    ],
  },
];

export const findQuoteProduct = (slug: string) =>
  quoteProducts.find((p) => p.slug === slug);
