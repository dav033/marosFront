import React, { useId } from "react";

import FormModalFrame from "@/presentation/molecules/FormModalFrame";
import ModalActions from "@/presentation/molecules/ModalActions";
import ModalErrorBanner from "@/presentation/molecules/ModalErrorBanner";

export type BaseFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** Acepta null/undefined para compatibilidad con llamadas existentes */
  error?: string | null;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  submitText: string;
  cancelText?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  isSubmitDisabled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Si se pasa, el botón submit del footer dispara este form */
  formId?: string;
};

/**
 * Modal base genérico para formularios:
 * - Renderiza un <form> en el body (controlado por formId).
 * - El botón Submit del footer dispara ese form vía form={formId}.
 * - Error accesible vía aria-describedby cuando existe.
 */
export default function BaseFormModal({
  isOpen,
  onClose,
  title,
  error = null,
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
}: BaseFormModalProps) {
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
          {/* Solo pasar id cuando exista descripción (exactOptionalPropertyTypes) */}
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
