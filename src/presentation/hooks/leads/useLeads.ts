import { useCallback, useEffect, useMemo, useState } from "react";
import type { Lead } from "../../../domain/entities/Lead";
import type { LeadType } from "../../../domain/enums/LeadType";
import { listLeads } from "../../../application/leads/ListLeads";
import { getLeadById } from "../../../application/leads/GetLeadById";
import { createLeadWithExistingContact } from "../../../application/leads/CreateLeadWithExistingContact";
import { createLeadWithNewContact } from "../../../application/leads/CreateLeadWithNewContact";
import { updateLead } from "../../../application/leads/UpdateLead";
import { deleteLead } from "../../../application/leads/DeleteLead";
import { validateLeadNumber } from "../../../application/leads/ValidateLeadNumber";
import { makeLeadRepo } from "../../../infrastructure/config/di";

export function useLeads(initialType?: LeadType) {
  const repo = useMemo(() => makeLeadRepo(), []);
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<LeadType | undefined>(initialType);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listLeads(repo, type);
      setItems(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [repo, type]);

  const createWithExistingContact = useCallback(async (input: Omit<Lead, "id" | "contact"> & { contactId: number }) => {
    const saved = await createLeadWithExistingContact(repo, input);
    setItems((prev) => [saved, ...prev]);
    return saved;
  }, [repo]);

  const createWithNewContact = useCallback(async (input: Omit<Lead, "id" | "contact"> & { contact: Lead["contact"] }) => {
    const saved = await createLeadWithNewContact(repo, input);
    setItems((prev) => [saved, ...prev]);
    return saved;
  }, [repo]);

  const update = useCallback(async (id: number, patch: Partial<Lead>) => {
    const saved = await updateLead(repo, id, patch);
    setItems((prev) => prev.map((l) => (l.id === id ? saved : l)));
    return saved;
  }, [repo]);

  const remove = useCallback(async (id: number) => {
    await deleteLead(repo, id);
    setItems((prev) => prev.filter((l) => l.id !== id));
  }, [repo]);

  const getById = useCallback(async (id: number) => getLeadById(repo, id), [repo]);
  const validateNumber = useCallback((leadNumber: string) => validateLeadNumber(repo, leadNumber), [repo]);

  useEffect(() => { refetch(); }, [refetch]);

  return { items, loading, error, type, setType, refetch, createWithExistingContact, createWithNewContact, update, remove, getById, validateNumber };
}