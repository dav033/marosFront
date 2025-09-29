
import React from "react";

import type { LeadStatus } from "@/features/leads/domain";
import { useCreateLocalLeadController } from "@/presentation/hooks/useCreateLocalLeadController";
import type { CreateLocalLeadModalProps } from "@/types";
import type { ContactMode } from "@/types/enums";
import { FormMode } from "@/types/enums";
import ContactModeSelector, {
  type NewContactForm,
  type NewContactChangeHandler,
} from "../molecules/ContactModeSelector";
import LeadFormFields, {
  type LeadFormFieldsProps,
} from "../molecules/LeadFormFields";
import BaseFormModal from "./BaseFormModal";

function toNumberOrUndefined(v: unknown): number | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

type LeadFieldsForUI = {
  leadNumber: string;
  leadName: string;
  projectTypeId?: number; 
  contactId?: number;     
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
    contactMode,
    handleContactModeChange,
    form,         
    isLoading,
    error,
    handleChange, 
    submit,       
  } = useCreateLocalLeadController({ leadType, onCreated: onLeadCreated });

  
  const newContactForm: NewContactForm = {
    customerName: form.customerName ?? "",
    contactName:  form.contactName  ?? "",
    email:        form.email        ?? "",
    phone:        form.phone        ?? "",
  };

  const handleNewContactChange: NewContactChangeHandler = (key, value) => {
    const v = value ?? ""; 
    handleChange(key as keyof typeof form, v);
  };

  
  const projectTypeIdNum = toNumberOrUndefined(form.projectTypeId);
  const contactIdNum     = toNumberOrUndefined(form.contactId);

  
  
  const leadFields: LeadFieldsForUI = {
    leadNumber: form.leadNumber ?? "",
    leadName:   form.leadName   ?? "",
    ...(projectTypeIdNum !== undefined ? { projectTypeId: projectTypeIdNum } : {}),
    ...(contactIdNum     !== undefined ? { contactId: contactIdNum } : {}),
    location:   form.location   ?? "",
    ...(form.status     ? { status: form.status as "" | LeadStatus } : {}),
    ...(form.startDate  ? { startDate: form.startDate } : {}),
  };

  
  const handleLeadFieldsChange: LeadFormFieldsProps["onChange"] = (field, value) => {
    
    if (field === "projectTypeId" || field === "contactId") {
      const vString = value == null ? "" : String(value);
      handleChange(field as keyof typeof form, vString);
      return;
    }
    const normalized = (value ?? "") as string;
    handleChange(field as keyof typeof form, normalized);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit(form); 
    onClose();
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Lead (solo sistema)"
      error={error ?? null}
      onSubmit={handleModalSubmit}
      submitText="Crear"
      loadingText="Creando..."
      isLoading={isLoading}
    >
      <ContactModeSelector
        contactMode={contactMode as ContactMode}
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
        contactMode={contactMode as ContactMode}
        showLeadNumber
      />
    </BaseFormModal>
  );
}
