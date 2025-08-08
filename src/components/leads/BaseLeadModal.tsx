import React from 'react';
import { GenericButton } from '@components/common/GenericButton';
import Modal from '@components/common/modal/Modal';
import ModalBody from '@components/common/modal/ModalBody';
import ModalFooter from '@components/common/modal/ModalFooter';
import ModalHeader from '@components/common/modal/ModalHeader';

interface BaseLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
  children: React.ReactNode;
}

export default function BaseLeadModal({
  isOpen,
  onClose,
  title,
  isLoading,
  error,
  onSubmit,
  submitText,
  children,
}: BaseLeadModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="bg-theme-gray-darker w-[400px] max-h-[90vh] h-auto"
    >
      <ModalHeader title={title} onClose={onClose} />
      <ModalBody>
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4">
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
        <GenericButton
          type="submit"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? `${submitText}...` : submitText}
        </GenericButton>
      </ModalFooter>
    </Modal>
  );
}
