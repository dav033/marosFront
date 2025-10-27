import type { Contact } from "@/contact";
import { BusinessRuleError, normalizeText } from "@/shared";

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

export function mapContactFromDTO(dto: ApiContactDTO): Contact {
  if (!dto) throw new BusinessRuleError("NOT_FOUND", "Contact payload is empty");

  const contact: Contact = {
    id: dto.id,
    companyName: normalizeText(dto.companyName),
    name: normalizeText(dto.name),
    occupation: normalizeText(dto.occupation) || undefined,
    product: normalizeText(dto.product) || undefined,
    phone: normalizeText(dto.phone) || undefined,
    email: normalizeText(dto.email) || undefined,
    address: normalizeText(dto.address) || undefined,
    lastContact: normalizeText(dto.lastContact) || undefined,
  };

  ensureContactIntegrity(contact);
  return contact;
}

export function mapContactsFromDTO(list?: readonly ApiContactDTO[] | null): Contact[] {
  const src = Array.isArray(list) ? list : [];
  return src.map(mapContactFromDTO);
}
