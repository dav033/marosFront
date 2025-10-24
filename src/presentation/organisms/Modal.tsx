import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

import { Overlay } from '@/presentation';
import type { ModalProps } from '@/types';

const SIZE_MAP = {
  sm: 'w-full max-w-sm',
  md: 'w-full max-w-md',
  lg: 'w-full max-w-lg',
  xl: 'w-full max-w-xl',
  '2xl': 'w-full max-w-2xl',
  full: 'w-screen h-screen rounded-none',
} as const;

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton: _showCloseButton = false,
  className = '',
  overlayClassName = '',
  contentClassName = '',
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;
    prevFocusRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => prevFocusRef.current?.focus?.();
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen || !closeOnEscape || typeof document === 'undefined') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeOnEscape, onClose]);
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const root = panelRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        (last as HTMLElement).focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        (first as HTMLElement).focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const sizeCls = SIZE_MAP[size] ?? SIZE_MAP.md;
  const basePanel = [
    'relative bg-theme-gray-darker rounded-lg shadow-lg z-10 flex flex-col',
    size === 'full' ? 'h-screen' : '',
  ].join(' ');

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <Overlay
        className={overlayClassName}
        {...(closeOnOverlayClick ? { onClick: onClose } : {})}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={`${basePanel} ${sizeCls} ${className} ${contentClassName}`}
      >
        {title && (
          <h2 id={titleId} className="sr-only">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
