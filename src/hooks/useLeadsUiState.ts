import { useState } from 'react';

import type { Lead } from '@/leads';

export function useLeadsUiState() {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isCreateLocalOpen, setCreateLocalOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  return {
        isCreateOpen, isCreateLocalOpen, isEditOpen, editingLead,
        openCreate: () => setCreateOpen(true),
    closeCreate: () => setCreateOpen(false),
    openCreateLocal: () => setCreateLocalOpen(true),
    closeCreateLocal: () => setCreateLocalOpen(false),
    openEdit: (lead: Lead) => { setEditingLead(lead); setEditOpen(true); },
    closeEdit: () => { setEditOpen(false); setEditingLead(null); },
  };
}
