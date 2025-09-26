import React, { forwardRef } from "react";

export type RadioSize = "sm" | "md" | "lg";

export interface RadioProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "size" | "onChange" | "checked"
  > {
    label?: React.ReactNode;
    hint?: string;
    error?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    size?: RadioSize;
}

const outerBySize: Record<RadioSize, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};
const innerBySize: Record<RadioSize, string> = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};
const textBySize: Record<RadioSize, string> = {
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
};
const gapBySize: Record<RadioSize, string> = {
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
};

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      label,
      hint,
      error,
      checked,
      onChange,
      disabled,
      name,
      id,
      size = "md",
      ...rest
    },
    ref
  ) => {
    const inputId =
      id ?? (name ? `${name}-${String(rest.value ?? "opt")}` : undefined);
    const describedBy: string[] = [];
    if (hint && !error) describedBy.push(`${inputId}-hint`);
    if (error) describedBy.push(`${inputId}-error`);

    return (
      <label
        htmlFor={inputId}
        className={`inline-flex items-start ${gapBySize[size]} ${textBySize[size]} text-theme-light select-none ${className ?? ""}`}
      >
        {/* Input accesible real */}
        <input
          id={inputId}
          ref={ref}
          type="radio"
          name={name}
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={
            describedBy.length ? describedBy.join(" ") : undefined
          }
          onChange={(e) => onChange(e.target.checked)}
          {...rest}
        />

        {/* Círculo visual */}
        <span
          aria-hidden
          className={[
            "grid place-items-center border-[0.75px] rounded-full",
            "bg-theme-dark border-theme-gray",
            "transition-colors",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-theme-primary",
            "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
            "peer-checked:border-theme-primary",
            error ? "border-red-500" : "",
            outerBySize[size],
          ].join(" ")}
        >
          <span
            className={`rounded-full bg-theme-primary ${innerBySize[size]} opacity-0 peer-checked:opacity-100 transition-opacity`}
          />
        </span>

        {/* Etiqueta y mensajes auxiliares */}
        <span className="flex flex-col">
          {label && <span className="leading-5">{label}</span>}
          {hint && !error && (
            <span
              id={`${inputId}-hint`}
              className="text-xs text-gray-400 mt-0.5"
            >
              {hint}
            </span>
          )}
          {error && (
            <span
              id={`${inputId}-error`}
              className="text-xs text-red-400 mt-0.5"
            >
              {error}
            </span>
          )}
        </span>
      </label>
    );
  }
);

Radio.displayName = "Radio";

export default Radio;

/*
Uso básico:
  const [value, setValue] = useState("a");
  <div role="radiogroup" aria-label="Ejemplo">
    <Radio name="ej" value="a" checked={value === "a"} onChange={() => setValue("a")} label="Opción A" />
    <Radio name="ej" value="b" checked={value === "b"} onChange={() => setValue("b")} label="Opción B" />
  </div>
*/
