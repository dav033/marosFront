// src/features/leads/application/hooks/useCreateLead.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLeadsApp } from '@/di/DiProvider';
import { leadsKeys } from '@/features/leads/application/keys/leadsKeys';
import type { Lead } from '@/features/leads/domain/models/Lead';
import {
  createLead as ucCreateLead,
  type CreateLeadInput,
} from '@/features/leads/application/usecases/commands/createLead';

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
