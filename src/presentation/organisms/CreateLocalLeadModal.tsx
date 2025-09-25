// src/presentation/organisms/CreateLocalLeadModal.tsx
import React from "react";

import type { LeadStatus } from "@/features/leads/domain";
import { useCreateLocalLeadController } from "@/presentation/hooks/useCreateLocalLeadController";
import type { CreateLocalLeadModalProps } from "@/types";
import type { ContactMode } from "@/types/enums";              // <-- usa enum de dominio
import { FormMode } from "@/types/enums";

import type { NewContactChangeHandler, NewContactForm } from "../molecules/ContactModeSelector";
import ContactModeSelector from "../molecules/ContactModeSelector";
import type { LeadFormFieldsProps } from "../molecules/LeadFormFields";
import LeadFormFields from "../molecules/LeadFormFields";
import BaseLeadModal from "./BaseLeadModal";

type LeadFieldsForUI = {
  leadNumber: string;
  leadName: string;
  projectTypeId?: number | undefined;
  contactId?: number | undefined;
  location: string;
  status?: "" | LeadStatus;
  startDate?: string;
};

export default function CreateLocalLeadModal({
  isOpen,
  onClose,
  projectTypes,
  contacts,
  leadType,
  onLeadCreated,
}: CreateLocalLeadModalProps) {
  const {
    contactMode,                // <-- asegúrate que este sea ContactMode de "@/types/enums"
    handleContactModeChange,    // (m: ContactMode) => void
    form,                       // LeadFormData
    isLoading,
    error,
    handleChange,               // (k: keyof LeadFormData, v: string | number | undefined) => void
    submit,                     // (e) => Promise<boolean>
  } = useCreateLocalLeadController({ leadType, onLeadCreated });

  // 3.1 Adaptador para ContactModeSelector (strings requeridos)
  const newContactForm: NewContactForm = {
    customerName: form.customerName ?? "",
    contactName:  form.contactName  ?? "",
    email:        form.email        ?? "",
    phone:        form.phone ?? "",
  };

  const handleNewContactChange: NewContactChangeHandler = (key, value) => {
    // normalizamos undefined → ""
    const v = (value ?? "") as string;
    handleChange(key as keyof typeof form, v);
  };

  // 3.2 Adaptador para LeadFormFields
  const leadFields: LeadFieldsForUI = {
    leadNumber: form.leadNumber ?? "",
    leadName:   form.leadName   ?? "",
    ...(form.projectTypeId !== undefined ? { projectTypeId: form.projectTypeId } : {}),
    ...(form.contactId !== undefined ? { contactId: form.contactId } : {}),
    location:   form.location   ?? "",
    status:    (form.status ?? "") as "" | LeadStatus,
    startDate:  form.startDate ?? undefined,
  };

  const handleLeadFieldsChange: LeadFormFieldsProps["onChange"] = (field, value) => {
    if (field === "projectTypeId" || field === "contactId") {
      // pueden ser number | undefined
      handleChange(field as keyof typeof form, value !== undefined ? String(value) : "");
      return;
    }
    if (field === "status") {
      handleChange(field as keyof typeof form, (value ?? "") as string);
      return;
    }
    // strings
    handleChange(field as keyof typeof form, String(value ?? ""));
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    await submit(e);
    onClose();
  };

  return (
    <BaseLeadModal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Lead (solo sistema)"
      error={error ?? null}                 // <-- nunca undefined
      onSubmit={handleModalSubmit}
      submitText="Crear"
      loadingText="Creando..."
      isLoading={isLoading}
    >
      <ContactModeSelector
        contactMode={contactMode as ContactMode}      // <-- enum unificado
        onContactModeChange={handleContactModeChange}
        form={newContactForm}
        onChange={handleNewContactChange}
        isLoading={isLoading}
        className="mb-4"
      />

      <LeadFormFields
        form={leadFields}
        onChange={handleLeadFieldsChange}
        projectTypes={projectTypes}
        contacts={contacts}
        mode={FormMode.CREATE}
        contactMode={contactMode as ContactMode}      // <-- enum unificado
        showLeadNumber={true}
      />
    </BaseLeadModal>
  );
}
