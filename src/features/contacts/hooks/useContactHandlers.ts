import { useCallback, useMemo } from "react";
import type { Contacts, CreateContactRequest } from "src/types";
import { ContactAgent } from "../agent/ContactAgent";
import { ContactEventBus } from "../agent/ContactEvents";

export function useContactHandlers({
  onCreated,
  onUpdated,
  onDeleted,
}: {
  onCreated?: (contact: Contacts) => void;
  onUpdated: (contact: Contacts) => void;
  onDeleted: (id: number) => void;
}) {
  const bus = useMemo(() => new ContactEventBus(), []);
  const agent = useMemo(() => new ContactAgent(bus), [bus]);

  // UPDATE
  const handleContactUpdated = useCallback(async (payload: Contacts) => {
    const result = await agent.update(payload);
    const updatedContact = result ?? payload; // si API devuelve 204, use merge local con payload
    onUpdated(updatedContact);
    bus.emit({ type: "CONTACT_UPDATED", payload: updatedContact });
  }, [agent, onUpdated, bus]);

  // DELETE
  const handleContactDeleted = useCallback(async (contact: Contacts) => {
    if (contact?.id == null || contact.id === undefined) {
      console.error("Invalid contact or contact.id received:", contact);
      return;
    }
    await agent.remove(contact.id);
    onDeleted(contact.id);
    bus.emit({ type: "CONTACT_DELETED", payload: { id: contact.id } });
  }, [agent, onDeleted, bus]);

  // Opcional: CREATE centralizado
  const handleContactCreated = useCallback(async (creationPayload: CreateContactRequest) => {
    const created = await agent.create(creationPayload);
    onCreated?.(created);
    bus.emit({ type: "CONTACT_CREATED", payload: created });
  }, [agent, onCreated, bus]);

  return { handleContactCreated, handleContactUpdated, handleContactDeleted };
}
