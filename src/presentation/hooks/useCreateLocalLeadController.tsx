// src/presentation/hooks/useCreateLocalLeadController.ts
import { useState } from "react";

import { ContactMode, FormMode } from "@/types/enums";

import { useLeadForm } from "@/hooks/useLeadForm";
import {
  createLeadWithNewContact,
  createLeadWithExistingContact,
  validateLeadNumberAvailability,
  makeLeadsAppContext,
} from "@/features/leads/application";
import { LeadType, SystemClock, type Lead } from "@/features/leads/domain";
import { LocalLeadRepository } from "@/features/leads/infra/http/LocalLeadRepository";
import { LeadNumberAvailabilityHttpService } from "@/features/leads/infra/http/LeadNumberAvailabilityHttpService";

import {
  validateNewContactLead,
  validateExistingContactLead,
} from "@/utils/leadHelpers";
import type { LeadFormData } from "@/types";

type UseCreateLocalLeadControllerArgs = {
  leadType: LeadType;
  onLeadCreated: (lead: Lead) => void;
};

export function useCreateLocalLeadController({
  leadType,
  onLeadCreated,
}: UseCreateLocalLeadControllerArgs) {
  const [contactMode, setContactMode] = useState<ContactMode>(
    ContactMode.NEW_CONTACT
  );

  // Construimos un contexto "local-only" (repo local + validador)
  const ctx = makeLeadsAppContext({
    clock: SystemClock,
    repos: { lead: new LocalLeadRepository() },
    services: { leadNumberAvailability: new LeadNumberAvailabilityHttpService() },
  });

  const {
    form,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    resetForm,
    setError,
  } = useLeadForm({
    initialData: {},
    onSubmit: async (formData: LeadFormData) => {
      // Requisito: siempre debe venir leadNumber en local-only
      if (!formData.leadNumber) {
        throw new Error("Lead Number is required for local-only creation");
      }
      // Validación de unicidad vía caso de uso
      await validateLeadNumberAvailability(ctx, formData.leadNumber);

      let validationError: string | null = null;

      if (contactMode === ContactMode.NEW_CONTACT) {
        // Validación de UI adicional (si quieres mantenerla)
        validationError = validateNewContactLead({
          leadNumber: formData.leadNumber || "",
          leadName: formData.leadName || "",
          customerName: formData.customerName || "",
          contactName: formData.contactName || "",
          projectTypeId: formData.projectTypeId?.toString() || "",
          email: formData.email || "",
        });
        if (validationError) throw new Error(validationError);

        // Caso de uso con contacto nuevo (mapeando customerName/contactName)
        const lead = await createLeadWithNewContact(
          ctx,
          {
            leadName: formData.leadName || "",
            leadNumber: formData.leadNumber || "",
            location: formData.location || "",
            projectTypeId: Number(formData.projectTypeId) || 0,
            leadType,
            contact: {
              companyName: formData.customerName || "",
              name: formData.contactName || "",
              phone: formData.phone || "",
              email: formData.email || "",
            },
          },
          {
            policies: {},
            checkNumberAvailability: false, // ya validamos arriba
          }
        );
        onLeadCreated(lead);
      } else {
        validationError = validateExistingContactLead({
          leadNumber: formData.leadNumber || "",
          leadName: formData.leadName || "",
          contactId: formData.contactId?.toString() || "",
          projectTypeId: formData.projectTypeId?.toString() || "",
        });
        if (validationError) throw new Error(validationError);

        const lead = await createLeadWithExistingContact(
          ctx,
          {
            leadName: formData.leadName || "",
            leadNumber: formData.leadNumber || "",
            location: formData.location || "",
            projectTypeId: Number(formData.projectTypeId) || 0,
            leadType,
            contactId: Number(formData.contactId) || 0,
          },
          {
            policies: {},
            checkNumberAvailability: false, // ya validamos arriba
          }
        );
        onLeadCreated(lead);
      }

      resetForm();
    },
    onSuccess: () => {
      // cerrar modal lo hará el componente
    },
  });

  const handleContactModeChange = (mode: ContactMode) => {
    setContactMode(mode);
    // Limpiar campos irrelevantes al alternar
    if (mode === ContactMode.NEW_CONTACT) {
      handleChange("contactId", "");
    } else {
      handleChange("customerName", "");
      handleChange("contactName", "");
      handleChange("phone", "");
      handleChange("email", "");
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
