
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

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

function normText(s: unknown): string {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function normPhone(p?: string): string | undefined {
  if (!p) return undefined;
  const trimmed = String(p).trim();
  if (trimmed.startsWith("+")) {
    const rest = trimmed.slice(1).replace(/\D+/g, "");
    return rest ? `+${rest}` : undefined;
  }
  const digits = trimmed.replace(/\D+/g, "");
  return digits || undefined;
}

function normEmail(e?: string): string | undefined {
  if (!e) return undefined;
  const v = String(e).trim().toLowerCase();
  return v || undefined;
}


export function buildContactDraft(input: {
  companyName: string;
  name: string;
  phone?: string | undefined;
  email?: string | undefined;
  occupation?: string | undefined;
  product?: string | undefined;
  address?: string | undefined;
  lastContact?: string | undefined;
}): ContactDraft {
  const companyName = normText(input.companyName);
  const name = normText(input.name);

  if (!companyName) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Company name must not be empty",
      {
        details: { field: "companyName" },
      }
    );
  }
  if (!name) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Contact name must not be empty",
      {
        details: { field: "name" },
      }
    );
  }

  const draft: ContactDraft = {
    companyName,
    name,
    phone: normPhone(input.phone),
    email: normEmail(input.email),
    occupation: normText(input.occupation),
    product: normText(input.product),
    address: normText(input.address),
    lastContact: normText(input.lastContact) || undefined,
  };

  return draft;
}
