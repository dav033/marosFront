import { useCallback, useMemo } from "react";
import type { Lead } from "src/types";
import { LeadAgent } from "src/features/leads/agent/LeadAgent";
import { LeadEventBus } from "src/features/leads/agent/LeadEvents";

export function useLeadHandlers(refetchLeads: () => void) {
  const bus = useMemo(() => new LeadEventBus(), []);
  const agent = useMemo(() => new LeadAgent(bus), [bus]);

  // Suscripción simple: ante cualquier evento relevante, forzar refetch.
  // Si luego desea manejar cache optimista real, puede extender aquí.
  useMemo(
    () =>
      bus.on((e) => {
        if (e.type === "REFETCH_REQUESTED") refetchLeads();
      }),
    [bus, refetchLeads]
  );

  const handleLeadCreated = useCallback(
    async (newLead: Omit<Lead, "id">) => {
      await agent.create(newLead);
    },
    [agent]
  );

  const handleLeadUpdated = useCallback(
    async (lead: Lead) => {
      await agent.update(lead);
    },
    [agent]
  );

  const handleLeadDeleted = useCallback(
    async (leadId: number) => {
      try {
        await agent.remove(leadId);
      } catch (err) {
        // TODO: Integrar toast/notification centralizado
        console.error("Error deleting lead:", err);
      }
    },
    [agent]
  );

  return { handleLeadCreated, handleLeadUpdated, handleLeadDeleted };
}
