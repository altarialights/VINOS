export const wines = [
  {
    id: 'nexus-crianza-2020', name: 'Nexus Crianza', vintage: 2020,
    grape: '100% Tempranillo', origin: 'D.O. Ribera del Duero',
    aging: '12 meses en roble francés', image: 'nexus-crianza-premium',
    tasting: 'Fruta madura y notas florales, con recuerdos de nuez y un fondo balsámico. Fresco, suave y equilibrado.',
    pairing: 'Carnes a la brasa, asados y guisos.',
    url: 'https://www.bodegasnexus.com/vino/vino-tinto-nexus-crianza/',
  },
  {
    id: 'frontaura-crianza-2018', name: 'Frontaura & Victoria Crianza', vintage: 2018,
    grape: '100% Tinta de Toro', origin: 'D.O. Toro',
    aging: '13 meses en roble francés Allier', image: 'frontaura-crianza',
    tasting: 'Fruta roja y negra, especias y un paso amplio y cremoso. Un tanino maduro define su carácter.',
    pairing: 'Asados, quesos curados y cocina de otoño.',
    url: 'https://www.bodegasfrontaura.com/vino/vino-tinto-frontaura-victoria-crianza/',
  },
  {
    id: 'aponte-reserva-2018', name: 'Aponte Reserva', vintage: 2018,
    grape: '100% Tinta de Toro', origin: 'D.O. Toro',
    aging: '20 meses en roble francés Allier', image: 'aponte-reserva',
    tasting: 'Fruta roja, eucalipto, vainilla y coco. Cálido, aterciopelado y persistente, de viñas centenarias de Toro.',
    pairing: 'Carnes rojas, pescados grasos y postres de cacao.',
    url: 'https://www.bodegasfrontaura.com/vino/vino-tinto-aponte-reserva/',
  },
] as const;
export type Wine = (typeof wines)[number];
export const visits = {
  nexus: { name: 'Nexus · Pesquera de Duero', url: 'https://www.bodegasnexus.com/enoturismo-bodegas-nexus/' },
  frontaura: { name: 'Frontaura & Victoria · Toro', url: 'https://www.bodegasfrontaura.com/enoturismo/' },
} as const;
