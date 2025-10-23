import type {
  Contact,
  ContactDraft,
  ContactPatch,
  ContactUniquenessCheck,
} from "@/contact";
import {
  createContact,
  deleteContact,
  getContactById,
  listContacts,
  mergeContactIntoCollection,
  patchContact,
  validateContactUniqueness,
} from "@/contact";
import { useContactsApp } from "@/di";
import { queryClient } from "@/lib";

export function useContactsApplication() {
  const ctx = useContactsApp();

  const upsertCache = (entity: Contact) => {
    queryClient.setQueryData<Contact[]>(["contacts", "list"], (prev) => {
      const curr = Array.isArray(prev) ? prev : [];
      return mergeContactIntoCollection(curr, entity);
    });
  };

  const removeFromCache = (id: number) => {
    queryClient.setQueryData<Contact[]>(["contacts", "list"], (prev) => {
      const curr = Array.isArray(prev) ? prev : [];
      return curr.filter((c) => c.id !== id);
    });
  };

  return {
    // Lecturas
    list: () => listContacts(ctx),
    getById: (id: number) => getContactById(ctx, id),
    findAll: () => listContacts(ctx),
    findById: (id: number) => getContactById(ctx, id),

    // Altas / modificaciones con sincronización de caché
    create: async (draft: ContactDraft) => {
      const created = await createContact(ctx, draft);
      if (created) upsertCache(created as Contact);
      return created;
    },
    update: async (id: number, patch: ContactPatch) => {
      const updated = await patchContact(ctx, id, patch);
      if (updated) upsertCache(updated as Contact);
      return updated;
    },
    patch: async (id: number, patch: ContactPatch) => {
      const updated = await patchContact(ctx, id, patch);
      if (updated) upsertCache(updated as Contact);
      return updated;
    },

    // Borrado con sincronización de caché
    delete: async (id: number) => {
      await deleteContact(ctx, id);
      removeFromCache(id);
    },
    remove: async (id: number) => {
      await deleteContact(ctx, id);
      removeFromCache(id);
    },

    // Validaciones
    validateUniqueness: (candidate: ContactUniquenessCheck) =>
      validateContactUniqueness(ctx, candidate),
  };
}
