import React from "react";

import Button from "@/presentation/atoms/Button";

export type FormActionsProps = {
  onCancel: () => void;
  cancelLabel?: string;
  submitLabel: string;
  isLoading?: boolean;
  submitDisabled?: boolean;
  cancelClassName?: string;
  submitClassName?: string;
  submitType?: "submit" | "button";
};

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  cancelLabel = "Cancel",
  submitLabel,
  isLoading,
  submitDisabled,
  cancelClassName = "bg-theme-primary-alt hover:bg-theme-primary-alt/80",
  submitClassName = "",
  submitType = "submit",
}) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        onClick={onCancel}
        className={cancelClassName}
        disabled={isLoading}
      >
        {cancelLabel}
      </Button>
      <Button
        type={submitType}
        disabled={isLoading || submitDisabled}
        className={submitClassName}
      >
        {isLoading ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
};

export default FormActions;
