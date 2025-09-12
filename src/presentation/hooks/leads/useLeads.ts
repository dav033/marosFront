import { useCallback, useEffect, useState } from "react";
import type { Lead } from "../../../domain/entities/Lead";
import type { LeadType } from "../../../domain/enums/LeadType";
import { container } from "../../../application/di/container";

export function useLeads(initialType?: LeadType) {
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<LeadType | undefined>(initialType);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const listLeadsUseCase = container.getListLeads();
      const list = await listLeadsUseCase(type);
      setItems(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [type]);

  const createWithExistingContact = useCallback(async (input: Omit<Lead, "id" | "contact"> & { contactId: number }) => {
    const createUseCase = container.getCreateLeadWithExistingContact();
    const saved = await createUseCase(input);
    setItems((prev) => [saved, ...prev]);
    return saved;
  }, []);

  const createWithNewContact = useCallback(async (input: Omit<Lead, "id" | "contact"> & { contact: Lead["contact"] }) => {
    const createUseCase = container.getCreateLeadWithNewContact();
    const saved = await createUseCase(input);
    setItems((prev) => [saved, ...prev]);
    return saved;
  }, []);

  const update = useCallback(async (id: number, patch: Partial<Lead>) => {
    const updateUseCase = container.getUpdateLead();
    const saved = await updateUseCase(id, patch);
    setItems((prev) => prev.map((l) => (l.id === id ? saved : l)));
    return saved;
  }, []);

  const remove = useCallback(async (id: number) => {
    const deleteUseCase = container.getDeleteLead();
    await deleteUseCase(id);
    setItems((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const getById = useCallback(async (id: number) => {
    const getUseCase = container.getGetLeadById();
    return getUseCase(id);
  }, []);
  
  const validateNumber = useCallback((leadNumber: string) => {
    const validateUseCase = container.getValidateLeadNumber();
    return validateUseCase(leadNumber);
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { items, loading, error, type, setType, refetch, createWithExistingContact, createWithNewContact, update, remove, getById, validateNumber };
}