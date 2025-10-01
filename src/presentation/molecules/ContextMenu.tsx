import * as React from "react";
import { createPortal } from "react-dom";

export { useContextMenu } from "@/presentation/hooks/useContextMenu";

export type ContextMenuOption = Readonly<{
  id: string | number;
  label?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action?: () => void;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
}>;

export type ContextMenuProps = Readonly<{
  options: ContextMenuOption[];
  isVisible: boolean;
  position: Readonly<{ x: number; y: number }>;
  /** ✅ NUEVO: requerido por TableRow */
  onClose: () => void;
}>;

function getVariantClasses(danger?: boolean) {
  return danger
    ? "text-error hover:bg-error/10"
    : "hover:bg-base-200";
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

  const menu = (
    <div
      ref={ref}
      data-context-menu
      className="fixed z-50 min-w-[200px] rounded-md border bg-base-100 shadow-lg py-1"
      style={{ left: position.x, top: position.y }}
      role="menu"
    >
      <ul className="menu p-1">
        {options.map((opt) =>
          opt.separator ? (
            <li key={`${opt.id}-sep`} className="my-1">
              <div className="divider m-0" />
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
                  "w-full justify-start px-3 py-2 text-sm text-left rounded",
                  opt.disabled ? "opacity-50 pointer-events-none" : getVariantClasses(opt.danger),
                ].join(" ")}
              >
                {opt.icon && <span className="mr-2">{opt.icon}</span>}
                <span>{opt.label}</span>
                {opt.shortcut && (
                  <span className="ml-auto text-xs opacity-70">{opt.shortcut}</span>
                )}
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(menu, document.body) : null;
};

export const ContextMenu = ContextMenuComponent;
export default ContextMenuComponent;
