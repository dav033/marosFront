import { useCallback, useEffect, useMemo, useState } from "react";
import type { Contact } from "../../../domain/entities/Contact";
import { listContacts } from "../../../application/contacts/ListContacts";
import { getContactById } from "../../../application/contacts/GetContactById";
import { createContact as createContactUC } from "../../../application/contacts/CreateContact";
import { updateContact as updateContactUC } from "../../../application/contacts/UpdateContact";
import { deleteContact as deleteContactUC } from "../../../application/contacts/DeleteContact";
import { validateContactAvailability } from "../../../application/contacts/ValidateContactAvailability";
import { makeContactRepo } from "../../../infrastructure/config/di";

export function useContacts() {
  const repo = useMemo(() => makeContactRepo(), []);
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listContacts(repo);
      setItems(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [repo]);

  const create = useCallback(async (input: Contact) => {
    const saved = await createContactUC(repo, input);
    setItems((prev) => [saved, ...prev]);
    return saved;
  }, [repo]);

  const update = useCallback(async (id: number, patch: Partial<Contact>) => {
    const saved = await updateContactUC(repo, id, patch);
    setItems((prev) => prev.map((c) => (c.id === id ? saved : c)));
    return saved;
  }, [repo]);

  const remove = useCallback(async (id: number) => {
    await deleteContactUC(repo, id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  }, [repo]);

  const getById = useCallback(async (id: number) => getContactById(repo, id), [repo]);
  const validate = useCallback((params: { name?: string; email?: string; phone?: string; excludeId?: number }) => 
    validateContactAvailability(repo, params), [repo]);

  useEffect(() => { refetch(); }, [refetch]);

  return { items, loading, error, refetch, create, update, remove, getById, validate };
}