import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLeadsApp } from '@/di';
import { deleteLead as ucDeleteLead } from '@/leads';
import type { Lead, LeadType } from '@/leads';

export type DeleteLeadInput = Readonly<{
  id: Lead['id'];
  currentType: LeadType;
}>;

export function useDeleteLead() {
  const ctx = useLeadsApp();
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteLeadInput>({
    mutationFn: ({ id }) => ucDeleteLead(ctx, id),
    onSuccess: (_void, { id, currentType }) => {
      queryClient.setQueryData<Lead[] | undefined>(
        ['leads', 'byType', currentType],
        (prev) =>
          Array.isArray(prev) ? prev.filter((l) => l.id !== id) : prev,
      );
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
