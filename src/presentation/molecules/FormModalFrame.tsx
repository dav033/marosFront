import React, { useId } from "react";

import { Modal } from "@/presentation";

import { ModalBody, ModalFooter, ModalHeader } from ".";

type FormModalFrameProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleId?: string;
  descriptionId?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  headerRightSlot?: React.ReactNode;
  body: React.ReactNode;
  footer: React.ReactNode;
};

const SIZE_MAP: Record<NonNullable<FormModalFrameProps["size"]>, string> = {
  sm: "w-[360px]",
  md: "w-[480px]",
  lg: "w-[640px]",
  xl: "w-[800px]",
};

export default function FormModalFrame({
  isOpen,
  onClose,
  title,
  titleId,
  descriptionId,
  size = "md",
  className = "",
  headerRightSlot,
  body,
  footer,
}: FormModalFrameProps) {
  const autoTitleId = useId();
  const modalTitleId = titleId ?? `modal-title-${autoTitleId}`;
  const modalDescId = descriptionId;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`bg-theme-gray-darker ${SIZE_MAP[size]} max-h-[90vh] h-auto ${className}`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        {...(modalDescId ? { "aria-describedby": modalDescId } : {})}
      >
        {/* Header a ancho completo: el slot derecho vive dentro del propio header */}
        <ModalHeader
          id={modalTitleId}
          title={title}
          onClose={onClose}
          rightSlot={headerRightSlot}
        />

        <ModalBody>{body}</ModalBody>

        <ModalFooter>{footer}</ModalFooter>
      </div>
    </Modal>
  );
}
