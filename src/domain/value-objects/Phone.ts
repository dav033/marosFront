import type { Branded } from './branding';

export type Phone = Branded<string, 'Phone'>;

export function asPhone(input: string): Phone {
  if (!/^[+()\d\s-]{6,20}$/.test(input)) throw new Error('INVALID_PHONE');
  return input as Phone;
}