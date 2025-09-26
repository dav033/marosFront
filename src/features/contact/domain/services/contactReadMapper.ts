
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

import type { Contact } from "../models/Contact";
import { ensureContactIntegrity } from "./ensureContactIntegrity";

export type ApiContactDTO = Readonly<{
  id: number;
  companyName?: string | null;
  name?: string | null;
  occupation?: string | null;
  product?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
    lastContact?: string | null;
}>;

/* Utils */
function norm(s: unknown): string {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function mapContactFromDTO(dto: ApiContactDTO): Contact {
  if (!dto)
    throw new BusinessRuleError("NOT_FOUND", "Contact payload is empty");

  const contact: Contact = {
    id: dto.id,
    companyName: norm(dto.companyName),
    name: norm(dto.name),
    occupation: norm(dto.occupation) || undefined,
    product: norm(dto.product) || undefined,
    phone: norm(dto.phone) || undefined,
    email: norm(dto.email) || undefined,
    address: norm(dto.address) || undefined,
    lastContact: norm(dto.lastContact) || undefined,
  };
  ensureContactIntegrity(contact);
  return contact;
}

export function mapContactsFromDTO(
  list?: readonly ApiContactDTO[] | null
): Contact[] {
  const src = Array.isArray(list) ? list : [];
  return src.map(mapContactFromDTO);
}
