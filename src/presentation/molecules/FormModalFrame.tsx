// src/presentation/molecules/FormModalFrame.tsx
import React, { useId } from "react";
import Modal from "@/presentation/organisms/Modal";
import { ModalBody, ModalFooter, ModalHeader } from ".";

type FormModalFrameProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** id del <h2> para aria-labelledby */
  titleId?: string;
  /** id del bloque descriptivo para aria-describedby */
  descriptionId?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Slot opcional (acciones a la derecha del header) */
  headerRightSlot?: React.ReactNode;
  /** Contenido de body (puede incluir el <form>) */
  body: React.ReactNode;
  /** Contenido del footer (botones) */
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
        {/* Header compuesto sin children en ModalHeader */}
        <div className="flex items-center justify-between gap-3">
          <ModalHeader id={modalTitleId} title={title} onClose={onClose} />
          {headerRightSlot ? <div>{headerRightSlot}</div> : null}
        </div>

        <ModalBody>{body}</ModalBody>

        <ModalFooter>{footer}</ModalFooter>
      </div>
    </Modal>
  );
}
