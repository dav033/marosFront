// src/presentation/organisms/EditContactModal.tsx
import React from "react";
import BaseContactModal from "@/presentation/organisms/BaseContactModal";
import ContactForm from "@/presentation/molecules/ContactForm";
import type { Contacts } from "@/features/contact/domain/models/Contact";
import { useEditContactController } from "@/presentation/hooks/useEditContactController";

export type EditContactModalProps = {
  isOpen: boolean;
  onClose: (shouldRefetch?: boolean) => void;
  contact: Contacts | null;
  onContactUpdated: (updated: Contacts) => Promise<void> | void;
  submitting?: boolean;
  serverError?: string;
};

/**
 * Wrapper SIN hooks: filtra el caso `contact === null`.
 * Así evitamos un hook condicional.
 */
export default function EditContactModal(props: EditContactModalProps) {
  if (!props.contact) return null;
  return <EditContactModalInner {...(props as EditContactModalInnerProps)} contact={props.contact} />;
}

type EditContactModalInnerProps = Omit<EditContactModalProps, "contact"> & {
  contact: Contacts; // aquí ya garantizamos non-null
};

/**
 * Componente interno con hooks: siempre se montan en el mismo orden.
 */
function EditContactModalInner({
  isOpen,
  onClose,
  contact,
  onContactUpdated,
  submitting,
  serverError,
}: EditContactModalInnerProps) {
  const { form, setField, submit, isLoading, error, setError } =
    useEditContactController({ contact, onSubmit: onContactUpdated });

  const loading = submitting ?? isLoading;
  const err = serverError ?? error;

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await submit();
    if (ok) onClose(true); // refetch
  };

  return (
    <BaseContactModal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title="Edit Contact"
      error={err}
      onSubmit={handleModalSubmit}
      submitText="Update Contact"
      loadingText="Updating..."
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
    </BaseContactModal>
  );
}
