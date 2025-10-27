import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useLeadsApp } from '@/di';
import type { CreateLeadInput, Lead } from '@/leads';
import { createLead as ucCreateLead,leadsKeys } from '@/leads';

export function useCreateLead() {
  const ctx = useLeadsApp();
  const qc = useQueryClient();

  return useMutation<Lead, Error, CreateLeadInput>({
    mutationFn: (input) => ucCreateLead(ctx, input),
    onSuccess: (created) => {
      const key = leadsKeys.byType(created.leadType);
      qc.setQueryData<Lead[]>(key, (prev = []) => {
        const withoutDup = prev.filter((l) => l.id !== created.id);
        return [created, ...withoutDup];
      });
      qc.invalidateQueries({ queryKey: leadsKeys.all });
    },
  });
}
