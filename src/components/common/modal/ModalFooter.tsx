// src/components/common/ModalFooter.tsx
import React, { type ReactNode } from "react";

interface ModalFooterProps {
  children: ReactNode;
}

export default function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div className="flex justify-end space-x-2 px-4 py-3 border-t border-gray-700">
      {children}
    </div>
  );
}
