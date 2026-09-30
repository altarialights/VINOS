import source from '../../ladera-handoff/spec/content.json';
export const content = source;
export type Chapter = (typeof source.chapters)[number];
export const ui = {
  nav: [{ href: '#origen', label: 'Origen' }, { href: '#uva', label: 'La uva' }, { href: '#nariz', label: 'Matices' }, { href: '#cata', label: 'Visítanos' }],
  chapterLabels: ['El paisaje', 'El origen', 'La uva', 'En nariz', 'En boca'],
  demoTitle: 'Modo demostración',
  checkoutDemo: 'Demostración: no hay precio, stock o tienda conectados. No se ha creado ningún pedido.',
  retailersEmpty: 'Todavía no hay puntos de venta verificados en esta demostración.',
  networkError: 'No se ha podido completar la consulta. Inténtalo de nuevo.',
  noSlots: 'No hay horarios disponibles para esta selección. Prueba otra fecha.',
  dateError: 'Elige una fecha válida, a partir de hoy.',
  personsError: 'Indica un número entero de personas entre 1 y 12.',
  quantityError: 'Indica una cantidad entera entre 1 y 12.',
  footer: 'LADERA · CONCEPTO DE DEMOSTRACIÓN',
};
