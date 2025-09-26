import React from "react";

import type { Contact } from "@/features/contact/domain/models/Contact";
import type { Lead, ProjectType } from "@/features/leads/domain";
import type { LeadStatus } from "@/features/leads/enums";
import { useEditLeadController } from "@/presentation/hooks/useEditLeadController";
import BaseFormModal from "@/presentation/organisms/BaseFormModal";
import { FormMode } from "@/types/enums";
import LeadFormFields from "../molecules/LeadFormFields";


type Props = {
  isOpen: boolean;
  onClose: (shouldRefetch?: boolean) => void;
  lead: Lead | null;
  projectTypes: ProjectType[];
  contacts: Contact[];
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
    ...(form.projectTypeId !== undefined ? { projectTypeId: form.projectTypeId } : {}),
    ...(form.contactId !== undefined ? { contactId: form.contactId } : {}),
    location: form.location ?? "",
    status: form.status ? (form.status as unknown as "" | LeadStatus) : "",
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
    <BaseFormModal
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
        onChange={(field: string, value: any) => {
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
    </BaseFormModal>
  );
};

export default EditLeadModal;
