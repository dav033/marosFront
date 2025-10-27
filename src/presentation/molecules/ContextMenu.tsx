// eslint-env browser
import * as React from "react";
import { createPortal } from "react-dom";

import type { ContextMenuOption } from "@/presentation"; 
import { Icon } from "@/presentation";

export type ContextMenuProps = Readonly<{
  options: ContextMenuOption[];
  isVisible: boolean;
  position: Readonly<{ x: number; y: number }>;
  onClose: () => void; 
}>;

function getVariantClasses(danger?: boolean) {
  return danger ? "text-red-400 hover:bg-red-500/10" : "hover:bg-theme-primary/10";
}

const ContextMenuComponent: React.FC<ContextMenuProps> = ({
  options,
  isVisible,
  position,
  onClose,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isVisible) return;

    const handleDown = (ev: MouseEvent) => {
      const el = ev.target as HTMLElement | null;
      if (!el?.closest?.("[data-context-menu]")) onClose();
    };
    const handleEsc = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleDown);
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const renderIcon = (icon?: React.ReactNode | string) => {
    if (!icon) return null;
    if (typeof icon === "string") return <Icon name={icon} className="mr-2" size={16} />;
    return <span className="mr-2">{icon}</span>;
  };

  const menu = (
    <div
      ref={ref}
      data-context-menu
      className="fixed z-50 min-w-[200px] rounded-md border border-gray-700 bg-theme-dark text-theme-light shadow-xl py-1"
      style={{ left: position.x, top: position.y }}
      role="menu"
      aria-label="Context menu"
    >
      <ul className="list-none m-0 p-1 flex flex-col">
        {options.map((opt, idx) =>
          opt.separator ? (
            <li key={`${opt.id}-${idx}`} role="separator" className="my-1">
              <div className="h-px bg-gray-700" />
            </li>
          ) : (
            <li key={opt.id}>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  if (!opt.disabled) {
                    opt.action?.();
                    onClose();
                  }
                }}
                disabled={opt.disabled}
                className={[
                  "w-full inline-flex items-center justify-start gap-2",
                  "px-3 py-2 text-sm text-left rounded",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary",
                  opt.disabled ? "opacity-50 cursor-not-allowed" : getVariantClasses(opt.danger),
                ].join(" ")}
              >
                {renderIcon(opt.icon)}
                <span className="truncate">{opt.label}</span>
                {opt.shortcut && <span className="ml-auto text-xs text-gray-400">{opt.shortcut}</span>}
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(menu, document.body) : null;
};

export const ContextMenu = ContextMenuComponent;
export default ContextMenuComponent;
