import { useCallback } from "react";
import type { LeadFormData, UseCreateLeadOptions } from "src/types";

import { LeadType } from "@/features/leads/enums";
import { useLeadsApp } from "@/di/DiProvider";
import { createLead } from "@/features/leads/application";

import {
  validateExistingContactLead,
  validateNewContactLead,
} from "../utils/leadHelpers";

export const useCreateLead = ({
  leadType,
  onLeadCreated,
}: UseCreateLeadOptions) => {
  const ctx = useLeadsApp();

  // Map the string leadType to the actual LeadType enum
  const getLeadType = useCallback(() => {
    switch (leadType) {
      case "new-contact":
      case "existing-contact":
        return LeadType.CONSTRUCTION; // Ajuste si su enum requiere otro valor
      default:
        return LeadType.CONSTRUCTION;
    }
  }, [leadType]);

  const createWithNewContact = useCallback(
    async (formData: LeadFormData) => {
      const validationError = validateNewContactLead({
        leadName: formData.leadName || "",
        customerName: formData.customerName || "",
        contactName: formData.contactName || "",
        projectTypeId: formData.projectTypeId?.toString() || "",
        email: formData.email || "",
      });
      if (validationError) throw new Error(validationError);

      if (!formData.leadName) throw new Error("Lead name is required");
      if (!formData.customerName) throw new Error("Customer name is required");
      if (!formData.contactName) throw new Error("Contact name is required");
      if (!formData.projectTypeId) throw new Error("Project type is required");

      const input = {
        leadName: formData.leadName,
        leadNumber: formData.leadNumber ?? null,
        location: formData.location || "",
        projectTypeId: Number(formData.projectTypeId),
        leadType: getLeadType(),
        contact: {
          companyName: formData.customerName || "",
          name: formData.contactName || "",
          phone: formData.phone || "",
          email: formData.email || "",
          address: formData.address || "",
          occupation: formData.occupation || "",
          product: formData.product || "",
        },
      } as const;

      const newLead = await createLead(ctx, input, {
        checkNumberAvailability: true, // cámbielo si ya valida antes
        policies: {},
      });

      onLeadCreated?.(newLead as any);
    },
    [ctx, getLeadType, onLeadCreated]
  );

  const createWithExistingContact = useCallback(
    async (formData: LeadFormData) => {
      const validationError = validateExistingContactLead({
        leadName: formData.leadName || "",
        contactId: formData.contactId?.toString() || "",
        projectTypeId: formData.projectTypeId?.toString() || "",
      });
      if (validationError) throw new Error(validationError);

      if (!formData.leadName) throw new Error("Lead name is required");
      if (!formData.contactId) throw new Error("Contact selection is required");
      if (!formData.projectTypeId) throw new Error("Project type is required");

      const input = {
        leadName: formData.leadName,
        leadNumber: formData.leadNumber ?? null,
        location: formData.location || "",
        projectTypeId: Number(formData.projectTypeId),
        leadType: getLeadType(),
        contactId: Number(formData.contactId),
      } as const;

      const newLead = await createLead(ctx, input, {
        checkNumberAvailability: true,
        policies: {},
      });

      onLeadCreated?.(newLead as any);
    },
    [ctx, getLeadType, onLeadCreated]
  );

  return {
    createWithNewContact,
    createWithExistingContact,
  };
};
