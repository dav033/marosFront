import { useState } from "react";
import { GenericInput } from "@components/common/GenericInput";
import type { ProjectType, Contacts, Lead, LeadFormData } from "src/types";
import { LeadType, FormMode, ContactMode } from "src/types/enums";
import { useLeadForm } from "src/hooks/useLeadForm";
import BaseLeadModal from "../../../components/leads/BaseLeadModal.tsx";
import LeadFormFields from "../../../components/ui/leads/LeadFormFields.tsx";
import ContactModeSelector from "../../../components/ui/leads/ContactModeSelector.tsx";
import {
  validateNewContactLead,
  validateExistingContactLead,
  createLeadWithNewContact,
  createLeadWithExistingContact,
} from "src/utils/leadHelpers";
import { OptimizedLeadsService } from "@/services/OptimizedLeadsService";
import type { CreateLeadModalProps } from "../../../types/components/leads-contacts";

export default function CreateLeadModal({
  isOpen,
  onClose,
  projectTypes,
  contacts,
  leadType,
  onLeadCreated,
}: CreateLeadModalProps) {
  const [contactMode, setContactMode] = useState<ContactMode>(ContactMode.NEW_CONTACT);

  // Limpia campos irrelevantes al alternar el switch
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

  // Usar el hook de formulario para manejar el estado y validación
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
      let validationError: string | null = null;
      // Optional server-side leadNumber validation when user typed one
      if (formData.leadNumber) {
        const { valid, reason } = await OptimizedLeadsService.validateLeadNumber(
          formData.leadNumber
        );
        if (!valid) throw new Error(reason || "Lead number is already in use");
      }

      if (contactMode === ContactMode.NEW_CONTACT) {
        validationError = validateNewContactLead({
          leadName: formData.leadName || "",
          customerName: formData.customerName || "",
          contactName: formData.contactName || "",
          projectTypeId: formData.projectTypeId ? String(formData.projectTypeId) : "",
          email: formData.email || "",
        });
        if (validationError) throw new Error(validationError);
        const newLead = await createLeadWithNewContact({
          // If manual number provided, include it; service will send in request
          // and backend will validate or auto-generate if blank.
          leadName: formData.leadName || "",
          customerName: formData.customerName || "",
          contactName: formData.contactName || "",
          phone: formData.phone || "",
          email: formData.email || "",
          leadNumber: formData.leadNumber || undefined,
          projectTypeId: Number(formData.projectTypeId) || 0,
          location: formData.location || "",
          leadType: leadType,
        });
        onLeadCreated(newLead);
      } else {
        validationError = validateExistingContactLead({
          leadName: formData.leadName || "",
          contactId: formData.contactId ? String(formData.contactId) : "",
          projectTypeId: formData.projectTypeId ? String(formData.projectTypeId) : "",
        });
        if (validationError) throw new Error(validationError);
        const newLead = await createLeadWithExistingContact({
          leadName: formData.leadName || "",
          contactId: Number(formData.contactId) || 0,
          projectTypeId: Number(formData.projectTypeId) || 0,
          location: formData.location || "",
          leadType: leadType,
          leadNumber: formData.leadNumber || undefined,
        });
        onLeadCreated(newLead);
      }
      resetForm();
      onClose();
    },
    onSuccess: onClose,
  });

  // Limpiar error al modificar campos
  const handleSafeChange = (field: string, value: string) => {
    if (error) setError(null);
    handleChange(field as keyof typeof form, value);
  };

  // Submit seguro: espera a que termine la petición antes de cerrar
  const handleModalSubmit = async (e: React.FormEvent) => {
    await onSubmit(e);
    // El hook maneja onSuccess/onClose sólo si no hay error
  };

  return (
    <BaseLeadModal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Lead"
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
  showLeadNumber={false}
      />
    </BaseLeadModal>
  );
}
