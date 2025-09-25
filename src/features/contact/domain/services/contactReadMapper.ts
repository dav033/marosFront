// src/features/contact/domain/services/contactReadMapper.ts

import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

import type { Contact } from "../models/Contact";
import { ensureContactIntegrity } from "./ensureContactIntegrity";

/** DTO flexible de la API; muchos campos pueden venir opcionales o null */
export type ApiContactDTO = Readonly<{
  id: number;
  companyName?: string | null;
  name?: string | null;
  occupation?: string | null;
  product?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  /** ISO 8601 opcional */
  lastContact?: string | null;
}>;

/* Utils */
function norm(s: unknown): string {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Mapea UN contacto DTO → dominio y valida integridad */
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

  // Validación de agregado
  ensureContactIntegrity(contact);
  return contact;
}

/** Lista de DTOs → lista de dominio (fail-fast en primer error) */
export function mapContactsFromDTO(
  list?: readonly ApiContactDTO[] | null
): Contact[] {
  const src = Array.isArray(list) ? list : [];
  return src.map(mapContactFromDTO);
}
