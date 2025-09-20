import { useCallback } from "react";
import type { LeadFormData, UseCreateLeadOptions } from "src/types";
import {
  validateNewContactLead,
  validateExistingContactLead,
  createLeadWithNewContact,
  createLeadWithExistingContact,
} from "../utils/leadHelpers";
import { LeadType } from "@/features/leads/enums";

export const useCreateLead = ({
  leadType,
  onLeadCreated,
}: UseCreateLeadOptions) => {
  // Map the string leadType to the actual LeadType enum
  const getLeadType = useCallback(() => {
    switch (leadType) {
      case "new-contact":
      case "existing-contact":
        return LeadType.CONSTRUCTION; // Default to CONSTRUCTION for now
      default:
        return LeadType.CONSTRUCTION;
    }
  }, [leadType]);

  const createWithNewContact = useCallback(
    async (formData: LeadFormData) => {
      const validationError = validateNewContactLead({
        leadName: formData.leadName || '',
        customerName: formData.customerName || '',
        contactName: formData.contactName || '',
        projectTypeId: formData.projectTypeId?.toString() || '',
        email: formData.email || '',
      });

      if (validationError) {
        throw new Error(validationError);
      }

      // Ensure required fields are present
      if (!formData.leadName) throw new Error("Lead name is required");
      if (!formData.customerName) throw new Error("Customer name is required");
      if (!formData.contactName) throw new Error("Contact name is required");
      if (!formData.projectTypeId) throw new Error("Project type is required");

      const newLead = await createLeadWithNewContact({
        leadName: formData.leadName,
        customerName: formData.customerName,
        contactName: formData.contactName,
        phone: formData.phone || '',
        email: formData.email || '',
        projectTypeId: Number(formData.projectTypeId),
        location: formData.location || '',
        leadType: getLeadType(),
      });

      onLeadCreated?.(newLead); // Safe optional call
    },
    [getLeadType, onLeadCreated]
  );

  const createWithExistingContact = useCallback(
    async (formData: LeadFormData) => {
      const validationError = validateExistingContactLead({
        leadName: formData.leadName || '',
        contactId: formData.contactId?.toString() || '',
        projectTypeId: formData.projectTypeId?.toString() || '',
      });

      if (validationError) {
        throw new Error(validationError);
      }

      // Ensure required fields are present
      if (!formData.leadName) throw new Error("Lead name is required");
      if (!formData.contactId) throw new Error("Contact selection is required");
      if (!formData.projectTypeId) throw new Error("Project type is required");

      const newLead = await createLeadWithExistingContact({
        leadName: formData.leadName,
        contactId: Number(formData.contactId),
        projectTypeId: Number(formData.projectTypeId),
        location: formData.location || '',
        leadType: getLeadType(),
      });

      onLeadCreated?.(newLead); // Safe optional call
    },
    [getLeadType, onLeadCreated]
  );

  return {
    createWithNewContact,
    createWithExistingContact,
  };
};
