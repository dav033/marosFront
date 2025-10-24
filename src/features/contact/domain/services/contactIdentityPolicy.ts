import type { Contact } from '@/contact';
import {
  normalizeText,
  normalizeLower,
  normalizeEmail,
  normalizePhone,
} from '@/shared';

export type DuplicateCheckOptions = Readonly<{
  useCompany?: boolean;
  useName?: boolean;
  useEmail?: boolean;
  usePhone?: boolean;
}>;

export function normalizeName(v?: string): string | undefined {
  const out = normalizeText(v);
  return out || undefined;
}

export function normalizeCompany(v?: string): string | undefined {
  const out = normalizeLower(v);
  return out || undefined;
}

export { normalizeEmail, normalizePhone };

export function makeContactIdentityKey(
  c: Pick<Contact, 'companyName' | 'name' | 'email' | 'phone'>,
  opts: DuplicateCheckOptions = {},
): string {
  const o = {
    useCompany: true,
    useName: true,
    useEmail: true,
    usePhone: true,
    ...opts,
  };
  const parts = [
    o.useCompany ? (normalizeCompany(c.companyName) ?? '') : '',
    o.useName ? (normalizeName(c.name) ?? '') : '',
    o.useEmail ? (normalizeEmail(c.email) ?? '') : '',
    o.usePhone ? (normalizePhone(c.phone) ?? '') : '',
  ];
  return parts.filter(Boolean).join('|');
}

export function areContactsPotentialDuplicates(
  a: Contact,
  b: Contact,
  opts: DuplicateCheckOptions = {},
): boolean {
  return makeContactIdentityKey(a, opts) === makeContactIdentityKey(b, opts);
}
