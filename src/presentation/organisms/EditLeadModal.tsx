import React from 'react';

import type { Contact } from '@/contact';
import type { Lead, LeadStatus, ProjectType } from '@/leads';
import { useEditLeadController } from '@/presentation';
import { BaseFormModal, LeadFormFields } from '@/presentation';
import { FormMode } from '@/types';

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

  const formForFields = {
    leadNumber: form.leadNumber ?? '',
    leadName: form.leadName ?? form.name ?? '',
    ...(form.projectTypeId !== undefined
      ? { projectTypeId: form.projectTypeId }
      : {}),
    ...(form.contactId !== undefined ? { contactId: form.contactId } : {}),
    location: form.location ?? '',
    status: form.status ? (form.status as unknown as '' | LeadStatus) : '',
    startDate: form.startDate ?? '',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submit();
    } catch {
      // ignore
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={() => onClose()}
      title={`Editar Lead${lead?.leadNumber ? ` #${lead.leadNumber}` : ''}`}
      onSubmit={handleSubmit}
      submitText="Guardar cambios"
      isLoading={isLoading}
      loadingText="Guardando..."
    >
      <LeadFormFields
        form={formForFields}
        onChange={(field: string, value: any) => {
          const asString = value == null ? '' : String(value);
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
