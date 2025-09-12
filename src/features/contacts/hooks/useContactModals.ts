import { useMemo, useState } from "react";
import type { Contacts } from "src/types";

export function useContactModals() {
  const [state, set] = useState<{
    isCreateOpen: boolean;
    isEditOpen: boolean;
    editingContact: Contacts | null;
  }>({
    isCreateOpen: false,
    isEditOpen: false,
    editingContact: null,
  });

  const handlers = useMemo(
    () => ({
      openCreate: () => set((p) => ({ ...p, isCreateOpen: true })),
      closeCreate: () => set((p) => ({ ...p, isCreateOpen: false })),
      openEdit: (contact: Contacts) =>
        set((p) => ({ ...p, isEditOpen: true, editingContact: contact })),
      closeEdit: () =>
        set((p) => ({ ...p, isEditOpen: false, editingContact: null })),
    }),
    []
  );

  return { modals: state, ...handlers };
}
