import { useCallback, useMemo, useState } from "react";

import { useLeadsApp } from "@/di/DiProvider";
import { createLead, validateLeadNumberAvailability } from "@/features/leads/application";
import type { Lead } from "@/features/leads/domain";
import type { LeadType } from "@/features/leads/enums";
import type { LeadFormData } from "@/types/components/form";
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
  startDate: "", // lo setea backend o caso de uso si aplica
  location: "",
  status: null,
  projectTypeId: undefined,
  leadType: undefined as unknown as LeadType,
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
    leadType,
  }));
  const [contactMode, setContactMode] = useState<ContactMode>(ContactMode.NEW_CONTACT);
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
        return { ...prev, contactId: undefined };
      }
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
    setForm((_f) => ({ ...EMPTY_FORM, leadType }));
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
        await validateLeadNumberAvailability(ctx, leadNumber);
      }
      const common = {
        leadName: (form.leadName || form.name || "").trim(),
        leadNumber: leadNumber || null,
        location: form.location || "",
        projectTypeId: Number(form.projectTypeId),
        leadType,
      } as const;

      const input =
        contactMode === ContactMode.NEW_CONTACT
          ? {
              ...common,
              contact: {
                companyName: (form.companyName || form.customerName || "").trim(),
                name: (form.contactName || "").trim(),
                phone: (form.phone || "").trim(),
                email: (form.email || "").trim(),
                address: (form.address || "").trim(),
                occupation: (form.occupation || "").trim(),
                product: (form.product || "").trim(),
              },
            }
          : {
              ...common,
              contactId: Number(form.contactId),
            };

      const created = (await createLead(ctx, input, {
        checkNumberAvailability: false, // ya se validó arriba
        policies: {},
      })) as unknown as Lead;

      onCreated?.(created);
      reset();
      onClose?.();
      return true;
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message?: unknown }).message ?? "Unexpected error")
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
