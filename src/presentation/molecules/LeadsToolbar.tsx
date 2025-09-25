// src/presentation/molecules/leads/LeadsToolbar.tsx
import React from "react";

import Button from "../atoms/Button"; 

export const LeadsToolbar: React.FC<{
  onCreate: () => void;
  onCreateLocal: () => void;
  disabled?: boolean;
  createLabel?: string;
}> = ({ onCreate, onCreateLocal, disabled, createLabel = "Create lead" }) => (
  <div className="flex items-center gap-2">
    <Button className="text-sm" onClick={onCreate} disabled={disabled}>{createLabel}</Button>
    <Button className="text-sm" onClick={onCreateLocal} disabled={disabled}>
      Create lead locally (don’t sync to ClickUp)
    </Button>
  </div>
);
