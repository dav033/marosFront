import type { ContactsAppContext } from "../../context";
import type { Contacts } from "@/features/contact/domain/models/Contact";
import {
  buildContactDraft,
  type ContactDraft,
} from "@/features/contact/domain/services/buildContactDraft";
import { ensureContactDraftIntegrity } from "@/features/contact/domain/services/ensureContactDraftIntegrity";
import { mapContactDraftToCreatePayload } from "@/features/contact/domain/services/mapContactDraftToCreatePayload";

/**
 * Crea un contacto:
 * - Normaliza + valida draft en dominio
 * - Mapea a DTO
 * - Persiste por repositorio
 */
export async function createContact(
  ctx: ContactsAppContext,
  input: ContactDraft
): Promise<Contacts> {
  // (Si el input viniera “crudo” desde UI, podrías llamar buildContactDraft(inputRaw))
  const draft = buildContactDraft(input);
  ensureContactDraftIntegrity(draft);

  // (Opcional) Chequeo de duplicados previo
  if (ctx.ports?.uniqueness) {
    const { duplicate, conflictId } = await ctx.ports.uniqueness.isDuplicate({
      name: draft.name,
      companyName: draft.companyName,
      email: draft.email,
      phone: draft.phone,
    });
    if (duplicate) {
      throw new Error(`Duplicate contact detected${conflictId ? ` (id ${conflictId})` : ""}`);
    }
  }

  const payload = mapContactDraftToCreatePayload(draft);
  return ctx.repos.contact.create(payload);
}
