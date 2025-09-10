import { useState } from "react";
import BaseLeadModal from "../../../components/leads/BaseLeadModal.tsx";
import LeadFormFields from "../../../components/ui/leads/LeadFormFields.tsx";
import ContactModeSelector from "../../../components/ui/leads/ContactModeSelector.tsx";
import type { ProjectType, Contacts, Lead, LeadFormData, CreateLocalLeadModalProps } from "@/types";
import { LeadType, FormMode, ContactMode } from "@/types/enums";
import { useLeadForm } from "@/hooks/useLeadForm";
import { OptimizedLeadsService } from "@/services/OptimizedLeadsService";
import { validateNewContactLead, validateExistingContactLead } from "@/utils/leadHelpers";

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
    onSubmit: async (formData: LeadFormData) => {
      if (!formData.leadNumber) {
        throw new Error("Lead Number is required for local-only creation");
      }
      // server-side validation
      const { valid, reason } = await OptimizedLeadsService.validateLeadNumber(formData.leadNumber);
      if (!valid) throw new Error(reason || "Lead number already in use");

      let validationError: string | null = null;
      if (contactMode === ContactMode.NEW_CONTACT) {
        validationError = validateNewContactLead({
          leadNumber: formData.leadNumber || '',
          leadName: formData.leadName || '',
          customerName: formData.customerName || '',
          contactName: formData.contactName || '',
          projectTypeId: formData.projectTypeId?.toString() || '',
          email: formData.email || '',
        });
        if (validationError) throw new Error(validationError);
        
        // Ensure required fields are present
        if (!formData.leadName) throw new Error("Lead name is required");
        if (!formData.customerName) throw new Error("Customer name is required");
        if (!formData.contactName) throw new Error("Contact name is required");
        if (!formData.projectTypeId) throw new Error("Project type is required");
        
        const newLead = await OptimizedLeadsService.createLeadLocalByNewContact({
          leadNumber: formData.leadNumber,
          leadName: formData.leadName,
          customerName: formData.customerName,
          contactName: formData.contactName,
          phone: formData.phone || '',
          email: formData.email || '',
          projectTypeId: Number(formData.projectTypeId),
          location: formData.location || '',
          leadType,
        });
        onLeadCreated(newLead);
      } else {
        validationError = validateExistingContactLead({
          leadNumber: formData.leadNumber || '',
          leadName: formData.leadName || '',
          contactId: formData.contactId?.toString() || '',
          projectTypeId: formData.projectTypeId?.toString() || '',
        });
        if (validationError) throw new Error(validationError);
        
        // Ensure required fields are present
        if (!formData.leadName) throw new Error("Lead name is required");
        if (!formData.contactId) throw new Error("Contact selection is required");
        if (!formData.projectTypeId) throw new Error("Project type is required");
        
        const newLead = await OptimizedLeadsService.createLeadLocalByExistingContact({
          leadNumber: formData.leadNumber,
          leadName: formData.leadName,
          contactId: Number(formData.contactId),
          projectTypeId: Number(formData.projectTypeId),
          location: formData.location || '',
          leadType,
        });
        onLeadCreated(newLead);
      }
      resetForm();
      onClose();
    },
    onSuccess: onClose,
  });

  const handleSafeChange = (field: string, value: string) => {
    if (error) setError(null);
    handleChange(field as keyof LeadFormData, value);
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
