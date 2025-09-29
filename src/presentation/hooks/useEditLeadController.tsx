import { useCallback, useEffect, useMemo, useState } from "react";

import { useLeadsApp } from "@/di/DiProvider";
import { patchLead } from "@/features/leads/application"; 
import type { Lead } from "@/features/leads/domain";
import { LeadStatus, LeadType } from "@/features/leads/enums";
import type { LeadFormData } from "@/types/components/form";

type UseEditLeadControllerOptions = {
  lead: Lead | null;
  onSaved?: (lead: Lead) => void;
};

export function useEditLeadController({ lead, onSaved }: UseEditLeadControllerOptions) {
  const app = useLeadsApp();

  const initialForm: LeadFormData = useMemo(
    () => ({
      name: lead?.name ?? "",
      leadType: lead?.leadType ?? LeadType.CONSTRUCTION,
      startDate: lead?.startDate ?? "",
      status: (lead?.status as LeadStatus | null) ?? LeadStatus.NEW,
      leadNumber: lead?.leadNumber ?? "",
      leadName: lead?.name ?? "",
      location: lead?.location ?? "",
      projectTypeId: lead?.projectType?.id,
      contactId: lead?.contact?.id,
      customerName: "",
      contactName: "",
      phone: "",
      email: "",
      companyName: "",
      occupation: "",
      product: "",
      address: "",
    }),
    [lead]
  );

  const [form, setForm] = useState<LeadFormData>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setForm(initialForm);
    setError(null);
  }, [initialForm]);

  const handleChange = useCallback((field: keyof LeadFormData, value: string | number) => {
    setError(null);
    setForm(prev => {
      if (field === "projectTypeId" || field === "contactId") {
        return {
          ...prev,
          [field]:
            value === "" || value === undefined || value === null
              ? undefined
              : Number(value),
        };
      }
      if (field === "status") {
        return {
          ...prev,
          status: value === "" ? null : (value as LeadStatus),
        };
      }
      const next = { ...prev, [field]: String(value ?? "") };
      if (field === "leadName" && !next.name) {
        (next as LeadFormData).name = String(value ?? "");
      }

      return next;
    });
  }, []);

  const submit = useCallback(async () => {
    if (!lead) return;
    setIsLoading(true);
    setError(null);
    const l = lead as unknown as Record<string, unknown>;
    try {
      const patch: Record<string, unknown> = {};
      const newName = form.leadName || form.name || lead.name;

  if (newName !== l["name"]) (patch as Record<string, unknown>)["name"] = newName;
  if ((form.location ?? "") !== (l["location"] ?? "")) (patch as Record<string, unknown>)["location"] = form.location ?? "";
  if (form.status !== l["status"]) (patch as Record<string, unknown>)["status"] = form.status; 
  if ((form.startDate ?? "") !== (l["startDate"] ?? "")) (patch as Record<string, unknown>)["startDate"] = form.startDate ?? "";
  if (form.projectTypeId && form.projectTypeId !== ((l["projectType"] as Record<string, unknown> | undefined)?.["id"] as number | undefined)) (patch as Record<string, unknown>)["projectTypeId"] = form.projectTypeId;
  if (form.contactId && form.contactId !== ((l["contact"] as Record<string, unknown> | undefined)?.["id"] as number | undefined)) (patch as Record<string, unknown>)["contactId"] = form.contactId;
  if ((form.leadNumber ?? "") !== (l["leadNumber"] ?? "")) (patch as Record<string, unknown>)["leadNumber"] = form.leadNumber ?? "";
  if (form.leadType && form.leadType !== l["leadType"]) (patch as Record<string, unknown>)["leadType"] = form.leadType;

      const saved = await patchLead(app, lead.id, patch); 
      onSaved?.(saved);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error al actualizar el lead";
      setError(msg);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [app, form, lead, onSaved]);

  return { form, isLoading, error, setError, handleChange, submit };
}
