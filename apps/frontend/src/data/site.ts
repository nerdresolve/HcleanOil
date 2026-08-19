/**
 * Conteúdo institucional e catálogo da HCLEAN.
 *
 * Posicionamento: fornecedora técnica B2B de equipamentos para resposta a
 * emergências ambientais — não uma loja de produtos. A copy sustenta apenas o
 * que é verificável ("referência nacional", "mais de 18 anos", "operações
 * reais"); superlativos como "líder absoluta" ficam de fora de propósito.
 */

export const site = {
  name: 'HCLEAN',
  legalName: 'HCLEAN Equipamentos Ambientais Ltda',
  tagline: 'Soluções para resposta rápida a emergências ambientais',
  description:
    'Há mais de 18 anos, a HCLEAN fornece equipamentos e soluções para operações de resposta a emergências ambientais em todo o Brasil.',
  url: 'https://www.hcleanoil.com.br',
  contact: {
    email: 'contato@hcleanoil.com.br',
    phone: '(21) 99494-5460',
    phoneHref: 'tel:+5521994945460',
    site: 'www.hcleanoil.com.br',
  },
} as const;

export const nav = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/sobre', label: 'Sobre a HCLEAN' },
  { href: '/contato', label: 'Contato' },
] as const;

/* ---------------------------------------------------------------- catálogo */

export type Category = {
  slug: string;
  name: string;
  short: string;
  intro: string;
  icon: IconName;
};

export const categories: Category[] = [
  {
    slug: 'barreiras-de-contencao',
    name: 'Barreiras de Contenção',
    short:
      'Soluções para contenção e direcionamento de contaminantes em ambientes aquáticos e terrestres.',
    intro: 'Para contenção, direcionamento e controle de contaminantes.',
    icon: 'shield',
  },
  {
    slug: 'absorventes',
    name: 'Materiais Absorventes',
    short:
      'Materiais desenvolvidos para absorção de óleo e outros líquidos, auxiliando na resposta e limpeza de áreas afetadas.',
    intro: 'Para absorção e remoção de líquidos durante operações de resposta.',
    icon: 'droplets',
  },
  {
    slug: 'kits-de-emergencia',
    name: 'Kits de Emergência',
    short:
      'Conjuntos preparados para facilitar o atendimento inicial e manter equipes prontas para situações de derramamento.',
    intro:
      'Soluções preparadas para atendimento rápido em situações de derramamento.',
    icon: 'kit',
  },
  {
    slug: 'armazenamento',
    name: 'Armazenamento e Apoio Operacional',
    short: 'Soluções para armazenamento temporário e apoio às operações de resposta.',
    intro:
      'Produtos para suporte às operações de resposta e gerenciamento temporário de materiais.',
    icon: 'tank',
  },
];

export type Product = {
  slug: string;
  name: string;
  category: Category['slug'];
  /** Frase curta do hero da página do produto. */
  lead: string;
  /** Parágrafo "Sobre o produto". */
  about: string;
  applications: string[];
  /**
   * Características técnicas reais. Fica vazio enquanto os dados de fábrica não
   * forem fornecidos — a seção some da página em vez de exibir número inventado.
   */
  specs: { label: string; value: string }[];
};

const APLICACOES_PADRAO = [
  'Operações de resposta a derramamentos',
  'Contenção de contaminantes',
  'Atendimento emergencial',
  'Operações ambientais',
];

export const products: Product[] = [
  {
    slug: 'barreira-de-contencao-seafence',
    name: 'Barreira de Contenção SeaFence',
    category: 'barreiras-de-contencao',
    lead: 'Solução para contenção de contaminantes em operações de resposta a emergências ambientais.',
    about:
      'A Barreira de Contenção SeaFence foi desenvolvida para atender operações que necessitam de uma solução adequada para contenção e direcionamento de contaminantes em ambientes aquáticos. Sua aplicação auxilia as equipes responsáveis pela resposta ambiental durante operações de contenção, controle e recuperação.',
    applications: [
      'Contenção em ambientes aquáticos',
      'Direcionamento de contaminantes',
      'Operações de resposta a derramamentos',
      'Atendimento emergencial',
    ],
    specs: [],
  },
  {
    slug: 'barreira-de-contencao-abfence',
    name: 'Barreira de Contenção ABFence',
    category: 'barreiras-de-contencao',
    lead: 'Solução para contenção de contaminantes em operações de resposta a emergências ambientais.',
    about:
      'A Barreira de Contenção ABFence foi desenvolvida para atender operações que necessitam de uma solução adequada para contenção e direcionamento de contaminantes. Sua aplicação auxilia as equipes responsáveis pela resposta ambiental durante operações de contenção, controle e recuperação.',
    applications: APLICACOES_PADRAO,
    specs: [],
  },
  {
    slug: 'kit-sopep-50l',
    name: 'Kit SOPEP 50 L',
    category: 'kits-de-emergencia',
    lead: 'Conjunto preparado para o atendimento inicial a situações de derramamento.',
    about:
      'O Kit SOPEP 50 L foi desenvolvido para atender operações que necessitam de uma solução adequada para o atendimento inicial a derramamentos. Reúne em um único conjunto os itens de apoio à resposta, mantendo a equipe preparada para agir.',
    applications: APLICACOES_PADRAO,
    specs: [],
  },
  {
    slug: 'kit-sopep-100l',
    name: 'Kit SOPEP 100 L',
    category: 'kits-de-emergencia',
    lead: 'Conjunto preparado para o atendimento inicial a situações de derramamento.',
    about:
      'O Kit SOPEP 100 L foi desenvolvido para atender operações que necessitam de uma solução adequada para o atendimento inicial a derramamentos. Reúne em um único conjunto os itens de apoio à resposta, mantendo a equipe preparada para agir.',
    applications: APLICACOES_PADRAO,
    specs: [],
  },
  {
    slug: 'kit-sopep-200l',
    name: 'Kit SOPEP 200 L',
    category: 'kits-de-emergencia',
    lead: 'Conjunto preparado para o atendimento inicial a situações de derramamento.',
    about:
      'O Kit SOPEP 200 L foi desenvolvido para atender operações que necessitam de uma solução adequada para o atendimento inicial a derramamentos. Reúne em um único conjunto os itens de apoio à resposta, mantendo a equipe preparada para agir.',
    applications: APLICACOES_PADRAO,
    specs: [],
  },
  {
    slug: 'kit-primeiro-atendimento',
    name: 'Kit Primeiro Atendimento',
    category: 'kits-de-emergencia',
    lead: 'Conjunto para resposta imediata enquanto a operação é mobilizada.',
    about:
      'O Kit Primeiro Atendimento foi desenvolvido para atender operações que necessitam de uma solução adequada para a resposta imediata a situações de derramamento, facilitando o atendimento inicial enquanto a operação é mobilizada.',
    applications: APLICACOES_PADRAO,
    specs: [],
  },
  {
    slug: 'turfa-organica',
    name: 'Turfa Orgânica',
    category: 'absorventes',
    lead: 'Material absorvente para óleo e outros líquidos em operações de resposta.',
    about:
      'A Turfa Orgânica foi desenvolvida para atender operações que necessitam de uma solução adequada para absorção de óleo e outros líquidos. Sua aplicação auxilia as equipes responsáveis pela resposta ambiental durante a limpeza de áreas afetadas.',
    applications: [
      'Absorção de óleo',
      'Limpeza de áreas afetadas',
      'Operações de resposta a derramamentos',
      'Operações ambientais',
    ],
    specs: [],
  },
  {
    slug: 'barreira-absorvente',
    name: 'Barreira Absorvente',
    category: 'absorventes',
    lead: 'Solução que contém e absorve líquidos durante a operação de resposta.',
    about:
      'A Barreira Absorvente foi desenvolvida para atender operações que necessitam de uma solução adequada para conter e absorver líquidos simultaneamente, apoiando as equipes durante a resposta e a limpeza de áreas afetadas.',
    applications: APLICACOES_PADRAO,
    specs: [],
  },
  {
    slug: 'manta-absorvente-branca',
    name: 'Manta Absorvente Branca',
    category: 'absorventes',
    lead: 'Manta para absorção de óleo em operações de resposta e limpeza.',
    about:
      'A Manta Absorvente Branca foi desenvolvida para atender operações que necessitam de uma solução adequada para absorção de óleo. Sua aplicação auxilia as equipes responsáveis pela resposta ambiental durante a limpeza de áreas afetadas.',
    applications: [
      'Absorção de óleo',
      'Limpeza de áreas afetadas',
      'Atendimento emergencial',
      'Operações ambientais',
    ],
    specs: [],
  },
  {
    slug: 'manta-absorvente-cinza',
    name: 'Manta Absorvente Cinza',
    category: 'absorventes',
    lead: 'Manta para absorção de líquidos em geral durante a operação.',
    about:
      'A Manta Absorvente Cinza foi desenvolvida para atender operações que necessitam de uma solução adequada para absorção de líquidos em geral, apoiando a resposta e a limpeza de áreas afetadas.',
    applications: APLICACOES_PADRAO,
    specs: [],
  },
  {
    slug: 'manta-absorvente-verde',
    name: 'Manta Absorvente Verde',
    category: 'absorventes',
    lead: 'Manta para absorção de líquidos em geral durante a operação.',
    about:
      'A Manta Absorvente Verde foi desenvolvida para atender operações que necessitam de uma solução adequada para absorção de líquidos em geral, apoiando a resposta e a limpeza de áreas afetadas.',
    applications: APLICACOES_PADRAO,
    specs: [],
  },
  {
    slug: 'tanque-terrestre',
    name: 'Tanque Terrestre',
    category: 'armazenamento',
    lead: 'Solução para armazenamento temporário e apoio às operações de resposta.',
    about:
      'O Tanque Terrestre foi desenvolvido para atender operações que necessitam de uma solução adequada para armazenamento temporário de líquidos, dando suporte às operações de resposta e ao gerenciamento de materiais em campo.',
    applications: [
      'Armazenamento temporário',
      'Apoio operacional em campo',
      'Operações de resposta a derramamentos',
      'Operações ambientais',
    ],
    specs: [],
  },
];

export const productsByCategory = (slug: Category['slug']) =>
  products.filter((p) => p.category === slug);

export const findProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const findCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

/** Até 4 itens da mesma categoria, completando com outros quando faltar. */
export const relatedProducts = (product: Product, limit = 4) => {
  const sameLine = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  );
  const others = products.filter(
    (p) => p.category !== product.category && p.slug !== product.slug,
  );
  return [...sameLine, ...others].slice(0, limit);
};

/* --------------------------------------------------------------- institucional */

export const pillars = [
  {
    icon: 'clock' as const,
    title: '+18 anos de experiência',
    text: 'Atuação no mercado de equipamentos e soluções para emergências ambientais.',
  },
  {
    icon: 'field' as const,
    title: 'Operações reais',
    text: 'Equipamentos utilizados em operações de contenção de derramamentos no Brasil.',
  },
  {
    icon: 'support' as const,
    title: 'Atendimento técnico',
    text: 'Suporte para ajudar sua empresa a identificar a solução adequada para cada necessidade.',
  },
  {
    icon: 'handshake' as const,
    title: 'Parceria no setor ambiental',
    text: 'A HCLEAN é parceira técnica da Hidroclean, empresa pioneira no segmento de proteção ambiental no Brasil.',
  },
];

export const proofPoints = [
  { value: '+18', label: 'anos de atuação no setor' },
  { value: 'Operações reais', label: 'equipamentos utilizados em respostas a derramamentos' },
  { value: 'Hidroclean', label: 'parceria técnica no setor ambiental' },
  { value: 'Atuação nacional', label: 'fornecimento para operações em diferentes regiões do Brasil' },
];

export type IconName =
  | 'shield'
  | 'droplets'
  | 'kit'
  | 'tank'
  | 'clock'
  | 'field'
  | 'support'
  | 'handshake'
  | 'arrow-right'
  | 'check'
  | 'mail'
  | 'phone'
  | 'globe'
  | 'pin'
  | 'chevron-right';
