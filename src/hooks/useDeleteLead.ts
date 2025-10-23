// src/presentation/hooks/useDeleteLead.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useLeadsApp } from "@/di";
import type { Lead, LeadType } from "@/leads";
import { deleteLead as ucDeleteLead } from "@/leads";

/** Lo usamos para saber qué lista invalidar/actualizar */
export type DeleteLeadInput = Readonly<{ id: Lead["id"]; currentType: LeadType }>;

export function useDeleteLead() {
  const ctx = useLeadsApp(); // ← DI: fuente única de verdad
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteLeadInput>({
    mutationFn: ({ id }) => ucDeleteLead(ctx, id), // ← pasa (ctx, id)
    onSuccess: (_void, { id, currentType }) => {
      // Limpieza optimista de la lista por tipo
      queryClient.setQueryData<Lead[] | undefined>(
        ["leads", "byType", currentType],
        (prev) => (Array.isArray(prev) ? prev.filter((l) => l.id !== id) : prev)
      );
      // Seguridad: invalidar resúmenes/otras vistas
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
