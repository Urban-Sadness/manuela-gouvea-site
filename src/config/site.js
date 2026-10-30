// Brand copy lives here so naming and wording can change without touching layout.
// NOTE: the supplied wordmark and brand manual spell the surname "Gouvea";
// the written brief uses "Gouveia". Change `name` here once it's confirmed.
export const site = {
  name: 'Manuela Gouvea',
  discipline: 'Arquitetura',
  useWordmarkImage: true, // false = render `name` in the display font instead

  hero: {
    statement: ['O lugar dá forma.', 'A vida dá sentido.'],
    intro: 'Arquitetura que nasce da relação entre matéria, natureza e o jeito de viver.',
    place: 'Búzios — Rio de Janeiro',
    practice: 'Arquitetura & Interiores',
  },

  nav: [
    { label: 'Início', href: '#inicio' },
    { label: 'Projetos', href: '#projetos' },
    { label: 'Estúdio', href: '#estudio' },
    { label: 'Contato', href: '#contato' },
  ],

  sequence: {
    eyebrow: 'Do desenho à realidade',
    stages: ['Desenho', 'Elementos', 'Aproximação', 'O arco', 'Matéria', 'Espaço vivido'],
  },

  projects: {
    heading: 'Espaços para viver.',
    intro:
      'Cada projeto nasce de uma escuta: do lugar, de quem habita e das possibilidades que surgem desse encontro.',
  },

  studio: {
    heading: 'Estúdio',
    text: [
      'Uma prática de arquitetura e interiores em Búzios, atenta ao que já existe: a luz de cada hora, o vento, a vegetação, os materiais da região.',
      'Precisão geométrica e imperfeição natural convivem no mesmo desenho. A arquitetura não compete com a paisagem — pertence a ela.',
    ],
    principles: [
      { title: 'Lugar', text: 'Ler o terreno antes de traçar a primeira linha.' },
      { title: 'Luz', text: 'Desenhar com a sombra tanto quanto com a parede.' },
      { title: 'Matéria', text: 'Cerâmica, madeira, pedra e cal, escolhidas para envelhecer bem.' },
      { title: 'Vida', text: 'Espaços pensados para o cotidiano de quem habita.' },
    ],
  },

  contact: {
    heading: 'Vamos conversar sobre o seu lugar.',
    email: '[email do estúdio]',
    instagram: '[@perfil]',
    phone: '[telefone]',
    address: 'Búzios — Rio de Janeiro',
  },

  footnote: 'Protótipo — paleta, tipografia e imagens provisórias, sujeitas à identidade final.',
};
