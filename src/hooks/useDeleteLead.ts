import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useLeadsApp } from '@/di';
import type { Lead, LeadType } from '@/leads';
import { deleteLead as ucDeleteLead,leadsKeys } from '@/leads';

export type DeleteLeadInput = Readonly<{
  id: Lead['id'];
  currentType: LeadType;
}>;

export function useDeleteLead() {
  const ctx = useLeadsApp();
  const qc = useQueryClient();

  return useMutation<void, Error, DeleteLeadInput>({
    mutationFn: ({ id }) => ucDeleteLead(ctx, id),
    onSuccess: (_void, { id, currentType }) => {
      qc.setQueryData<Lead[] | undefined>(
        leadsKeys.byType(currentType),
        (prev) => (Array.isArray(prev) ? prev.filter((l) => l.id !== id) : prev),
      );
      qc.invalidateQueries({ queryKey: leadsKeys.all });
    },
  });
}
