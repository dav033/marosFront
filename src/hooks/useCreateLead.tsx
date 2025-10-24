import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLeadsApp } from '@/di';
import { leadsKeys, createLead as ucCreateLead } from '@/leads';
import type { CreateLeadInput } from '@/leads';
import type { Lead } from '@/leads';

export function useCreateLead() {
  const ctx = useLeadsApp();
  const qc = useQueryClient();

  return useMutation<Lead, Error, CreateLeadInput>({
    mutationFn: (input) => ucCreateLead(ctx, input),     onSuccess: (created) => {
      const key = leadsKeys.byType(created.leadType);       qc.setQueryData<Lead[]>(key, (prev) => {
        const list = prev ?? [];
        const withoutDup = list.filter((l) => l.id !== created.id);
        return [created, ...withoutDup];
      });
    },
  });
}
