import { useEffect } from "react";
import type { Lead, ProjectType, Contacts, LeadFormData } from "../../types/domain";
import { FormMode } from "../../types/enums";
import { useLeadForm } from "../../hooks/useLeadForm";
import BaseLeadModal from "./BaseLeadModal";
import LeadFormFields from "../ui/leads/LeadFormFields.tsx";
import {
  validateEditLead,
  updateLead,
  formatLeadForEdit,
} from "../../utils/leadHelpers";

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  projectTypes: ProjectType[];
  contacts: Contacts[];
  onLeadUpdated: (lead: Lead) => void;
}

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
      projectTypeId: formData.projectTypeId,
      contactId: formData.contactId,
    });

    if (validationError) {
      throw new Error(validationError);
    }

    const updateData = {
      name: formData.leadName || lead.name,
      location: formData.location,
      status: formData.status,
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
      status: (updateData.status as any) ?? lead.status,
      startDate: updateData.startDate ?? lead.startDate,
      // si necesita reflejar contact/projectType por id, puede mapearlos aquí
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
  } = useLeadForm({
    initialData: {},
    onSubmit: handleSubmit,
    onSuccess: onClose,
  });

  useEffect(() => {
    if (lead) {
      const leadData = formatLeadForEdit(lead);
      setForm((prev: LeadFormData) => ({ ...prev, ...leadData }));
    }
  }, [lead, setForm]);

  if (!lead) return null;

  return (
    <BaseLeadModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Lead"
      error={error}
      onSubmit={onSubmit}
      submitText="Updating"
    >
      <LeadFormFields
        form={form}
        onChange={handleChange}
        projectTypes={projectTypes}
        contacts={contacts}
        mode={FormMode.EDIT}
      />
    </BaseLeadModal>
  );
}
