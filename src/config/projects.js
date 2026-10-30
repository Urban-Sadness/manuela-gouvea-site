import { assets } from './assets.js';

// Placeholder slots only. Nothing here describes a completed project.
// `image` = a real photograph; `scene` = a drawn placeholder while photos are produced.
export const projects = [
  {
    id: 'p01',
    number: '01',
    name: '[Nome do projeto]',
    lead: 'Da ideia ao espaço vivido.',
    location: 'Búzios — RJ',
    program: '[programa]',
    year: '[ano]',
    status: '[status]',
    image: assets.archPhoto,
    summary:
      'Espaço reservado para a descrição do projeto: o lugar, o programa, os materiais e as decisões que deram forma ao espaço.',
  },
  {
    id: 'p02',
    number: '02',
    name: '[Nome do projeto]',
    lead: 'Luz, sombra e matéria.',
    location: '[local]',
    program: '[programa]',
    year: '[ano]',
    status: '[status]',
    scene: 'light',
    summary:
      'Fotografia em produção. Este espaço receberá as imagens e o texto do projeto assim que estiverem disponíveis.',
  },
  {
    id: 'p03',
    number: '03',
    name: '[Nome do projeto]',
    lead: 'Em breve.',
    location: '[local]',
    program: '[programa]',
    year: '[ano]',
    status: '[status]',
    scene: 'materials',
    summary: 'Espaço reservado para um próximo projeto.',
  },
];

export const projectById = (id) => projects.find((p) => p.id === id);
