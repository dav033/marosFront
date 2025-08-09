import { useCallback } from "react";
import type { LeadFormData, UseCreateLeadOptions } from "src/types";
import {
  validateNewContactLead,
  validateExistingContactLead,
  createLeadWithNewContact,
  createLeadWithExistingContact,
} from "../utils/leadHelpers";

export const useCreateLead = ({
  leadType,
  onLeadCreated,
}: UseCreateLeadOptions) => {
  const createWithNewContact = useCallback(
    async (formData: LeadFormData) => {
      const validationError = validateNewContactLead({
        leadName: formData.leadName,
        customerName: formData.customerName,
        contactName: formData.contactName,
        projectTypeId: formData.projectTypeId,
        email: formData.email,
      });

      if (validationError) {
        throw new Error(validationError);
      }

      const newLead = await createLeadWithNewContact({
        leadName: formData.leadName,
        customerName: formData.customerName,
        contactName: formData.contactName,
        phone: formData.phone,
        email: formData.email,
        projectTypeId: Number(formData.projectTypeId),
        location: formData.location,
        leadType: leadType,
      });

      onLeadCreated(newLead);
    },
    [leadType, onLeadCreated]
  );

  const createWithExistingContact = useCallback(
    async (formData: LeadFormData) => {
      const validationError = validateExistingContactLead({
        leadName: formData.leadName,
        contactId: formData.contactId,
        projectTypeId: formData.projectTypeId,
      });

      if (validationError) {
        throw new Error(validationError);
      }

      const newLead = await createLeadWithExistingContact({
        leadName: formData.leadName,
        contactId: Number(formData.contactId),
        projectTypeId: Number(formData.projectTypeId),
        location: formData.location,
        leadType: leadType,
      });

      onLeadCreated(newLead);
    },
    [leadType, onLeadCreated]
  );

  return {
    createWithNewContact,
    createWithExistingContact,
  };
};
