// src/presentation/atoms/DateInput.tsx
import React from "react";

import Icon from "./Icon";
import Input, { type InputProps } from "./Input";

export interface DateInputProps
  extends Omit<InputProps, "type" | "value" | "onChange"> {
  /** Valor en formato YYYY-MM-DD (vacío para sin fecha) */
  value?: string;
  /** Devuelve el valor en formato YYYY-MM-DD (o "" si limpias) */
  onChange: (value: string) => void;
  /** Límites nativos del input date (YYYY-MM-DD) */
  min?: string;
  max?: string;
  /** Muestra un botón para limpiar el valor */
  withClear?: boolean;
  /** Permite cambiar el icono izquierdo por defecto */
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
