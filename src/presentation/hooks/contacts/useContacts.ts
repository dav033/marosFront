import { useCallback, useEffect, useState } from "react";
import type { Contact } from "../../../domain/entities/Contact";
import { container } from "../../../application/di/container";

export function useContacts() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const listContactsUseCase = container.getListContacts();
      const list = await listContactsUseCase();
      setItems(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (input: Contact) => {
    const createUseCase = container.getCreateContact();
    const saved = await createUseCase(input);
    setItems((prev) => [saved, ...prev]);
    return saved;
  }, []);

  const update = useCallback(async (id: number, patch: Partial<Contact>) => {
    const updateUseCase = container.getUpdateContact();
    const saved = await updateUseCase(id, patch);
    setItems((prev) => prev.map((c) => (c.id === id ? saved : c)));
    return saved;
  }, []);

  const remove = useCallback(async (id: number) => {
    const deleteUseCase = container.getDeleteContact();
    await deleteUseCase(id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getById = useCallback(async (id: number) => {
    const getUseCase = container.getGetContactById();
    return getUseCase(id);
  }, []);
  
  const validate = useCallback((params: { name?: string; email?: string; phone?: string; excludeId?: number }) => {
    const validateUseCase = container.getValidateContactAvailability();
    return validateUseCase(params);
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { items, loading, error, refetch, create, update, remove, getById, validate };
}