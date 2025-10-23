import React from "react";

import type { Lead, LeadType } from "@/leads";
import { ContactModeSelector } from "@/presentation";
import { BaseFormModal, LeadFormFields, type LeadFormFieldsProps, useCreateLeadVM } from "@/presentation";
import type { LeadFormData } from "@/types";
import { FormMode } from "@/types";

import type { NewContactChangeHandler, NewContactForm } from "./ContactModeSelector";

export type CreateLeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectTypes: Array<{ id: number; name: string; color: string }>;
  contacts: Array<{
    id: number;
    name: string;
    companyName: string;
    email?: string | undefined;
    phone?: string | undefined;
  }>;
  leadType: LeadType;
  onLeadCreated: (lead: Lead) => void;
  showLeadNumber?: boolean;
};

export default function CreateLeadModal({
  isOpen,
  onClose,
  projectTypes,
  contacts,
  leadType,
  onLeadCreated,
  showLeadNumber = false,
}: CreateLeadModalProps) {
  const {
    form,
    setField,
    contactMode,     
    setContactMode,  
    isLoading,
    error,
    setError,
    canSubmit,
    submit,
  } = useCreateLeadVM({ leadType, onCreated: onLeadCreated, onClose });

  const handleSafeChange = (
    name: keyof LeadFormData,
    value: LeadFormData[typeof name]
  ) => {
    if (error) setError(null);
    setField(name, value);
  };
  const newContactForm: NewContactForm = {
    customerName: form.customerName ?? "",
    contactName: form.contactName ?? "",
    email: form.email ?? "",
    phone: form.phone ?? undefined,
  };

  const handleNewContactChange: NewContactChangeHandler = (key, value) => {
    const v = (value ?? "") as string; 
    handleSafeChange(key as keyof LeadFormData, v);
  };
  const leadFields: LeadFormFieldsProps["form"] = {
    leadNumber: form.leadNumber ?? "",
    leadName: form.leadName ?? "",
    ...(form.projectTypeId !== undefined ? { projectTypeId: form.projectTypeId } : {}),
    ...(form.contactId !== undefined ? { contactId: form.contactId } : {}),
    location: form.location ?? "",
    status: form.status ?? "",
    startDate: form.startDate ?? undefined,
  };

  const handleLeadFieldsChange: LeadFormFieldsProps["onChange"] = (
    field,
    value
  ) => {
    if (error) setError(null);
    if (field === "projectTypeId" || field === "contactId") {
      handleSafeChange(field as keyof LeadFormData, value as number | undefined);
      return;
    }
    const normalized = (value ?? "") as string;
    handleSafeChange(field as keyof LeadFormData, normalized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit();
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Lead"
      error={error ?? null}                
      onSubmit={handleSubmit}
      submitText="Crear"
      loadingText="Creando..."
      isLoading={isLoading}
      isSubmitDisabled={!canSubmit || isLoading}
    >
      <ContactModeSelector
        contactMode={contactMode}          
        onContactModeChange={setContactMode}
        form={newContactForm}
        onChange={handleNewContactChange}
        isLoading={isLoading}
        className="mb-4"
      />

      <LeadFormFields
        form={leadFields}
        onChange={handleLeadFieldsChange}
        projectTypes={projectTypes}
        contacts={contacts ?? []}
        mode={FormMode.CREATE}
        contactMode={contactMode}          
        showLeadNumber={showLeadNumber}
      />
    </BaseFormModal>
  );
}
