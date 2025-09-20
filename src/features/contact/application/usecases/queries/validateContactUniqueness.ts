import type { ContactsAppContext } from "../../context";
import type { ContactUniquenessCheck } from "@/features/contact/domain/ports/ContactUniquenessPort";
import { isDuplicateContact } from "@/features/contact/domain/services/contactUniquenessPolicy";
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

/**
 * Consulta de unicidad/duplicados:
 * - Si existe puerto de unicidad → lo usa.
 * - Si no, cae a política pura comparando contra todos los contactos (repo.getAll()).
 */
export async function validateContactUniqueness(
  ctx: ContactsAppContext,
  candidate: ContactUniquenessCheck
): Promise<{ duplicate: boolean; conflictId?: number }> {
  // 1) Backend (si está disponible)
  if (ctx.ports?.uniqueness) {
    return ctx.ports.uniqueness.isDuplicate(candidate);
  }

  // 2) Fallback local (política pura)
  const all = await ctx.repos.contact.getAll();
  const { duplicate, match } = isDuplicateContact(candidate, all, {});
  return duplicate ? { duplicate: true, conflictId: (match as any)?.id } : { duplicate: false };
}
