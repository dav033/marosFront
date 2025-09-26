// src/presentation/organisms/CreateLocalLeadModal.tsx
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

/** Convierte string | number | null | undefined → number | undefined */
function toNumberOrUndefined(v: unknown): number | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

type LeadFieldsForUI = {
  leadNumber: string;
  leadName: string;
  projectTypeId?: number; // números para <LeadFormFields />
  contactId?: number;     // números para <LeadFormFields />
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
    form,         // estado del controlador (puede tener strings)
    isLoading,
    error,
    handleChange, // típicamente: (k: keyof LeadFormData, v: string) => void
    submit,       // requiere formData
  } = useCreateLocalLeadController({ leadType, onCreated: onLeadCreated });

  // Adaptador para ContactModeSelector (inputs controlados con string)
  const newContactForm: NewContactForm = {
    customerName: form.customerName ?? "",
    contactName:  form.contactName  ?? "",
    email:        form.email        ?? "",
    phone:        form.phone        ?? "",
  };

  const handleNewContactChange: NewContactChangeHandler = (key, value) => {
    const v = value ?? ""; // normaliza undefined → ""
    handleChange(key as keyof typeof form, v);
  };

  // Normalizamos IDs a number para <LeadFormFields />, sin incluir propiedades undefined
  const projectTypeIdNum = toNumberOrUndefined(form.projectTypeId);
  const contactIdNum     = toNumberOrUndefined(form.contactId);

  // Adaptador para LeadFormFields respetando exactOptionalPropertyTypes:
  // solo incluimos la propiedad si hay valor definido.
  const leadFields: LeadFieldsForUI = {
    leadNumber: form.leadNumber ?? "",
    leadName:   form.leadName   ?? "",
    ...(projectTypeIdNum !== undefined ? { projectTypeId: projectTypeIdNum } : {}),
    ...(contactIdNum     !== undefined ? { contactId: contactIdNum } : {}),
    location:   form.location   ?? "",
    ...(form.status     ? { status: form.status as "" | LeadStatus } : {}),
    ...(form.startDate  ? { startDate: form.startDate } : {}),
  };

  // Firma EXACTA que expone <LeadFormFields />
  const handleLeadFieldsChange: LeadFormFieldsProps["onChange"] = (field, value) => {
    // El componente puede pasar number | string | undefined → el controller espera string
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
    await submit(form); // <-- el hook exige 'formData'
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
        form={leadFields}                 // ids como number (solo si existen)
        onChange={handleLeadFieldsChange} // devuelve string al controller
        projectTypes={projectTypes}
        contacts={contacts}
        mode={FormMode.CREATE}
        contactMode={contactMode as ContactMode}
        showLeadNumber
      />
    </BaseFormModal>
  );
}
