import type { ContactUniquenessCheck } from "@/contact";
import type { ContactsAppContext } from "@/contact";
import { isDuplicateContact } from "@/contact";

export async function validateContactUniqueness(
  ctx: ContactsAppContext,
  candidate: ContactUniquenessCheck
): Promise<{ duplicate: boolean; conflictId?: number }> {
  if (ctx.ports?.uniqueness) {
    return ctx.ports.uniqueness.isDuplicate(candidate);
  }
  const all = await ctx.repos.contact.findAll();
  const { duplicate, match } = isDuplicateContact(candidate, all, {});
  if (!duplicate) return { duplicate: false };
  const id = (match as Partial<{ id?: number }>)?.id;
  return id === undefined ? { duplicate: true } : { duplicate: true, conflictId: id };
}
