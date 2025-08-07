// src/components/common/ModalBody.tsx
import React, { type ReactNode } from "react";

interface ModalBodyProps {
  children: ReactNode;
}

export default function ModalBody({ children }: ModalBodyProps) {
  return (
    <div className="px-4 py-3 text-light-text flex-1 overflow-auto max-h-[70vh]">
      {children}
    </div>
  );
}
