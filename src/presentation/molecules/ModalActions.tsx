// src/presentation/molecules/ModalActions.tsx
import React from "react";

import { Button } from "@/presentation/atoms";

type ModalActionsProps = {
  onCancel: () => void;
  cancelText?: string;
  submitText: string;
  isLoading?: boolean;
  loadingText?: string;
  isSubmitDisabled?: boolean;
  /** Id del <form> a disparar con el botón submit */
  formId?: string;
};

export default function ModalActions({
  onCancel,
  cancelText = "Cancel",
  submitText,
  isLoading = false,
  loadingText = "Saving...",
  isSubmitDisabled = false,
  formId,
}: ModalActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
        {cancelText}
      </Button>
      <Button
        type="submit"
        form={formId}
        disabled={isLoading || isSubmitDisabled}
      >
        {isLoading ? loadingText : submitText}
      </Button>
    </div>
  );
}
