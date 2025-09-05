import { useState } from "react";
import BaseLeadModal from "../../../components/leads/BaseLeadModal.tsx";
import LeadFormFields from "../../../components/ui/leads/LeadFormFields.tsx";
import ContactModeSelector from "../../../components/ui/leads/ContactModeSelector.tsx";
import type { ProjectType, Contacts, Lead } from "src/types";
import { LeadType, FormMode, ContactMode } from "src/types/enums";
import { useLeadForm } from "src/hooks/useLeadForm";
import { OptimizedLeadsService } from "@/services/OptimizedLeadsService";
import { validateNewContactLead, validateExistingContactLead } from "src/utils/leadHelpers";

interface CreateLocalLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTypes: ProjectType[];
  contacts: Contacts[];
  leadType: LeadType;
  onLeadCreated: (lead: Lead) => void;
}

export default function CreateLocalLeadModal({
  isOpen,
  onClose,
  projectTypes,
  contacts,
  leadType,
  onLeadCreated,
}: CreateLocalLeadModalProps) {
  const [contactMode, setContactMode] = useState<ContactMode>(ContactMode.NEW_CONTACT);

  const handleContactModeChange = (mode: ContactMode) => {
    setContactMode(mode);
    if (mode === ContactMode.NEW_CONTACT) {
      handleChange("contactId", "");
    } else {
      handleChange("customerName", "");
      handleChange("contactName", "");
      handleChange("phone", "");
      handleChange("email", "");
    }
  };

  const {
    form,
    isLoading,
    error,
    handleChange,
    handleSubmit: onSubmit,
    resetForm,
    setError,
  } = useLeadForm({
    initialData: {},
    onSubmit: async (formData) => {
      if (!formData.leadNumber) {
        throw new Error("Lead Number is required for local-only creation");
      }
      // server-side validation
      const { valid, reason } = await OptimizedLeadsService.validateLeadNumber(formData.leadNumber);
      if (!valid) throw new Error(reason || "Lead number already in use");

      let validationError: string | null = null;
      if (contactMode === ContactMode.NEW_CONTACT) {
        validationError = validateNewContactLead({
          leadNumber: formData.leadNumber,
          leadName: formData.leadName,
          customerName: formData.customerName,
          contactName: formData.contactName,
          projectTypeId: formData.projectTypeId,
          email: formData.email,
        });
        if (validationError) throw new Error(validationError);
        const newLead = await OptimizedLeadsService.createLeadLocalByNewContact({
          leadNumber: formData.leadNumber,
          leadName: formData.leadName,
          customerName: formData.customerName,
          contactName: formData.contactName,
          phone: formData.phone,
          email: formData.email,
          projectTypeId: Number(formData.projectTypeId),
          location: formData.location,
          leadType,
        });
        onLeadCreated(newLead);
      } else {
        validationError = validateExistingContactLead({
          leadNumber: formData.leadNumber,
          leadName: formData.leadName,
          contactId: formData.contactId,
          projectTypeId: formData.projectTypeId,
        });
        if (validationError) throw new Error(validationError);
        const newLead = await OptimizedLeadsService.createLeadLocalByExistingContact({
          leadNumber: formData.leadNumber,
          leadName: formData.leadName,
          contactId: Number(formData.contactId),
          projectTypeId: Number(formData.projectTypeId),
          location: formData.location,
          leadType,
        });
        onLeadCreated(newLead);
      }
      resetForm();
      onClose();
    },
    onSuccess: onClose,
  });

  const handleSafeChange = (field: keyof typeof form, value: string) => {
    if (error) setError(null);
    handleChange(field, value);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    await onSubmit(e);
  };

  return (
    <BaseLeadModal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Lead (solo sistema)"
      error={error}
      onSubmit={handleModalSubmit}
      submitText="Crear"
      loadingText="Creando..."
      isLoading={isLoading}
    >
      <ContactModeSelector
        contactMode={contactMode}
        onContactModeChange={handleContactModeChange}
        form={form}
        onChange={handleSafeChange}
        isLoading={isLoading}
      />
      <LeadFormFields
        form={form}
        onChange={handleSafeChange}
        projectTypes={projectTypes}
        contacts={contacts}
        mode={FormMode.CREATE}
  contactMode={contactMode}
  showLeadNumber={true}
      />
    </BaseLeadModal>
  );
}
