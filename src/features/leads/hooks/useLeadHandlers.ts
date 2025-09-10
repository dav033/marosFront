import { useCallback, useMemo } from "react";
import type { Lead } from "src/types";
import { LeadAgent } from "src/features/leads/agent/LeadAgent";
import { LeadEventBus } from "src/features/leads/agent/LeadEvents";

export function useLeadHandlers({
  onCreated,
  onUpdated,
  onDeleted,
}: {
  onCreated?: (lead: Lead) => void;
  onUpdated: (lead: Lead) => void;
  onDeleted: (id: number) => void;
}) {
  const bus = useMemo(() => new LeadEventBus(), []);
  const agent = useMemo(() => new LeadAgent(bus), [bus]);

  // UPDATE
  const handleLeadUpdated = useCallback(async (payload: Lead) => {
    const result = await agent.update(payload);
    const updatedLead = result ?? payload; // si API devuelve 204, use merge local con payload
    onUpdated(updatedLead);
    bus.emit({ type: "LEAD_UPDATED", payload: updatedLead });
  }, [agent, onUpdated, bus]);

  // DELETE
  const handleLeadDeleted = useCallback(async (lead: Lead) => {
    if (lead?.id == null || lead.id === undefined) {
      console.error("Invalid lead or lead.id received:", lead);
      return;
    }
    await agent.remove(lead.id);
    onDeleted(lead.id);
    bus.emit({ type: "LEAD_DELETED", payload: { id: lead.id } });
  }, [agent, onDeleted, bus]);

  // Opcional: CREATE centralizado
  const handleLeadCreated = useCallback(async (creationPayload: unknown) => {
    const created = await agent.create(creationPayload);
    onCreated?.(created);
    bus.emit({ type: "LEAD_CREATED", payload: created });
  }, [agent, onCreated, bus]);

  return { handleLeadCreated, handleLeadUpdated, handleLeadDeleted };
}
