import {
  createContact,
  deleteContact,
  getContactById,
  listContacts,
  patchContact,
  validateContactUniqueness,
} from "@/features/contact/application";
import type { ContactUniquenessCheck } from "@/features/contact/domain/ports/ContactUniquenessPort";
import type { ContactPatch } from "@/features/contact/domain/services/applyContactPatch";
import type { ContactDraft } from "@/features/contact/domain/services/buildContactDraft";

import { useContactsApp } from "../../di/DiProvider.tsx";

export function useContactsApplication() {
  const ctx = useContactsApp();

  return {
    list: () => listContacts(ctx),
    getById: (id: number) => getContactById(ctx, id),
    patch: (id: number, patch: ContactPatch) => patchContact(ctx, id, patch),
    remove: (id: number) => deleteContact(ctx, id),
    findAll: () => listContacts(ctx),
    findById: (id: number) => getContactById(ctx, id),
    create: (draft: ContactDraft) => createContact(ctx, draft),
    update: (id: number, patch: ContactPatch) => patchContact(ctx, id, patch),
    delete: (id: number) => deleteContact(ctx, id),

    validateUniqueness: (candidate: ContactUniquenessCheck) =>
      validateContactUniqueness(ctx, candidate),
  };
}
