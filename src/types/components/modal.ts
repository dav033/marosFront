import type { ReactNode } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger" | "warning" | "success";
  loading?: boolean;
}

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: "info" | "success" | "warning" | "error";
  buttonText?: string;
}

export interface FormModalProps extends Omit<ModalProps, "children"> {
  formComponent: ReactNode;
  loading?: boolean;
  submitDisabled?: boolean;
}

export interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  id?: string;
  rightSlot?: ReactNode;
}

export interface ModalBodyProps {
  children: ReactNode;
}

export interface ModalFooterProps {
  children: ReactNode;
}
