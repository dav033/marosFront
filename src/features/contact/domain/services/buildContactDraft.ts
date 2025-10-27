import { BusinessRuleError } from '@/shared';
import { normalizeEmail, normalizePhone, normalizeText } from '@/shared';

export type ContactDraft = Readonly<{
  companyName: string;
  name: string;
  phone?: string | undefined;
  email?: string | undefined;
  occupation?: string | undefined;
  product?: string | undefined;
  address?: string | undefined;
  lastContact?: string | undefined;
}>;

type ContactInput = {
  companyName?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  occupation?: unknown;
  product?: unknown;
  address?: unknown;
  lastContact?: unknown;
};

export function buildContactDraft(input: unknown): ContactDraft {
  const src = (input ?? {}) as ContactInput;

  const companyName = normalizeText(src.companyName);
  const name = normalizeText(src.name);

  if (!companyName) {
    throw new BusinessRuleError(
      'VALIDATION_ERROR',
      'Company name must not be empty',
      {
        details: { field: 'companyName' },
      },
    );
  }
  if (!name) {
    throw new BusinessRuleError(
      'VALIDATION_ERROR',
      'Contact name must not be empty',
      {
        details: { field: 'name' },
      },
    );
  }

  return {
    companyName,
    name,
    phone: normalizePhone(src.phone as string | undefined),
    email: normalizeEmail(src.email as string | undefined),
    occupation: normalizeText(src.occupation) || undefined,
    product: normalizeText(src.product) || undefined,
    address: normalizeText(src.address) || undefined,
    lastContact: normalizeText(src.lastContact) || undefined,
  };
}
