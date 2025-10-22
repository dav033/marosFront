import type { Lead } from '@/features/leads/domain/models/Lead';
import { useState } from 'react';

export function useLeadsUiState() {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isCreateLocalOpen, setCreateLocalOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  return {
    // state
    isCreateOpen, isCreateLocalOpen, isEditOpen, editingLead,
    // actions
    openCreate: () => setCreateOpen(true),
    closeCreate: () => setCreateOpen(false),
    openCreateLocal: () => setCreateLocalOpen(true),
    closeCreateLocal: () => setCreateLocalOpen(false),
    openEdit: (lead: Lead) => { setEditingLead(lead); setEditOpen(true); },
    closeEdit: () => { setEditOpen(false); setEditingLead(null); },
  };
}
