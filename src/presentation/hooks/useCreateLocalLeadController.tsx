// src/presentation/hooks/useCreateLocalLeadController.tsx
import { useState } from "react";

import {
  createLead,
  makeLeadsAppContext,
  validateLeadNumberAvailability,
} from "@/features/leads/application";
import type {
  Lead,
  LeadType,
  ProjectTypeId,
  ContactId,
} from "@/features/leads/domain";
import { SystemClock } from "@/features/leads/domain";
import { LeadNumberAvailabilityHttpService } from "@/features/leads/infra/http/LeadNumberAvailabilityHttpService";
import { LeadHttpRepository } from "@/features/leads/infra/http/LeadHttpRepository";
import { useLeadForm } from "@/hooks/useLeadForm";
import type { LeadFormData } from "@/types";
import { ContactMode } from "@/types/enums";
import { ContactRepositoryAdapterForLeads } from "@/features/leads/infra/adapters/ContactRepositoryAdapterForLeads";

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

  const { form, handleChange } = useLeadForm({ leadType });

  const ctx = makeLeadsAppContext({
    clock: SystemClock,
    repos: {
      // Sustituimos el repo local por el HTTP con la opción de "skip sync"
      lead: new LeadHttpRepository(undefined, { skipClickUpSync: true }),
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

      // En el flujo "local" ya se exigía leadNumber; conservamos la regla
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
