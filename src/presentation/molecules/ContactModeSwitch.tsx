import React from "react";

import type { GenericSwitchProps } from "@/presentation";
import { GenericSwitch } from "@/presentation";
import { ContactMode } from "@/types";

export type ContactModeSwitchProps = {
  mode: ContactMode;
  onChange: (mode: ContactMode) => void;
  disabled?: boolean;
  className?: string;
  size?: GenericSwitchProps["size"];
  leftLabel?: React.ReactNode;   
  rightLabel?: React.ReactNode;  
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
