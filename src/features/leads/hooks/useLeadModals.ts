import { useMemo, useState } from "react";
import type { Lead } from "src/types";

export function useLeadModals() {
  const [state, set] = useState<{
    isCreateOpen: boolean;
  isCreateLocalOpen: boolean;
    isEditOpen: boolean;
    editingLead: Lead | null;
  }>({
    isCreateOpen: false,
  isCreateLocalOpen: false,
    isEditOpen: false,
    editingLead: null,
  });

  const handlers = useMemo(
    () => ({
  openCreate: () => set((p) => ({ ...p, isCreateOpen: true })),
  closeCreate: () => set((p) => ({ ...p, isCreateOpen: false })),
  openCreateLocal: () => set((p) => ({ ...p, isCreateLocalOpen: true })),
  closeCreateLocal: () => set((p) => ({ ...p, isCreateLocalOpen: false })),
      openEdit: (lead: Lead) =>
        set((p) => ({ ...p, isEditOpen: true, editingLead: lead })),
      closeEdit: () =>
        set((p) => ({ ...p, isEditOpen: false, editingLead: null })),
    }),
    []
  );

  return { modals: state, ...handlers };
}
