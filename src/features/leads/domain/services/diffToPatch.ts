import type { ISODate, Lead, LeadPatch } from "@/leads";

/**
 * Devuelve un LeadPatch con solo los campos que cambiaron.
 * Nota: incluye leadNumber si cambió (consistente con el diff actual).
 */
export function diffToPatch(current: Lead, updated: Lead): LeadPatch {
  return {
    ...(updated.name !== current.name ? { name: updated.name } : {}),
    ...((updated.location ?? '') !== (current.location ?? '')
      ? { location: updated.location ?? '' }
      : {}),
    ...(updated.status !== current.status ? { status: updated.status } : {}),
    ...(updated.startDate !== current.startDate
      ? { startDate: updated.startDate as ISODate }
      : {}),
    ...(updated.projectType.id !== current.projectType.id
      ? { projectTypeId: updated.projectType.id }
      : {}),
    ...(updated.contact.id !== current.contact.id
      ? { contactId: updated.contact.id }
      : {}),
    ...((updated.leadNumber ?? '') !== (current.leadNumber ?? '')
      ? { leadNumber: updated.leadNumber ? Number(updated.leadNumber) : null }
      : {}),
  };
}
