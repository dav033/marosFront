// src/features/leads/application/hooks/useCreateLead.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useLeadsApp } from '@/di';
import type { CreateLeadInput } from '@/leads';
import type { Lead } from '@/leads';
import { createLead as ucCreateLead,leadsKeys } from '@/leads';

export function useCreateLead() {
  const ctx = useLeadsApp();
  const qc = useQueryClient();

  return useMutation<Lead, Error, CreateLeadInput>({
    mutationFn: (input) => ucCreateLead(ctx, input), // ⟵ pasa ctx
    onSuccess: (created) => {
      const key = leadsKeys.byType(created.leadType); // ⟵ mismo enum
      qc.setQueryData<Lead[]>(key, (prev) => {
        const list = prev ?? [];
        const withoutDup = list.filter((l) => l.id !== created.id);
        return [created, ...withoutDup];
      });
    },
  });
}
