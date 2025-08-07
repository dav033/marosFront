// src/components/common/GenericSwitch.tsx
import { useState } from "react";

interface GenericSwitchProps {
  leftLabel: string;
  rightLabel: string;
  value: 'left' | 'right';
  onChange: (value: 'left' | 'right') => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GenericSwitch: React.FC<GenericSwitchProps> = ({
  leftLabel,
  rightLabel,
  value,
  onChange,
  disabled = false,
  className = "",
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      container: "h-8 text-xs",
      toggle: "w-4 h-4",
      padding: "p-1"
    },
    md: {
      container: "h-10 text-sm",
      toggle: "w-5 h-5",
      padding: "p-1.5"
    },
    lg: {
      container: "h-12 text-base",
      toggle: "w-6 h-6",
      padding: "p-2"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`relative inline-flex ${currentSize.container} ${className}`}>
      <div 
        className={`
          relative flex items-center justify-between w-full
          bg-theme-gray-darker rounded-full cursor-pointer transition-all duration-300
          border border-theme-gray
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-theme-gray hover:border-theme-gray-alt'}
          ${currentSize.padding}
        `}
        onClick={() => !disabled && onChange(value === 'left' ? 'right' : 'left')}
      >
        <span 
          className={`
            flex-1 text-center font-medium transition-all duration-300 z-10
            ${value === 'left' ? 'text-theme-light' : 'text-gray-400'}
          `}
        >
          {leftLabel}
        </span>
        
        <span 
          className={`
            flex-1 text-center font-medium transition-all duration-300 z-10
            ${value === 'right' ? 'text-theme-light' : 'text-gray-400'}
          `}
        >
          {rightLabel}
        </span>

        <div 
          className={`
            absolute top-1/2 transform -translate-y-1/2
            bg-theme-primary rounded-full shadow-lg
            transition-all duration-300 ease-in-out
            ${value === 'left' ? 'left-1' : 'right-1'}
          `}
          style={{
            width: 'calc(50% - 4px)',
            height: 'calc(100% - 8px)'
          }}
        />
      </div>
    </div>
  );
};
