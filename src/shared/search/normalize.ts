export const defaultNormalize = (s: string) =>
  (s ?? '')
    .toString()
    .trim()
    .toLowerCase()
    // elimina acentos/diacríticos
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
