// src/presentation/organisms/EditLeadModal.tsx
import React from "react";
import BaseLeadModal from "@/presentation/organisms/BaseLeadModal";
import { FormMode } from "@/types/enums";
import type { Lead, ProjectType } from "@/features/leads/domain";
import { useEditLeadController } from "@/presentation/hooks/useEditLeadController";
import type { Contacts } from "@/features/contact/domain/models/Contact";
import LeadFormFields from "../molecules/LeadFormFields";

type Props = {
  isOpen: boolean;
  onClose: (shouldRefetch?: boolean) => void;
  lead: Lead | null;
  projectTypes: ProjectType[];
  contacts: Contacts[];
  onLeadUpdated?: (lead: Lead) => void;
};

const EditLeadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  lead,
  projectTypes,
  contacts,
  onLeadUpdated,
}) => {
  const { form, isLoading, error, setError, handleChange, submit } =
    useEditLeadController({
      lead,
      onSaved: (updated) => {
        onLeadUpdated?.(updated);
        onClose(true);
      },
    });

  // Adaptamos el shape EXACTO que requiere <LeadFormFields />
  const formForFields = {
    leadNumber: form.leadNumber ?? "",
    leadName: form.leadName ?? form.name ?? "",
    projectTypeId: form.projectTypeId,
    contactId: form.contactId,
    location: form.location ?? "",
    status: (form.status ?? "") as any, // "" | LeadStatus
    startDate: form.startDate ?? "",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submit();
    } catch {
      // El error ya se maneja en el controlador
    }
  };

  return (
    <BaseLeadModal
      isOpen={isOpen}
      onClose={() => onClose()}
      title={`Editar Lead${lead?.leadNumber ? ` #${lead.leadNumber}` : ""}`}
      error={error}
      onSubmit={handleSubmit}
      submitText="Guardar cambios"
      isLoading={isLoading}
      loadingText="Guardando..."
    >
      <LeadFormFields
        form={formForFields}
        onChange={(field, value) => {
          // Garantizamos string para cumplir la firma del controlador
          const asString = value == null ? "" : String(value);
          handleChange(field as keyof typeof form, asString);
          if (error) setError(null);
        }}
        projectTypes={projectTypes}
        contacts={contacts}
        mode={FormMode.EDIT}
        showLeadNumber
      />
    </BaseLeadModal>
  );
};

export default EditLeadModal;
