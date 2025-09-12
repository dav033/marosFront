import { GenericButton } from "@components/common/GenericButton";
import Modal from "@components/common/modal/Modal";
import ModalBody from "@components/common/modal/ModalBody";
import ModalFooter from "@components/common/modal/ModalFooter";
import ModalHeader from "@components/common/modal/ModalHeader";
import type { BaseLeadModalProps } from "../types";

export default function BaseLeadModal({
  isOpen,
  onClose,
  title,
  error,
  onSubmit,
  submitText,
  children,
  isLoading = false,
  loadingText = "Saving...",
}: BaseLeadModalProps) {
  const modalTitleId = "base-lead-modal-title";
  const modalDescId = error ? "base-lead-modal-desc" : undefined;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="bg-theme-gray-darker w-[400px] max-h-[90vh] h-auto"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        {...(modalDescId ? { "aria-describedby": modalDescId } : {})}
      >
        <ModalHeader title={title} onClose={onClose} id={modalTitleId} />
        <ModalBody>
          {error && (
            <div
              id={modalDescId}
              className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4"
            >
              {error}
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-3">
            {children}
          </form>
        </ModalBody>
        <ModalFooter>
          <GenericButton
            type="button"
            onClick={onClose}
            className="bg-theme-primary-alt hover:bg-theme-primary-alt/80"
            disabled={isLoading}
          >
            Cancel
          </GenericButton>
          <GenericButton type="submit" onClick={onSubmit} disabled={isLoading}>
            {isLoading ? loadingText : submitText}
          </GenericButton>
        </ModalFooter>
      </div>
    </Modal>
  );
}
