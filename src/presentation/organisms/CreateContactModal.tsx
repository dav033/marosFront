import React from "react";

import { useCreateContactController } from "@/presentation/hooks/useCreateContactController";
import ContactForm from "@/presentation/molecules/ContactForm";
import BaseFormModal from "@/presentation/organisms/BaseFormModal";
import type { ContactFormData } from "@/types";

export type CreateContactModalProps = {
  isOpen: boolean;
  onClose: (shouldRefetch?: boolean) => void;
  onSubmit: (values: ContactFormData) => Promise<void> | void;
  /** opcionales si quieres forzar estado desde arriba (legacy compat) */
  submitting?: boolean;
  serverError?: string;
};

export default function CreateContactModal({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  serverError,
}: CreateContactModalProps) {
  const { form, setField, submit, isLoading, error, setError } =
    useCreateContactController({ onSubmit });

  const loading = submitting ?? isLoading;
  const err = serverError ?? error;

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await submit();
    if (ok) onClose(true);
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title="Create Contact"
      error={err}
      onSubmit={handleModalSubmit}
      submitText={loading ? "Saving." : "Save"}
      isLoading={loading}
    >
      <ContactForm
        form={form}
        onChange={(k, v) => {
          if (err) setError(null);
          setField(k, v);
        }}
        disabled={loading}
      />
    </BaseFormModal>
  );
}
