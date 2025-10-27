import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { contactsKeys } from "@/contact";
import { useLeadsApp } from "@/di";
import { useLeadForm } from "@/hooks";
import type { ContactId,Lead, LeadType, ProjectTypeId } from "@/leads";
import { createLead, leadsKeys,validateLeadNumberAvailability } from "@/leads";
import type { LeadFormData } from "@/types";
import { ContactMode } from "@/types";

type ControllerOptions = {
  leadType: LeadType;
  onCreated?: (lead: Lead) => void;
};

export function useCreateLocalLeadController({
  leadType,
  onCreated,
}: ControllerOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [contactMode, setContactMode] = useState<ContactMode>(ContactMode.NEW_CONTACT);
  const [error, setError] = useState<string | null>(null);
  const ctx = useLeadsApp();

  const { form, handleChange } = useLeadForm({ initialData: { leadType } });
  const queryClient = useQueryClient();

  const handleContactModeChange = (mode: ContactMode) => {
    if (error) setError(null);
    setContactMode(mode);
  };

  const handleSubmit = async (formData: LeadFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!formData.leadNumber) {
        throw new Error("Lead Number is required for local-only creation");
      }
      await validateLeadNumberAvailability(ctx, formData.leadNumber);

      const common = {
        leadName: (formData.leadName ?? "").trim(),
        leadNumber: formData.leadNumber,
        location: formData.location ?? "",
        projectTypeId: Number(formData.projectTypeId) as ProjectTypeId,
        leadType,
      } as const;

      const input =
        contactMode === ContactMode.EXISTING_CONTACT
          ? ({ ...common, contactId: Number(formData.contactId) as ContactId })
          : ({
              ...common,
              contact: {
                companyName: (formData.companyName ?? formData.customerName ?? "").trim(),
                name: (formData.contactName ?? "").trim(),
                phone: (formData.phone ?? "").trim(),
                email: (formData.email ?? "").trim(),
                address: (formData.address ?? "").trim(),
                occupation: (formData.occupation ?? "").trim(),
                product: (formData.product ?? "").trim(),
              },
            });

      const created = (await createLead(ctx, input, {
        checkNumberAvailability: false,
        policies: {},
      })) as unknown as Lead;

      // Invalidación dirigida: TanStack Query refetcha automáticamente
      queryClient.invalidateQueries({ queryKey: contactsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadsKeys.all });

      onCreated?.(created);
      return true;
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message?: unknown }).message ?? 'Unexpected error')
          : String(e);
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleChange,
    contactMode,
    setContactMode: handleContactModeChange,
    isLoading,
    error,
    setError,
    submit: handleSubmit,
  };
}
