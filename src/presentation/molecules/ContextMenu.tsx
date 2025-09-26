import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Icon } from "@/presentation/atoms"; // usa tu átomo Icon (Iconify wrapper)

export type ContextMenuOption = {
  id: string | number;
  label: string;
  action: () => void;
  disabled?: boolean;
  danger?: boolean;
  icon?: string | React.ReactNode; // string (Iconify) o nodo personalizado
  separator?: boolean;
};

export type ContextMenuProps = {
  options: ContextMenuOption[];
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
};

export const ContextMenu: React.FC<ContextMenuProps> = ({
  options,
  isVisible,
  position,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getVariantClasses = (isDanger: boolean = false) => {
    return isDanger
      ? "text-red-400 hover:bg-red-500/20 hover:text-red-300"
      : "text-theme-light hover:bg-theme-gray hover:text-theme-light";
  };

  const menu = (
    <div
      ref={menuRef}
      className="fixed z-50 bg-theme-gray-darker border border-theme-gray rounded-lg shadow-xl py-1 min-w-[180px] backdrop-blur-sm"
      style={{ left: position.x, top: position.y }}
      role="menu"
    >
      {options.map((option, index) => {
        if (option.separator) {
          return (
            <div
              key={`${option.id}-${index}`}
              className="mx-2 my-1 border-t border-theme-gray-subtle"
              role="separator"
            />
          );
        }

        const disabled = !!option.disabled;
        const base =
          "w-full flex items-center px-3 py-2 text-sm text-left transition-all duration-150";
        const state = disabled
          ? "text-gray-500 cursor-not-allowed"
          : `cursor-pointer ${getVariantClasses(!!option.danger)}`;

        return (
          <button
            key={option.id}
            type="button"
            role="menuitem"
            onClick={() => {
              if (!disabled) {
                option.action();
                onClose();
              }
            }}
            disabled={disabled}
            aria-disabled={disabled || undefined}
            className={`${base} ${state}`}
          >
            {/* Icono: string (Iconify) o nodo custom; placeholder cuando no hay */}
            {typeof option.icon === "string" && (
              <Icon
                name={option.icon}
                size={16}
                className={`mr-3 ${disabled ? "text-gray-500" : ""}`}
              />
            )}
            {option.icon && typeof option.icon !== "string" && (
              <span
                className={`w-4 h-4 mr-3 flex items-center ${disabled ? "text-gray-500" : ""}`}
              >
                {option.icon}
              </span>
            )}
            {!option.icon && <span className="w-4 h-4 mr-3" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
  return typeof document !== "undefined"
    ? createPortal(menu, document.body)
    : null;
};

/* Hook equivalente al original, conservando el cálculo de límites */
export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<{
    isVisible: boolean;
    position: { x: number; y: number };
  }>({
    isVisible: false,
    position: { x: 0, y: 0 },
  });

  const showContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const { clientX, clientY } = event;
    const menuWidth = 180;
    const menuHeight = 100;

    const adjustedX =
      clientX + menuWidth > window.innerWidth ? clientX - menuWidth : clientX;
    const adjustedY =
      clientY + menuHeight > window.innerHeight
        ? clientY - menuHeight
        : clientY;

    setContextMenu({
      isVisible: true,
      position: { x: adjustedX, y: adjustedY },
    });
  };

  const hideContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, isVisible: false }));
  };

  return { contextMenu, showContextMenu, hideContextMenu };
};
