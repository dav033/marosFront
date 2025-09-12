import type { Branded } from './branding';

export type LocalDateString = Branded<string, 'LocalDateString'>;

export function asLocalDateString(input: string): LocalDateString {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) throw new Error('INVALID_LOCAL_DATE');
  return input as LocalDateString;
}