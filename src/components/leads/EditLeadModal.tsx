import { useEffect } from "react";
import type { Lead, ProjectType, Contacts, LeadFormData } from "../../types/domain";
import { FormMode } from "../../types/enums";
import { useLeadForm } from "../../hooks/useLeadForm";
import BaseLeadModal from "./BaseLeadModal";
import LeadFormFields from "./LeadFormFields";
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

    const updatedLead = await updateLead(lead.id, updateData);
    onLeadUpdated(updatedLead);
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
