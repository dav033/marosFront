// src/presentation/hooks/useEditLeadController.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLeadsApp } from "@/di/DiProvider";
import { patchLead } from "@/features/leads/application"; // use case
import type { Lead } from "@/features/leads/domain";
import type { LeadFormData } from "@/types/components/form";
import { LeadStatus, LeadType } from "@/features/leads/enums";

/** Opciones del controlador */
type UseEditLeadControllerOptions = {
  lead: Lead | null;
  onSaved?: (lead: Lead) => void;
};

/** Controlador de edición (lógica de orquestación) */
export function useEditLeadController({ lead, onSaved }: UseEditLeadControllerOptions) {
  const app = useLeadsApp();

  const initialForm: LeadFormData = useMemo(
    () => ({
      // Campos requeridos por LeadFormData
      name: lead?.name ?? "",
      leadType: lead?.leadType ?? LeadType.CONSTRUCTION,
      startDate: lead?.startDate ?? "",
      status: (lead?.status as LeadStatus | null) ?? LeadStatus.NEW,

      // Campos opcionales / compatibilidad con LeadFormFields
      leadNumber: lead?.leadNumber ?? "",
      leadName: lead?.name ?? "",
      location: lead?.location ?? "",
      projectTypeId: lead?.projectType?.id,
      contactId: lead?.contact?.id,

      // Datos de contacto opcionales para el formulario
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

  // Sincroniza cuando cambia el lead a editar
  useEffect(() => {
    setForm(initialForm);
    setError(null);
  }, [initialForm]);

  const handleChange = useCallback((field: keyof LeadFormData, value: string | number) => {
    setError(null);
    setForm(prev => {
      // Normaliza numéricos conocidos
      if (field === "projectTypeId" || field === "contactId") {
        return {
          ...prev,
          [field]:
            value === "" || value === undefined || value === null
              ? undefined
              : Number(value),
        };
      }

      // Normaliza status: "" -> null; otro valor -> LeadStatus
      if (field === "status") {
        return {
          ...prev,
          status: value === "" ? null : (value as LeadStatus),
        };
      }

      // Resto: a string
      const next = { ...prev, [field]: String(value ?? "") };

      // Conveniencia: si se escribe leadName y name está vacío, sincroniza name
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

    try {
      // Construye patch SOLO con cambios relevantes
      const patch: Record<string, unknown> = {};
      const newName = form.leadName || form.name || lead.name;

      if (newName !== lead.name) patch.name = newName;
      if ((form.location ?? "") !== (lead.location ?? "")) patch.location = form.location ?? "";
      if (form.status !== lead.status) patch.status = form.status; // LeadStatus | null
      if ((form.startDate ?? "") !== (lead.startDate ?? "")) patch.startDate = form.startDate ?? "";
      if (form.projectTypeId && form.projectTypeId !== lead.projectType.id) patch.projectTypeId = form.projectTypeId;
      if (form.contactId && form.contactId !== lead.contact.id) patch.contactId = form.contactId;
      if ((form.leadNumber ?? "") !== (lead.leadNumber ?? "")) patch.leadNumber = form.leadNumber ?? "";
      if (form.leadType && form.leadType !== lead.leadType) patch.leadType = form.leadType;

      const saved = await patchLead(app, lead.id, patch); // aplica reglas de dominio y persiste
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
