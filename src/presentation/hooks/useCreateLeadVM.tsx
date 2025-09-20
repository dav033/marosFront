// src/presentation/hooks/leads/useCreateLeadVM.ts
import { useCallback, useMemo, useState } from "react";
import {
  createLeadWithExistingContact,
  createLeadWithNewContact,
  validateLeadNumberAvailability,
} from "@/features/leads/application";
import type { LeadType } from "@/features/leads/enums";
import type { Lead } from "@/features/leads/domain";
import type { LeadFormData } from "@/types/components/form";
import { useLeadsApp } from "@/di/DiProvider";
import { ContactMode } from "@/types/enums";


export type UseCreateLeadVMOptions = Readonly<{
  leadType: LeadType;
  onCreated?: (lead: Lead) => void;
  onClose?: () => void;
}>;

const EMPTY_FORM: LeadFormData = {
  leadNumber: "",
  leadName: "",
  name: "", // compat
  startDate: "", // lo setea el caso de uso
  location: "",
  status: null,
  projectTypeId: undefined,
  leadType: undefined as unknown as LeadType, // VM lo inyecta al crear
  contactId: undefined,
  companyName: "",
  contactName: "",
  customerName: "",
  occupation: "",
  product: "",
  phone: "",
  email: "",
  address: "",
};

export function useCreateLeadVM({
  leadType,
  onCreated,
  onClose,
}: UseCreateLeadVMOptions) {
  const ctx = useLeadsApp();

  const [form, setForm] = useState<LeadFormData>(() => ({
    ...EMPTY_FORM,
    leadType, // informativo en formulario
  }));
  const [contactMode, setContactMode] = useState<ContactMode>(
    ContactMode.NEW_CONTACT
  );
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    const name = (form.leadName || form.name || "").trim();
    const projectOk = !!form.projectTypeId;
    if (contactMode === ContactMode.NEW_CONTACT) {
      const contactName = (form.contactName || "").trim();
      const email = (form.email || "").trim();
      return name !== "" && projectOk && contactName !== "" && email !== "";
    }
    const contactIdOk = !!form.contactId;
    return name !== "" && projectOk && contactIdOk;
  }, [form, contactMode]);

  const setField = useCallback(
    <K extends keyof LeadFormData>(k: K, v: LeadFormData[K]) => {
      setError(null);
      setForm((prev) => ({ ...prev, [k]: v }));
    },
    []
  );

  const changeContactMode = useCallback((mode: ContactMode) => {
    setContactMode(mode);
    setError(null);
    setForm((prev) => {
      if (mode === ContactMode.NEW_CONTACT) {
        // limpiamos selección de existente
        return { ...prev, contactId: undefined };
      }
      // limpiamos campos del nuevo contacto
      return {
        ...prev,
        companyName: "",
        customerName: "",
        contactName: "",
        phone: "",
        email: "",
        address: "",
      };
    });
  }, []);

  const reset = useCallback(() => {
    setForm((f) => ({ ...EMPTY_FORM, leadType }));
    setContactMode(ContactMode.NEW_CONTACT);
    setError(null);
    setLoading(false);
  }, [leadType]);

  const submit = useCallback(async () => {
    if (!canSubmit || isLoading) return false;
    setLoading(true);
    setError(null);
    try {
      const leadNumber = (form.leadNumber || "").trim();
      if (leadNumber) {
        // valida disponibilidad desde Application
        await validateLeadNumberAvailability(ctx, leadNumber);
      }

      if (contactMode === ContactMode.NEW_CONTACT) {
        const created = await createLeadWithNewContact(
          ctx,
          {
            leadName: (form.leadName || form.name || "").trim(),
            leadNumber: leadNumber || null,
            location: form.location || "",
            projectTypeId: Number(form.projectTypeId),
            leadType,
            contact: {
              companyName: (form.companyName || form.customerName || "").trim(),
              name: (form.contactName || "").trim(),
              phone: (form.phone || "").trim(),
              email: (form.email || "").trim(),
            },
          },
          { checkNumberAvailability: false } // ya validado arriba
        );
        onCreated?.(created);
      } else {
        const created = await createLeadWithExistingContact(
          ctx,
          {
            leadName: (form.leadName || form.name || "").trim(),
            leadNumber: leadNumber || null,
            location: form.location || "",
            projectTypeId: Number(form.projectTypeId),
            leadType,
            contactId: Number(form.contactId),
          },
          { checkNumberAvailability: false }
        );
        onCreated?.(created);
      }
      reset();
      onClose?.();
      return true;
    } catch (e) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as any).message ?? "Unexpected error")
          : String(e);
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    canSubmit,
    isLoading,
    form,
    contactMode,
    ctx,
    leadType,
    onCreated,
    onClose,
    reset,
  ]);

  return {
    form,
    setField,
    contactMode,
    setContactMode: changeContactMode,
    isLoading,
    error,
    setError,
    canSubmit,
    submit,
    reset,
  };
}
