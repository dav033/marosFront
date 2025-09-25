// src/features/contact/application/usecases/commands/createContact.ts

import type { ContactsAppContext } from "@/features/contact/application";
import type { Contact } from "@/features/contact/domain/models/Contact";
import type { ContactDraft } from "@/features/contact/domain/services/buildContactDraft";
import {
  mapContactDraftToCreatePayload,
  type CreateContactRequestDTO,
} from "@/features/contact/domain/services/mapContactDraftToCreatePayload";

/**
 * Caso de uso: crear contacto con ContactsAppContext.
 * - Normaliza DTO con builder unificado (vía wrapper de compatibilidad).
 * - Delegación al repositorio HTTP del contexto.
 */
export async function createContact(
  ctx: ContactsAppContext,
  draft: ContactDraft
): Promise<Contact> {
  const payload: CreateContactRequestDTO = mapContactDraftToCreatePayload(draft);
  return ctx.repos.contact.create(payload);
}
