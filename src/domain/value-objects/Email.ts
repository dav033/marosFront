import type { Branded } from './branding';

export type Email = Branded<string, 'Email'>;

export function asEmail(input: string): Email {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) throw new Error('INVALID_EMAIL');
  return input as Email;
}