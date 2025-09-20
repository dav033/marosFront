// src/presentation/molecules/ModalErrorBanner.tsx
import React from "react";

type ModalErrorBannerProps = {
  id?: string;
  message?: string | null;
  className?: string;
};

export default function ModalErrorBanner({
  id,
  message,
  className = "",
}: ModalErrorBannerProps) {
  if (!message) return null;
  return (
    <div
      id={id}
      className={
        className ||
        "bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4"
      }
    >
      {message}
    </div>
  );
}
