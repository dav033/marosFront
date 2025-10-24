import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLeadsApp } from '@/di';
import { leadsKeys, patchLead } from '@/leads';
import type { Lead, LeadPatch } from '@/leads';

export function useUpdateLead() {
  const ctx = useLeadsApp();
  const qc = useQueryClient();

  return useMutation<Lead, Error, { id: Lead['id']; patch: LeadPatch }>({
    mutationFn: ({ id, patch }) => patchLead(ctx, id, patch),
    onSuccess: (saved) => {
            qc.setQueriesData<Lead[]>(
        { queryKey: leadsKeys.all, exact: false },
        (prev) => (Array.isArray(prev) ? prev.map(l => l.id === saved.id ? saved : l) : prev)
      );
            const allTypesKeys = qc.getQueryCache().findAll({ queryKey: leadsKeys.all });
      for (const entry of allTypesKeys) {
        qc.invalidateQueries({ queryKey: entry.queryKey });
      }
    },
  });
}
