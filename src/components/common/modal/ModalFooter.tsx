// src/components/common/ModalFooter.tsx
import React from "react";
import type { ModalFooterProps } from "../../../types/components/modal";

export default function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div className="flex justify-end space-x-2 px-4 py-3 border-t border-gray-700">
      {children}
    </div>
  );
}
