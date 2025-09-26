import React from "react";

import Icon from "./Icon";
import Input, { type InputProps } from "./Input";

export interface DateInputProps
  extends Omit<InputProps, "type" | "value" | "onChange"> {
    value?: string;
    onChange: (value: string) => void;
    min?: string;
  max?: string;
    withClear?: boolean;
    leftIconName?: string;
}

export default function DateInput({
  value = "",
  onChange,
  min,
  max,
  withClear = false,
  leftIconName = "material-symbols:calendar-today",
  leftAddon,
  rightAddon,
  disabled,
  ...rest
}: DateInputProps) {
  return (
    <Input
      type="date"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      min={min}
      max={max}
      disabled={disabled}
      leftAddon={leftAddon ?? <Icon name={leftIconName} />}
      rightAddon={
        withClear && value && !rightAddon ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1 rounded hover:bg-theme-gray-subtle disabled:opacity-50"
            aria-label="Clear date"
            disabled={disabled}
          >
            <Icon name="material-symbols:close" />
          </button>
        ) : (
          rightAddon
        )
      }
      {...rest}
    />
  );
}
