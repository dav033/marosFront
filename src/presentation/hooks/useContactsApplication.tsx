import { useContactsApp } from "../../di/DiProvider.tsx";
import {
  listContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact,
  validateContactUniqueness,
} from "@/features/contact/application";
import type { Contacts } from "@/features/contact/domain/models/Contact";
import type { ContactDraft } from "@/features/contact/domain/services/buildContactDraft";
import type { ContactPatch } from "@/features/contact/domain/services/applyContactPatch";
import type { ContactUniquenessCheck } from "@/features/contact/domain/ports/ContactUniquenessPort";

export function useContactsApplication() {
  const ctx = useContactsApp();

  return {
    list: () => listContacts(ctx),
    getById: (id: number) => getContactById(ctx, id),
    create: (draft: ContactDraft) => createContact(ctx, draft),
    patch: (id: number, patch: ContactPatch) => patchContact(ctx, id, patch),
    remove: (id: number) => deleteContact(ctx, id),
    validateUniqueness: (candidate: ContactUniquenessCheck) =>
      validateContactUniqueness(ctx, candidate),
  };
}
