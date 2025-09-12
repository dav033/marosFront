import type { Branded } from './branding';

export type LocalDateTimeString = Branded<string, 'LocalDateTimeString'>;

export function asLocalDateTimeString(input: string): LocalDateTimeString {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(input)) throw new Error('INVALID_LOCAL_DATETIME');
  return input as LocalDateTimeString;
}