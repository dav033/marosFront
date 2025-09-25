// src/presentation/molecules/BaseLeadModal.tsx
import React, { useId } from "react";
import type { BaseLeadModalProps } from "../../types";
import FormModalFrame from "../molecules/FormModalFrame";
import ModalActions from "../molecules/ModalActions";
import ModalErrorBanner from "../molecules/ModalErrorBanner";



/**
 * Organismo para modales con formulario (agnóstico al caso de uso).
 * - Renderiza un <form> dentro del body con onSubmit.
 * - El botón Submit del footer dispara el form via form={formId}.
 * - Error accesible via aria-describedby.
 */
export default function BaseLeadModal({
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
}: BaseLeadModalProps) {
  const autoId = useId();
  const resolvedFormId = formId ?? `form-${autoId}`;
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
          <ModalErrorBanner {...(descId ? { id: descId } : {})} message={error} />
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
