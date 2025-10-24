import classNames from "classnames";
import * as React from "react";

export type PdfButtonProps = {
  onClick?: () => void | Promise<void>;
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline";
};

export default function PdfButton({
  onClick,
  children = "Generar PDF",
  className,
  loading = false,
  disabled = false,
  variant = "primary",
}: PdfButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-xl text-sm px-4 py-2 transition border shadow-sm";
  const primary =
    "bg-gray-900 text-white border-gray-900 hover:bg-gray-800 active:bg-gray-900";
  const outline =
    "bg-white text-gray-900 border-gray-300 hover:bg-gray-50 active:bg-white";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={classNames(
        base,
        variant === "primary" ? primary : outline,
        (disabled || loading) && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 9V2h12v7" />
        <path d="M6 18h12v4H6z" />
        <path d="M6 14h12" />
      </svg>
      {loading ? "Generando..." : children}
    </button>
  );
}
