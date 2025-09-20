// src/features/contact/application/usecases/commands/patchContact.ts
import type { ContactsAppContext } from "../../context";
import type { Contacts } from "@/features/contact/domain/models/Contact";
import {
  applyContactPatch,
  type ContactPatch,
  type ApplyContactPatchResult,
} from "@/features/contact/domain/services/applyContactPatch";
import { mapContactPatchToUpdatePayload } from "@/features/contact/domain/services/mapContactToUpdatePayload";
import { getContactById } from "../queries/getContactById";
import type { ContactDraftPolicies } from "@/features/contact/domain/services/ensureContactDraftIntegrity";

/** Calcula el patch mínimo entre el estado actual y el actualizado por dominio (sin mutar). */
function diffToPatch(current: Contacts, updated: Contacts): ContactPatch {
  const patch: ContactPatch = {
    ...(updated.companyName !== current.companyName
      ? { companyName: updated.companyName }
      : {}),
    ...(updated.name !== current.name ? { name: updated.name } : {}),
    ...((updated.phone ?? "") !== (current.phone ?? "")
      ? { phone: updated.phone ?? undefined }
      : {}),
    ...((updated.email ?? "") !== (current.email ?? "")
      ? { email: updated.email ?? undefined }
      : {}),
    ...((updated.occupation ?? "") !== (current.occupation ?? "")
      ? { occupation: updated.occupation ?? undefined }
      : {}),
    ...((updated.product ?? "") !== (current.product ?? "")
      ? { product: updated.product ?? undefined }
      : {}),
    ...((updated.address ?? "") !== (current.address ?? "")
      ? { address: updated.address ?? undefined }
      : {}),
    ...((updated.lastContact ?? "") !== (current.lastContact ?? "")
      ? { lastContact: updated.lastContact ?? undefined }
      : {}),
  };
  return patch;
}

/**
 * Aplica patch en dominio (normaliza/valida) y persiste por repositorio.
 */
export async function patchContact(
  ctx: ContactsAppContext,
  id: number,
  patch: ContactPatch,
  policies: ContactDraftPolicies = {}
): Promise<Contacts> {
  const current = await getContactById(ctx, id);

  // Dominio: normaliza/valida y devuelve nueva versión + eventos (no usados aquí)
  const { contact: updated }: ApplyContactPatchResult = applyContactPatch(
    current,
    patch,
    policies
  );

  // Patch mínimo efectivo
  const normalizedPatch = diffToPatch(current, updated);

  // Mapeo a DTO y persistencia
  const dto = mapContactPatchToUpdatePayload(normalizedPatch);
  const saved = await ctx.repos.contact.update(id, dto);

  return saved;
}
