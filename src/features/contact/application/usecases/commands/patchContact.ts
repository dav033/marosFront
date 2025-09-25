// src/features/contact/application/usecases/commands/patchContact.ts

import type { ContactsAppContext } from "@/features/contact/application";
import type { Contact } from "@/features/contact/domain/models/Contact";
import type { ContactPatch } from "@/features/contact/domain/services/applyContactPatch";
import {
  mapContactToUpdatePayload,
  type UpdateContactRequestDTO,
} from "@/features/contact/domain/services/mapContactToUpdatePayload";

/**
 * Caso de uso: actualizar contacto (patch).
 * - Si no hay cambios, devuelve el contacto actual sin llamar a update.
 */
export async function patchContact(
  ctx: ContactsAppContext,
  contactId: number,
  patch: ContactPatch
): Promise<Contact> {
  const payload: UpdateContactRequestDTO = mapContactToUpdatePayload(patch);

  if (Object.keys(payload).length === 0) {
    // Nota: su repositorio expone findById (no getById)
    const current = await ctx.repos.contact.findById(contactId);
    if (!current) {
      throw new Error(`Contact ${contactId} not found`);
    }
    return current;
  }

  return ctx.repos.contact.update(contactId, payload);
}
