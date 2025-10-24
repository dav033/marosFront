import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useLeadForm } from "@/hooks";
import type { ContactId, Lead, LeadType, ProjectTypeId } from "@/leads";
import { ContactRepositoryAdapterForLeads, createLead, LeadHttpRepository, LeadNumberAvailabilityHttpService, makeLeadsAppContext, SystemClock, validateLeadNumberAvailability } from "@/leads";
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
  const [contactMode, setContactMode] = useState<ContactMode>(
    ContactMode.NEW_CONTACT
  );
  const [error, setError] = useState<string | null>(null);

  const { form, handleChange } = useLeadForm({ initialData: { leadType } });
  const queryClient = useQueryClient();

  const ctx = makeLeadsAppContext({
    clock: SystemClock,
    repos: {
      lead: new LeadHttpRepository(),
      contact: new ContactRepositoryAdapterForLeads(),
    },
    services: {
      leadNumberAvailability: new LeadNumberAvailabilityHttpService(),
    },
  });

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
          ? ({
              ...common,
              contactId: Number(formData.contactId) as ContactId,
            } as const)
          : ({
              ...common,
              contact: {
                companyName:
                  formData.companyName || formData.customerName || "",
                name: formData.contactName || formData.customerName || "",
                occupation: formData.occupation || "",
                product: formData.product || "",
                phone: formData.phone || "",
                email: formData.email || "",
                address: formData.address || "",
              },
            } as const);

      const created = (await createLead(ctx, input, {
        checkNumberAvailability: true,
        policies: {},
      })) as unknown as Lead;

      
      queryClient.setQueryData<Lead[] | undefined>(
        ["leads", "byType", leadType],
        (prev) => {
          const list = Array.isArray(prev) ? prev : [];
          const id = (created as any)?.id;
          const withoutDup = id != null ? list.filter((l: any) => l?.id !== id) : list;
          return [created, ...withoutDup];
        }
      );
      queryClient.invalidateQueries({ queryKey: ["leads"] });

      onCreated?.(created);
      return created;
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSafeChange = (field: string, value: string) => {
    if (error) setError(null);
    handleChange(field as keyof LeadFormData, value);
  };

  return {
    contactMode,
    setContactMode,
    handleContactModeChange,
    form,
    isLoading,
    error,
    handleChange: handleSafeChange,
    submit: handleSubmit,
    clearError: () => setError(null),
  };
}
