import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useLeadsApp } from '@/di';
import type { Lead, LeadPatch } from '@/leads';
import { leadsKeys, patchLead } from '@/leads';

export function useUpdateLead() {
  const ctx = useLeadsApp();
  const qc = useQueryClient();

  return useMutation<Lead, Error, { id: Lead['id']; patch: LeadPatch }>({
    mutationFn: ({ id, patch }) => patchLead(ctx, id, patch),
    onSuccess: (saved) => {
      // Actualiza listas que empiezan por 'leads'
      qc.setQueriesData<Lead[]>(
        { queryKey: leadsKeys.all, exact: false },
        (prev) =>
          Array.isArray(prev) ? prev.map((l) => (l.id === saved.id ? saved : l)) : prev
      );

      // Invalida todas las queries bajo 'leads' (por si cambió de tipo/estado)
      const entries = qc.getQueryCache().findAll({ queryKey: leadsKeys.all });
      for (const entry of entries) {
        qc.invalidateQueries({ queryKey: entry.queryKey });
      }
    },
  });
}
  