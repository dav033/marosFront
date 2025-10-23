import React, { useId } from "react";

import { FormModalFrame, ModalActions, ModalErrorBanner } from "@/presentation";

export type BaseFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
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
    formId?: string;
};

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
