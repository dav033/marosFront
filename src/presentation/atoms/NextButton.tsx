import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export default function NextButton({ loading, disabled, children, ...rest }: Props) {
  const isDisabled = disabled || loading;
  return (
    <button
      type="button"
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center rounded-xl px-4 py-2",
        "text-white",
        isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700",
        "shadow-sm transition-colors"
      ].join(" ")}
      {...rest}
    >
      {loading ? "Loading..." : children ?? "Next"}
    </button>
  );
}
