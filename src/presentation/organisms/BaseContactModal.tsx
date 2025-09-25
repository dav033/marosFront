import React, { useId } from "react";

import FormModalFrame from "@/presentation/molecules/FormModalFrame";
import ModalActions from "@/presentation/molecules/ModalActions";
import ModalErrorBanner from "@/presentation/molecules/ModalErrorBanner";

export type BaseContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  error: string | null | undefined;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  submitText: string;
  cancelText?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  isSubmitDisabled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** opcional si quieres controlar el form id desde fuera */
  formId?: string;
};

/**
 * Organismo fino para modales de Contact:
 * - Renderiza un <form> dentro del body (controlado por formId).
 * - El botón Submit del footer dispara ese form vía form={formId}.
 */
export default function BaseContactModal({
  isOpen,
  onClose,
  title,
  error,
  onSubmit,
  submitText,
  cancelText = "Cancel",
  children,
  isLoading = false,
  loadingText = "Saving...",
  isSubmitDisabled = false,
  size = "md",
  className = "",
  formId,
}: BaseContactModalProps) {
  const autoId = useId();
  const resolvedFormId = formId ?? `contact-form-${autoId}`;
  const descId = error ? `modal-desc-${autoId}` : undefined;

  return (
    <FormModalFrame
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      className={className}
      {...(descId ? { descriptionId: descId } : {})}
      body={
        <>
          {/* only pass id when defined to satisfy exactOptionalPropertyTypes */}
          <ModalErrorBanner {...(descId ? { id: descId } : {})} message={error ?? null} />
          <form id={resolvedFormId} onSubmit={onSubmit} className="space-y-3">
            {children}
          </form>
        </>
      }
      footer={
        <ModalActions
          onCancel={onClose}
          cancelText={cancelText}
          submitText={submitText}
          isLoading={isLoading}
          loadingText={loadingText}
          isSubmitDisabled={isSubmitDisabled}
          formId={resolvedFormId}
        />
      }
    />
  );
}
