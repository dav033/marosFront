import { Icon } from "@iconify/react";
import React from "react";

type IconButtonProps = {
  icon: string;
  "aria-label": string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: number; 
};

export default function IconButton({
  icon,
  onClick,
  disabled,
  className = "",
  size = 20,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      <Icon icon={icon} className="text-light-text" style={{ width: size, height: size }} />
    </button>
  );
}
