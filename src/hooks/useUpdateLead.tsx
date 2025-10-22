// src/features/leads/application/hooks/useUpdateLead.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLeadsApp } from '@/di/DiProvider';
import type { Lead } from '@/features/leads/domain/models/Lead';
import { leadsKeys } from '@/features/leads/application/keys/leadsKeys';
import type { LeadPatch } from '@/features/leads/domain';
import { patchLead } from '@/features/leads/application/usecases/commands/patchLead';

export function useUpdateLead() {
  const ctx = useLeadsApp();
  const qc = useQueryClient();

  return useMutation<Lead, Error, { id: Lead['id']; patch: LeadPatch }>({
    mutationFn: ({ id, patch }) => patchLead(ctx, id, patch),
    onSuccess: (saved) => {
      // Actualiza todas las listas por tipo
      qc.setQueriesData<Lead[]>(
        { queryKey: leadsKeys.all, exact: false },
        (prev) => (Array.isArray(prev) ? prev.map(l => l.id === saved.id ? saved : l) : prev)
      );
      // Si cambió de tipo, aseguras mover entre caches:
      const allTypesKeys = qc.getQueryCache().findAll({ queryKey: leadsKeys.all });
      for (const entry of allTypesKeys) {
        qc.invalidateQueries({ queryKey: entry.queryKey });
      }
    },
  });
}
