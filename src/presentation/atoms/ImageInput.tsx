
import * as React from "react";
import classNames from "classnames";

export type ImageInputProps = {
  label?: string;
  value?: string | null; // Data URL o URL remota existente
  accept?: string;       // por defecto "image/*"
  maxSizeMB?: number;    // por defecto 5MB
  onChange: (file: File | null, dataUrl?: string | null) => void;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  squarePreview?: boolean; // true => recuadro cuadrado, false => 4:3
};

export default function ImageInput({
  label = "Imagen",
  value = null,
  accept = "image/*",
  maxSizeMB = 5,
  onChange,
  helperText,
  required,
  disabled = false,
  className,
  squarePreview = true,
}: ImageInputProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = React.useState<string | null>(value ?? null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  function toDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFile(file: File) {
    setError(null);
    if (!file) return;
    const maxBytes = maxSizeMB * 1024 * 1024;

    if (!file.type.startsWith("image/")) {
      setError("El archivo seleccionado no es una imagen válida.");
      return;
    }
    if (file.size > maxBytes) {
      setError(`La imagen supera ${maxSizeMB} MB.`);
      return;
    }
    const dataUrl = await toDataURL(file);
    setPreview(dataUrl);
    onChange(file, dataUrl);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function clear() {
    setPreview(null);
    setError(null);
    onChange(null, null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className={classNames(className, disabled && "opacity-70 pointer-events-none")}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>

      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={classNames(
            "rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50",
            "disabled:opacity-60"
          )}
          disabled={disabled}
        >
          {preview ? "Cambiar imagen" : "Seleccionar imagen"}
        </button>

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Vista previa"
              className={classNames(
                "object-cover rounded-xl border border-gray-200 shadow-sm",
                squarePreview ? "h-24 w-24" : "h-24 w-32"
              )}
            />
            <button
              type="button"
              onClick={clear}
              className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full w-8 h-8 text-sm shadow hover:bg-gray-50"
              aria-label="Eliminar imagen"
              title="Eliminar imagen"
            >
              ×
            </button>
          </div>
        ) : (
          <div
            className={classNames(
              "rounded-xl border-2 border-dashed border-gray-300 grid place-items-center text-xs text-gray-500",
              squarePreview ? "h-24 w-24" : "h-24 w-32"
            )}
          >
            Sin imagen
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onInputChange}
        disabled={disabled}
      />

      <div className="mt-2 text-xs text-gray-500">
        {helperText ?? "Formatos recomendados: PNG/JPG. Máx 5MB."}
      </div>
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </div>
  );
}
