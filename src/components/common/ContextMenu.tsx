// src/components/common/ContextMenu.tsx
import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ContextMenuProps } from "../../types/components/common";

export const ContextMenu: React.FC<ContextMenuProps> = ({
  options,
  isVisible,
  position,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getVariantClasses = (isDanger: boolean = false) => {
    if (isDanger) {
      return "text-red-400 hover:bg-red-500/20 hover:text-red-300";
    }
    return "text-theme-light hover:bg-theme-gray hover:text-theme-light";
  };

  if (!isVisible) return null;

  const menu = (
    <div
      ref={menuRef}
      className="fixed z-50 bg-theme-gray-darker border border-theme-gray rounded-lg shadow-xl py-1 min-w-[180px] backdrop-blur-sm"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {options.map((option: ContextMenuOption, index: number) => {
        if (option.separator) {
          return (
            <div
              key={`${option.id}-${index}`}
              className="mx-2 my-1 border-t border-theme-gray-subtle"
            />
          );
        }

        return (
          <button
            key={option.id}
            onClick={() => {
              if (!option.disabled) {
                option.action();
                onClose();
              }
            }}
            disabled={option.disabled}
            className={`
              w-full flex items-center px-3 py-2 text-sm text-left
              transition-all duration-150
              ${
                option.disabled
                  ? "text-gray-500 cursor-not-allowed"
                  : `cursor-pointer ${getVariantClasses(option.danger)}`
              }
            `}
          >
            {option.icon && typeof option.icon === 'string' && (
              <Icon
                icon={option.icon}
                className={`w-4 h-4 mr-3 ${option.disabled ? "text-gray-500" : ""}`}
              />
            )}
            {option.icon && typeof option.icon !== 'string' && (
              <span className={`w-4 h-4 mr-3 flex items-center ${option.disabled ? "text-gray-500" : ""}`}>
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

  // SSR safe + portal fuera del <tbody>
  return typeof document !== "undefined"
    ? createPortal(menu, document.body)
    : null;
};

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

    const menuWidth = 160;
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

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
  };
};
