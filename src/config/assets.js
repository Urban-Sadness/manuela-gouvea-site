// Every image the site uses. Swap `src` when real photography arrives and set
// `reference: false` — the "imagem de referência" labels disappear automatically.
export const assets = {
  wordmark: { src: '/assets/brand/wordmark.png', ratio: 1157 / 144 },

  archPhoto: {
    src: '/assets/ref/arco-referencia.jpg',
    width: 867,
    height: 582,
    alt: 'Vista através de um arco branco para o mar, com mesas sobre deque de madeira.',
    reference: true,
    credit: 'Imagem de referência do manual de marca — substituir por fotografia do projeto.',
    // Inner opening of the real arch in the photo, in image pixels.
    // The scroll sequence lands the drawn arch exactly on this curve.
    arch: { cx: 275, apexY: 68, radius: 270 },
  },
};
