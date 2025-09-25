// src/presentation/molecules/ContactModeSwitch.tsx
import React from "react";

import type { GenericSwitchProps } from "@/presentation/atoms/GenericSwitch";
import GenericSwitch from "@/presentation/atoms/GenericSwitch";
import { ContactMode } from "@/types/enums";

export type ContactModeSwitchProps = {
  mode: ContactMode;
  onChange: (mode: ContactMode) => void;
  disabled?: boolean;
  className?: string;
  size?: GenericSwitchProps["size"];
  leftLabel?: React.ReactNode;   // default: "New Contact"
  rightLabel?: React.ReactNode;  // default: "Existing Contact"
};

export default function ContactModeSwitch({
  mode,
  onChange,
  disabled = false,
  className = "",
  size = "md",
  leftLabel = "New Contact",
  rightLabel = "Existing Contact",
}: ContactModeSwitchProps) {
  const value: "left" | "right" =
    mode === ContactMode.NEW_CONTACT ? "left" : "right";

  return (
    <GenericSwitch
      leftLabel={leftLabel}
      rightLabel={rightLabel}
      value={value}
      onChange={(v) =>
        onChange(
          v === "left" ? ContactMode.NEW_CONTACT : ContactMode.EXISTING_CONTACT
        )
      }
      disabled={disabled}
      size={size}
      className={className}
    />
  );
}
