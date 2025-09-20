import React from "react";

type OverlayProps = {
  onClick?: () => void;
  className?: string;
};

export default function Overlay({ onClick, className = "" }: OverlayProps) {
  return (
    <div
      aria-hidden="true"
      onClick={onClick}
      className={`fixed inset-0 bg-black/50 ${className}`}
    />
  );
}
