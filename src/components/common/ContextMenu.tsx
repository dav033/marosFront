// src/components/common/ContextMenu.tsx
import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

export interface ContextMenuOption {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'warning';
  disabled?: boolean;
}

interface ContextMenuProps {
  options: ContextMenuOption[];
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

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
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getVariantClasses = (variant: string = 'default') => {
    switch (variant) {
      case 'danger':
        return 'text-red-400 hover:bg-red-500/20 hover:text-red-300';
      case 'warning':
        return 'text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300';
      default:
        return 'text-theme-light hover:bg-theme-gray hover:text-theme-light';
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-theme-gray-darker border border-theme-gray rounded-lg shadow-xl py-1 min-w-[180px] backdrop-blur-sm"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {options.map((option, index) => {
        if (option.label.includes('─')) {
          return (
            <div 
              key={option.id} 
              className="mx-2 my-1 border-t border-theme-gray-subtle"
            />
          );
        }

        return (
          <button
            key={option.id}
            onClick={() => {
              if (!option.disabled) {
                option.onClick();
                onClose();
              }
            }}
            disabled={option.disabled}
            className={`
              w-full flex items-center px-3 py-2 text-sm text-left
              transition-all duration-150
              ${option.disabled 
                ? 'text-gray-500 cursor-not-allowed' 
                : `cursor-pointer ${getVariantClasses(option.variant)}`
              }
            `}
          >
            <Icon 
              icon={option.icon} 
              className={`w-4 h-4 mr-3 ${option.disabled ? 'text-gray-500' : ''}`} 
            />
            {option.label}
          </button>
        );
      })}
    </div>
  );
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
    const adjustedX = clientX + menuWidth > window.innerWidth 
      ? clientX - menuWidth 
      : clientX;
    const adjustedY = clientY + menuHeight > window.innerHeight 
      ? clientY - menuHeight 
      : clientY;

    setContextMenu({
      isVisible: true,
      position: { x: adjustedX, y: adjustedY },
    });
  };

  const hideContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isVisible: false }));
  };

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
  };
};
