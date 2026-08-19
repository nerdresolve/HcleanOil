/**
 * Seções técnicas da proposta, extraídas do modelo Word.
 *
 * Os textos vêm de "Proposta Padrão - Hclean.docx" palavra por palavra — a
 * proposta enviada pelo site precisa ser a mesma que a equipe já usa. Gerado
 * a partir do documento; ao alterar o Word, reextrair em vez de editar à mão.
 *
 * A proposta mostra apenas as seções dos produtos cotados, como o gerador
 * Python faz hoje: o cliente que pede barreira não recebe 20 páginas de
 * absorvente.
 */

export type SecaoProposta = {
  titulo: string;
  /** "Barreiras de Contenção", "Material Absorvente", "Kits de Proteção Ambiental". */
  grupo: string;
  /** Linha do absorvente, quando aplicável. */
  linha?: string;
  /** Arquivo em src/proposta/imagens. */
  imagem?: string;
  /** Legenda da figura, sem o "Figura N:" — a numeração é recalculada. */
  legenda?: string;
  paragrafos: string[];
  itens?: string[];
  /** Tabela de especificações, primeira linha = cabeçalho. */
  tabela?: { legenda: string; linhas: string[][] };
};

export const SECOES: SecaoProposta[] = [
  {
    titulo: 'Seafence',
    grupo: 'Barreiras de Contenção',
    imagem: 'image2.jpeg',
    legenda: 'Barreira de contenção Seafence',
    paragrafos: [
      'Barreira de contenção em lona confeccionada e reforçada, composta por fios de poliéster revestidos por PVC em ambas as faces que garantem maior resistência mecânica, denominada de FORTFLEX BP 1235 na cor laranja cuja gramatura é de 1.190 g / m² e espessura média de 0,95mm. Este produto contém a seguinte formulação: Anti-U.V, Anti-Oxidante, Antifungo, Plastificante Polimérico e possui Borracha Nitrílica(NBR) em sua composição.',
      'Com bolsa superior para cabo de aço, bolsa inferior para corrente de lastro galvanizada a fogo, com flutuadores em Poliestireno Expandido Bloco Tipo 2 P em formato cilíndrico, as seções das barreiras são de 25 a 50 metros de comprimento cada. As conexões são em alumínio naval ASTM. Tamanhos personalizáveis, conforme exemplos abaixo:',
    ],
    tabela: {
      legenda: 'Modelos e especificações da barreira Seafence',
      linhas: [
        ['Modelo', 'Borda Livre', 'Saia', 'Peso p/ metro', 'Altura total'],
        ['220 mm', '3’’ (76mm)', '5’’ (127mm)', '1,3Kg', '220mm'],
        ['305 mm', '5’’ (127mm)', '7’’ (178mm)', '1,8Kg', '305mm'],
        ['450 mm', '8’’ (200mm)', '10’’ (250mm)', '2,8Kg', '450mm'],
        ['550 mm', '10’’ (250mm)', '12’’ (300mm)', '3,4Kg', '550mm'],
        ['800 mm', '12’’ (300mm)', '20’’ (500mm)', '4,5Kg', '800mm'],
      ],
    },
  },
  {
    titulo: 'Ab-Fence',
    grupo: 'Barreiras de Contenção',
    imagem: 'image3.jpeg',
    legenda: 'Barreira de contenção AB-Fence.',
    paragrafos: [
      'A AB-FENCE é uma barreira de contenção flutuante para longos períodos fixos na água, fabricada a partir de materiais reforçados, projetada para suportar os efeitos danosos da abrasão, UV, óleo e degradação marinha.',
      'Os flutuadores coloridos e brilhantes são fabricados com material de elevada resistência à abrasão. Tais flutuadores de Polietileno HD são conectados ao tecido de base com acessórios em aço inoxidável. Estes mesmos flutuadores são utilizados para todas as alturas de barreira (personalizável).',
    ],
  },
  {
    titulo: 'Linha Branca',
    grupo: 'Material Absorvente',
    paragrafos: [
      'Absorventes para petróleo e derivados (hidrocarbonetos):',
    ],
    itens: [
      'Absorve de 10 a 15 vezes o seu peso;',
      'Capaz de absorver petróleo e seus derivados;',
      'Recupera as substâncias recolhidas sem absorver água (oleofílico e hidrofóbico);',
      'Pode ser reutilizado;',
      'Possui elevada resistência química e mecânica;',
      'Propicia limpeza eficiente e instantânea;',
      'Não nocivo para a fauna, a flora e nem para os seres humanos;',
      'Não se deteriora, nem mofa;',
      'Diminui os índices de exposição de trabalhadores à substâncias nocivos;',
      'Não inflamável, é resistente a baixas e elevadas temperaturas e à umidade.',
    ],
  },
  {
    titulo: 'Cordão Absorvente',
    grupo: 'Material Absorvente',
    linha: 'Linha Branca',
    imagem: 'image4.jpeg',
    legenda: 'Cordão Absorvente Linha Branca.',
    paragrafos: [
      'Disponível em Três tamanhos: 0,76cm x 1,20m / 0,76cm x 2,40m/ 0,76cm x 3,60m',
    ],
    itens: [
      'Indicado para conter a propagação de líquidos, impede que ele se espalhe rapidamente;',
      'Basta isolar a área atingida circundando o produto derramado e utilizar a manta ou travesseiro para absorver o produto;',
      'Capacidade de Absorção: 10 vezes o seu peso;',
      'Não absorve água;',
      'Flutua indefinidamente, mesmo saturada;',
      'Não inflamável e resistente a frio, calor e umidade.',
    ],
  },
  {
    titulo: 'Manta Absorvente',
    grupo: 'Material Absorvente',
    linha: 'Linha Branca',
    imagem: 'image5.jpeg',
    legenda: 'Manta Absorvente – Linha Branca.',
    paragrafos: [
      'Leve, de fácil manuseio e simples aplicação, as mantas absorventes impregnam-se com o produto derramado com precisão e rapidez. Basta aplicá-la sobre a região afetada e o produto será imediatamente removido pelo produto.',
      'Tamanho de 0,40 x 0,50 x 0,004m.',
    ],
    itens: [
      'Capacidade de Absorção: 10 vezes o seu peso;',
      'Não absorve água;',
      'Flutua indefinidamente, mesmo saturada;',
      'Não inflamável e resistente a frio, calor e umidade.',
    ],
  },
  {
    titulo: 'Barreiras Absorventes em Tiras',
    grupo: 'Material Absorvente',
    linha: 'Linha Branca',
    imagem: 'image6.jpeg',
    legenda: 'Barreira Absorvente em tiras – Linha Branca.',
    paragrafos: [
      'Dois tamanhos 5” x 3m e 8” x 3m',
    ],
    itens: [
      'Possui o formato em tira, do tipo espaguete, para permitir maior penetração de óleo;',
      'Utilizadas em águas correntes, são perfeitas para conter e absorver vazamentos de óleo;',
      'Indicada para óleos leves e de maior viscosidade;',
      'Possui engate rápido nas extremidades;',
      'Posicionadas corretamente na área afetada, impedem a passagem do produto, evitando que outras áreas sejam contaminadas;',
      'Capacidade de Absorção: 12 vezes o seu peso;',
      'Não absorve água;',
      'Não inflamável e resistente a frio, calor e umidade.',
    ],
  },
  {
    titulo: 'Barreiras Absorventes Flocadas',
    grupo: 'Material Absorvente',
    linha: 'Linha Branca',
    imagem: 'image7.jpeg',
    legenda: 'Barreira Absorvente flocada – Linha Branca.',
    paragrafos: [
      'Dois tamanhos 5” x 3m e 8” x 3m',
    ],
    itens: [
      'Barreira absorvente flocada para hidrocarbonetos, com dupla camada de contenção;',
      'Adequadas para óleos e derivados de baixa viscosidade;',
      'Capacidade de Absorção: 6 vezes o seu peso;',
      'Não absorve água;',
      'Não inflamável e resistente a frio, calor e umidade.',
    ],
  },
  {
    titulo: 'Rolo Absorvente',
    grupo: 'Material Absorvente',
    linha: 'Linha Branca',
    imagem: 'image8.jpeg',
    legenda: 'Rolo Absorvente – Linha Branca.',
    paragrafos: [
      'Dimensões 48m x 0,96m ou 96m x 0,96m',
    ],
    itens: [
      'Indicado como passadeira em locais de trânsito evitando a contaminação secundária;',
      'Pode ser utilizado na limpeza de maquinários e manutenção de equipamentos;',
      'Capacidade de Absorção: 10 vezes o seu peso;',
      'Não absorve água;',
      'Não inflamável e resistente a frio, calor e umidade.',
    ],
  },
  {
    titulo: 'Travesseiro Absorvente',
    grupo: 'Material Absorvente',
    linha: 'Linha Branca',
    imagem: 'image9.jpeg',
    legenda: 'Almofada Absorvente – Linha Branca.',
    paragrafos: [
      'Dois tamanhos 0,23m x 0,23m x0,05m e 0,45m x0,45m x0,05m',
    ],
    itens: [
      'Absorve desde pequenas a grandes quantidades de líquidos;',
      'Indicado para casos de vazamento e de goteiras provocadas por equipamentos;',
      'Capacidade de Absorção: 10 vezes o seu peso;',
      'Não absorve água;',
      'Não inflamável e resistente a frio, calor e umidade.',
    ],
  },
  {
    titulo: 'Linha Verde',
    grupo: 'Material Absorvente',
    paragrafos: [
      'Absorventes para líquidos agressivos (produtos químicos):',
    ],
    itens: [
      'Absorve de 10 a 15 vezes o seu peso;',
      'Capaz de Absorver ácidos, bases, tóxicos e produtos desconhecidos;',
      'Recupera as substâncias recolhidas;',
      'Pode ser reutilizado;',
      'Possui elevada resistência química e mecânica;',
      'Propicia limpeza eficiente e instantânea;',
      'Não nocivo para a fauna, a flora e nem para os seres humanos;',
      'Não se deteriora, nem mofa;',
      'Diminui os índices de exposição de trabalhadores à substâncias nocivas;',
    ],
  },
  {
    titulo: 'Cordão Absorvente',
    grupo: 'Material Absorvente',
    linha: 'Linha Verde',
    imagem: 'image10.jpeg',
    legenda: 'Cordão Absorvente – Linha Verde.',
    paragrafos: [
      'Três tamanhos 0,76cm x 1,20m / 0,76cm x 2,40m/ 0,76cm x 3,60m',
      'É indicada para derramamentos e contenções de ácidos, bases, tóxicos e produtos desconhecidos. Ideal para conter a propagação de líquidos, impede que ele se espalhe rapidamente. Basta isolar a área atingida circundando o produto derramado.',
    ],
    itens: [
      'Capacidade de Absorção: 10 vezes o seu peso;',
      'Fácil aplicação e manuseio;',
      'Retém líquidos permanentemente.',
    ],
  },
  {
    titulo: 'Manta Absorvente',
    grupo: 'Material Absorvente',
    linha: 'Linha Verde',
    imagem: 'image11.jpeg',
    legenda: 'Manta Absorvente – Linha Verde.',
    paragrafos: [
      'Tamanho de 0,40 x 0,50 x 0,004m.',
    ],
    itens: [
      'É indicada para derramamentos e contenções de ácidos, bases e produtos desconhecidos;',
      'Não se desfaz ao entrar em contato com líquidos mais agressivos;',
      'Pode também ser utilizada para limpeza de bancadas em laboratórios;',
      'Capacidade de Absorção: 10 vezes o seu peso;',
      'Fácil aplicação e manuseio;',
      'Retém líquidos permanentemente.',
    ],
  },
  {
    titulo: 'Rolo Absorvente',
    grupo: 'Material Absorvente',
    linha: 'Linha Verde',
    imagem: 'image12.jpeg',
    legenda: 'Rolo Absorvente – Linha Verde.',
    paragrafos: [
      'Dimensões 48m x 0,96m ou 96m x 0,96m',
    ],
    itens: [
      'Indicado para proteger o piso, previne possíveis acidentes com derrames de ácidos e produtos químicos;',
      'É ajustável ao tamanho e ao formato necessário e utilizado sem desperdício;',
      'Capacidade de Absorção: 10 vezes o seu peso;',
      'Fácil aplicação e manuseio;',
      'Retém líquidos permanentemente.',
    ],
  },
  {
    titulo: 'Travesseiros Absorventes',
    grupo: 'Material Absorvente',
    linha: 'Linha Verde',
    imagem: 'image13.jpeg',
    legenda: 'Travesseiro Absorvente – Linha Verde.',
    paragrafos: [
      'Dois tamanhos 0,23m x 0,23m x0,05m e 0,45m x0,45m x0,05m',
    ],
    itens: [
      'Absorve desde pequenas a grandes quantidades de líquidos;',
      'Indicado para casos de vazamentos e goteiras de produtos agressivos;',
      'Capacidade de Absorção: 10 vezes o seu peso;',
      'Fácil aplicação e manuseio;',
      'Retém líquidos permanentemente.',
    ],
  },
  {
    titulo: 'Linha Cinza',
    grupo: 'Material Absorvente',
    paragrafos: [
      'Absorventes para líquidos em geral:',
    ],
    itens: [
      'Absorve de 10 a 15 vezes o seu peso;',
      'Capaz de absorver líquidos a base de água, detergentes, solventes, óleos e muitos outros;',
      'Recupera as substâncias recolhidas;',
      'Pode ser reutilizado;',
      'Possui elevada resistência química e mecânica;',
      'Propicia limpeza eficiente e instantânea;',
      'Não nocivo para a fauna, a flora e nem para os seres humanos;',
      'Não se deteriora, nem mofa;',
      'Diminui os índices de exposição de trabalhadores à substâncias nocivos;',
      'Não inflamável, é resistente a baixas e elevadas temperaturas e à umidade.',
    ],
  },
  {
    titulo: 'Cordão Absorvente',
    grupo: 'Material Absorvente',
    linha: 'Linha Cinza',
    imagem: 'image14.jpeg',
    legenda: 'Cordão Absorvente – Linha Cinza.',
    paragrafos: [
      'Três tamanhos 0,76cm x 1,20m / 0,76cm x 2,40m/ 0,76cm x 3,60m',
      'Ideal para envolver preventivamente o maquinário e conter a propagação de líquidos, impedindo que ele se espalhe rapidamente. Basta isolar a área atingida circundando o produto derramado.',
    ],
    itens: [
      'Capacidade de Absorção: 10 vezes o seu peso;',
      'Fácil aplicação e manuseio;',
      'Retém líquidos permanentemente.',
    ],
  },
  {
    titulo: 'Manta Absorvente',
    grupo: 'Material Absorvente',
    linha: 'Linha Cinza',
    imagem: 'image15.jpeg',
    legenda: 'Manta Absorvente – Linha Cinza.',
    paragrafos: [
      'Tamanho de 0,40 x 0,50 x 0,004m.',
    ],
    itens: [
      'É indicada para limpeza e absorção de diversos tipos de produtos, tais como: óleo, água, solventes e muitos outros;',
      'Capacidade de Absorção: 10 vezes o seu peso;',
      'Fácil aplicação e manuseio;',
      'Retém líquidos permanentemente.',
    ],
  },
  {
    titulo: 'Rolo Absorvente',
    grupo: 'Material Absorvente',
    linha: 'Linha Cinza',
    imagem: 'image16.jpeg',
    legenda: 'Rolo Absorvente – Linha Cinza.',
    paragrafos: [
      'Dimensões 48m x 0,96m ou 96m x 0,96m',
    ],
    itens: [
      'Indicado para proteger o piso;',
      'É ajustável ao tamanho e ao formato necessário e utilizado sem desperdício;',
      'Capacidade de Absorção: 10 vezes o seu peso;',
      'Fácil aplicação e manuseio;',
      'Retém líquidos permanentemente.',
    ],
  },
  {
    titulo: 'Travesseiros Absorventes',
    grupo: 'Material Absorvente',
    linha: 'Linha Cinza',
    imagem: 'image17.jpeg',
    legenda: 'Travesseiro Absorvente – Linha Cinza.',
    paragrafos: [
      'Dois tamanhos 0,23m x 0,23m x0,05m e 0,45m x0,45m x0,05m',
    ],
    itens: [
      'Absorve desde pequenas a grandes quantidades de líquidos;',
      'Indicado para casos de vazamentos e goteiras e regiões que sofrem respingos;',
      'Capacidade de Absorção: 10 vezes o seu peso;',
      'Fácil aplicação e manuseio;',
      'Retém líquidos permanentemente.',
    ],
  },
  {
    titulo: 'Kit SOPEP',
    grupo: 'Kits de Proteção Ambiental',
    imagem: 'image18.jpeg',
    legenda: 'Kit Sopep.',
    paragrafos: [
      'Os Kits SOPEP (Shipboard Oil Pollution Emergency Plan) são dimensionados especialmente para a contenção e absorção de vazamentos ou derramamentos de petróleo, seus derivados, produtos químicos e líquidos diversos. São indicados para uso em ambientes industriais, portuários, embarcações e áreas sensíveis, onde é necessário agir rapidamente para controlar e minimizar os impactos ambientais de incidentes com substâncias perigosas.',
      'Disponíveis em diferentes capacidades de absorção – 50L, 100L, 200L e 1000L – os kits são compostos por materiais específicos que facilitam o manejo seguro e eficiente dessas substâncias. A escolha do tamanho adequado depende do volume de risco presente na operação e das exigências normativas do local.',
    ],
  },
  {
    titulo: 'Kit de Primeiro Atendimento',
    grupo: 'Kits de Proteção Ambiental',
    imagem: 'image19.jpeg',
    legenda: 'Kit de Primeiro Atendimento.',
    paragrafos: [
      'O Kit de Primeiro Atendimento é desenvolvido para oferecer uma resposta rápida e eficaz em situações de emergência envolvendo vazamentos ou derramamentos de líquidos perigosos, como petróleo e seus derivados, produtos químicos ou substâncias contaminantes.',
      'Esse kit é especialmente indicado para ser utilizado nas fases iniciais de um acidente ambiental ou industrial, permitindo a contenção imediata e a mitigação dos impactos até que uma equipe especializada assuma o controle da situação.',
      'Compacto e de fácil manuseio, o Kit de Primeiro Atendimento pode conter barreiras, mantas absorventes, EPIs (Equipamentos de Proteção Individual), sacos de descarte e outros itens essenciais para a ação emergencial. Ele é ideal para ser mantido em áreas de risco, como fábricas, oficinas, postos de combustível, portos e embarcações.',
      'Disponível em diferentes configurações, sua composição pode ser personalizada de acordo com o tipo de produto a ser contido e as exigências normativas do local ou operação.',
    ],
  },
  {
    titulo: 'Tanque Terrestre',
    grupo: 'Tanque Terrestre',
    imagem: 'image20.jpeg',
    legenda: 'Tanque autoportante.',
    paragrafos: [
      'Os tanques terrestres HCLEAN são projetados para o armazenamento seguro de líquidos contaminados, águas oleosas e resíduos provenientes de operações de resposta a emergências.',
      'Fabricados em material de alta durabilidade e resistência química, são ideais para uso temporário em operações de emergência e manutenção.',
    ],
    itens: [
      'Casulos em PVC;',
      'Cobertura em Lona PVC;',
      'Válvula de Drenagem se aplicável;',
      'Nas cores azul e laranja;',
      'TANQUE YZY TERRESTRE 15.000 lts',
      'Dimensões: C 2,10 x L 1,60 x A 0,45 – Peso: 45Kg',
      'Tanque para armazenamento temporário para hidrocarbonetos, confeccionado em lona de PVC Vulcanizada. Sua borda, com flutuadores, vai se modelando conforme a quantidade de produto a ser colocado.',
      'Operações emergenciais em terra (onshore);',
      'Pode ser utilizado também em píeres, terminais e embarcações de apoio;',
      'Equipamento comumente utilizado na composição de PEIs (Planos de Emergência Individual);',
      'Após a operação com óleo, retirar o tanque e colocá-lo em Big Bags, transportando-o com segurança.',
    ],
  },
];

/** Texto de apresentação, na abertura da proposta. */
export const APRESENTACAO: string[] = [
  'Com mais de 18 anos de tradição, a HCLEAN é referência nacional em equipamentos e soluções de resposta a emergências ambientais, atuando com excelência técnica e compromisso com a preservação do meio ambiente.',
  'Reconhecida pela utilização de seus equipamentos em operações reais de contenção e mitigação de derramamentos de óleo e substâncias perigosas, a HCLEAN é sinônimo de confiança e eficiência.',
  'Ao longo de sua trajetória, a HCLEAN se consolidou como parceira estratégica das principais empresas e instituições do setor ambiental e portuário.',
  'Os produtos HCLEAN são desenvolvidos com base em rigorosos padrões de qualidade, segurança e desempenho, oferecendo a confiabilidade que o mercado exige.',
  'Mais do que fornecer equipamentos, a HCLEAN entrega tranquilidade, credibilidade e comprometimento com o meio ambiente.',
];

/** Abertura da seção de equipamentos. */
export const INTRO_EQUIPAMENTOS =
  'A HCLEAN oferece uma linha completa de equipamentos e soluções ambientais desenvolvidos para prevenção, contenção e resposta a incidentes com derramamentos.';

/** Aberturas de cada grupo, como no modelo. */
export const INTRO_GRUPO: Record<string, string> = {
  'Barreiras de Contenção':
    'As barreiras de contenção HCLEAN são desenvolvidas para oferecer máxima eficiência no controle e isolamento de contaminantes em ambientes aquáticos e terrestres.',
  'Material Absorvente':
    'Os materiais absorventes HCLEAN são projetados para o controle, contenção e limpeza de vazamentos e gotejamentos de óleo, combustível e produtos químicos.',
};

/** Condições comerciais, do modelo. */
export const CONDICOES = {
  intro:
    'A HCLEAN preza pela transparência, agilidade e comprometimento em todas as etapas do processo comercial.',
  itens: [
    'Pagamento em 30 dias após a entrega em c/c da empresa;',
    'Todos os impostos inclusos;',
    'Devolução apenas em caso de problema de fabricação.',
  ],
  validade:
    'Esta proposta é válida por 30 (trinta) dias corridos a partir da data de emissão. Após esse período, os valores e prazos poderão ser revisados conforme as condições de mercado.',
};