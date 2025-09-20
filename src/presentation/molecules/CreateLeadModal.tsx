// src/presentation/organisms/leads/CreateLeadModal.tsx
import React from "react";
import { FormMode, ContactMode } from "@/types/enums";
import type { LeadFormData } from "@/types/components/form";
import type { LeadType } from "@/features/leads/enums";
import type { Lead } from "@/features/leads/domain";

import BaseLeadModal from "../organisms/BaseLeadModal";
import LeadFormFields, { type LeadFormFieldsProps } from "./LeadFormFields";
import ContactModeSelector, {
  type NewContactForm,
  type NewContactChangeHandler,
} from "@/presentation/molecules/ContactModeSelector";

import { useCreateLeadVM } from "../hooks/useCreateLeadVM";

export type CreateLeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectTypes: Array<{ id: number; name: string; color: string }>;
  contacts: Array<{
    id: number;
    name: string;
    companyName: string;
    email?: string;
    phone?: string;
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
    contactMode,     // ✅ enum unificado
    setContactMode,  // ✅ (m: ContactMode) => void
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

  // ---------- Adaptador para ContactModeSelector ----------
  const newContactForm: NewContactForm = {
    customerName: form.customerName ?? "",
    contactName:  form.contactName  ?? "",
    email:        form.email        ?? "",
    phone:        form.phone,
  };

  const handleNewContactChange: NewContactChangeHandler = (key, value) => {
    const v = (value ?? "") as string; // normaliza undefined → ""
    handleSafeChange(key as keyof LeadFormData, v);
  };

  // ---------- Adaptador para LeadFormFields ----------
  const leadFields: LeadFormFieldsProps["form"] = {
    leadNumber:   form.leadNumber ?? "",
    leadName:     form.leadName   ?? "",
    projectTypeId: form.projectTypeId,
    contactId:     form.contactId,
    location:     form.location   ?? "",
    status:       (form.status ?? "") as any,
    startDate:    form.startDate ?? undefined,
  };

  const handleLeadFieldsChange: LeadFormFieldsProps["onChange"] = (
    field,
    value
  ) => {
    if (error) setError(null);
    // numéricos opcionales → se permiten undefined
    if (field === "projectTypeId" || field === "contactId") {
      handleSafeChange(field as keyof LeadFormData, value as any);
      return;
    }
    // strings: normalizar undefined → ""
    const normalized = (value ?? "") as string;
    handleSafeChange(field as keyof LeadFormData, normalized as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit();
  };

  return (
    <BaseLeadModal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Lead"
      error={error ?? null}                // ✅ nunca undefined
      onSubmit={handleSubmit}
      submitText="Crear"
      loadingText="Creando..."
      isLoading={isLoading}
      isSubmitDisabled={!canSubmit || isLoading}
    >
      <ContactModeSelector
        contactMode={contactMode}          // ✅ enum unificado
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
        contacts={contacts}
        mode={FormMode.CREATE}
        contactMode={contactMode}          // ✅ enum unificado
        showLeadNumber={showLeadNumber}
      />
    </BaseLeadModal>
  );
}
