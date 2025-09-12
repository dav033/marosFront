import { useEffect } from "react";
import { useLeadForm } from "../../../hooks/useLeadForm";
import type {
  Contacts,
  ProjectType,
} from "@/types";
import type { Lead, LeadFormData, LeadStatus, EditLeadModalProps } from "../types";
import { FormMode } from "../../../types/enums";
import {
  formatLeadForEdit,
  updateLead,
  validateEditLead,
} from "../../../utils/leadHelpers";
import LeadFormFields from "./LeadFormFields";
import BaseLeadModal from "./BaseLeadModal";

export default function EditLeadModal({
  isOpen,
  onClose,
  lead,
  projectTypes,
  contacts,
  onLeadUpdated,
}: EditLeadModalProps) {
  const handleSubmit = async (formData: LeadFormData) => {
    if (!lead) return;

    const validationError = validateEditLead({
      projectTypeId: typeof formData.projectTypeId === 'string' ? parseInt(formData.projectTypeId) : formData.projectTypeId,
      contactId: typeof formData.contactId === 'string' ? parseInt(formData.contactId) : formData.contactId,
    });

    if (validationError) {
      throw new Error(validationError);
    }

    const updateData = {
      id: lead.id,
      name: formData.leadName || lead.name,
      location: formData.location,
      status: formData.status as LeadStatus || undefined,
      contactId: formData.contactId ? Number(formData.contactId) : undefined,
      projectTypeId: Number(formData.projectTypeId),
      startDate: formData.startDate || undefined,
    };

    // 1) snapshot original (para rollback si falla)
    const original = lead;
    // 2) versión optimista para UI inmediata
    const updatedLocal: Lead = {
      ...lead,
      name: updateData.name ?? lead.name,
      location: updateData.location ?? lead.location,
      status:
        (updateData.status as LeadStatus) ??
        lead.status,
      startDate: updateData.startDate ?? lead.startDate,
      contact: updateData.contactId
        ? (contacts.find((c) => c.id === updateData.contactId) ?? lead.contact)
        : lead.contact,
      projectType: updateData.projectTypeId
        ? (projectTypes.find((p) => p.id === updateData.projectTypeId) ??
          lead.projectType)
        : lead.projectType,
    };
    onLeadUpdated(updatedLocal); // UI instantánea

    // 3) PUT en segundo plano; reconciliar o hacer rollback
    void (async () => {
      try {
        const saved = await updateLead(lead.id, updateData);
        onLeadUpdated(saved); // reconciliar con servidor
      } catch (err) {
        console.error("Update failed, rolling back", err);
        onLeadUpdated(original); // rollback
        // TODO: mostrar toast no intrusivo
      }
    })();
  };

  const {
    form,
    isLoading,
    error,
    handleChange,
    handleSubmit: onSubmit,
    resetForm,
    setForm,
    setError,
  } = useLeadForm({
    initialData: {},
    onSubmit: handleSubmit,
    onSuccess: onClose,
  });

  // Limpiar error al modificar campos
  const handleSafeChange = (field: string, value: string) => {
    if (error) setError(null);
    handleChange(field as keyof typeof form, value);
  };

  useEffect(() => {
    if (lead) {
      const leadData = formatLeadForEdit(lead);
      setForm((prev: LeadFormData) => ({ ...prev, ...leadData }));
    }
  }, [lead, setForm]);

  if (!lead) return null;

  // Submit seguro: espera a que termine la petición antes de cerrar
  const handleModalSubmit = async (e: React.FormEvent) => {
    await onSubmit(e);
    // El hook maneja onSuccess/onClose sólo si no hay error
  };

  return (
    <BaseLeadModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Lead"
      error={error}
      onSubmit={handleModalSubmit}
      submitText="Update"
      loadingText="Updating..."
      isLoading={isLoading}
    >
      <LeadFormFields
        form={form}
        onChange={handleSafeChange}
        projectTypes={projectTypes}
        contacts={contacts}
        mode={FormMode.EDIT}
      />
    </BaseLeadModal>
  );
}
