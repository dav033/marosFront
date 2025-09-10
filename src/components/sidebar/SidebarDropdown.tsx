import React, {
  useState,
  useRef,
  useLayoutEffect,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames";
import type { TriggerProps, SidebarDropdownProps } from "@/types";

/**
 * SidebarDropdown
 *  – trigger: { title: string, icon?: string | IconifyIcon, className?: string }
 *  – width:   Tailwind w-* class (ej. "w-full", "w-60")
 *  – children: elementos React; se permite anidar SidebarDropdown dentro de otro
 *  – duration: duración de la transición en milisegundos
 *  – indentLevel: desplazamiento horizontal en px (se incrementa automáticamente en los anidados)
 *  – defaultOpen: si el dropdown debe estar abierto por defecto
 */
export default function SidebarDropdown({
  trigger,
  width = "w-full",
  children,
  duration = 300,
  indentLevel = 0,
  defaultOpen = false,
}: SidebarDropdownProps) {
  /* ---------- estado y refs ---------- */
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [inlineHeight, setInlineHeight] = useState(defaultOpen ? "auto" : "0px"); // '0px' | '<n>px' | 'auto'
  const containerRef = useRef<HTMLDivElement>(null);

  /* ---------- utilidades ---------- */
  const readHeight = () => containerRef.current?.scrollHeight ?? 0;

  /** Abre: fija la altura al scrollHeight para animar */
  const open = () => {
    const fullHeight = readHeight();
    setInlineHeight(`${fullHeight}px`);
  };

  /** Cierra: (1) fija altura actual, (2) anima a 0 */
  const close = () => {
    const fullHeight = readHeight();
    setInlineHeight(`${fullHeight}px`);
    requestAnimationFrame(() => setInlineHeight("0px"));
  };

  /* ---------- reaccionar a isOpen ---------- */
  useLayoutEffect(() => {
    if (isOpen) open();
    else close();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- al finalizar la transición ---------- */
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "height") return;
    if (isOpen) setInlineHeight("auto"); // permite crecimiento libre mientras está abierto
  };

  /* ---------- interacción ---------- */
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  /* ---------- estilos ---------- */
  const paddingLeft = indentLevel ? `${indentLevel}px` : "16px";

  /* ---------- render ---------- */
  return (
    <div className={classNames("relative", width)}>
      {/* ----- disparador ----- */}
      <button
        onClick={handleToggle}
        aria-expanded={isOpen}
        className={classNames(
          "flex items-center cursor-pointer justify-between gap-2 text-gray-300 hover:text-white transition-colors duration-200",
          trigger.className
        )}
        style={{ paddingLeft }}
      >
        <span className="flex items-center gap-2">
          {trigger.icon && <Icon icon={trigger.icon} />}
          {trigger.title}
        </span>

        <Icon
          icon="material-symbols:arrow-drop-down"
          className={classNames(
            "h-4 w-4 flex-shrink-0 transition-transform duration-200",
            { "rotate-180": isOpen }
          )}
        />
      </button>

      {/* ----- contenedor animado ----- */}
      <div
        ref={containerRef}
        onTransitionEnd={handleTransitionEnd}
        className={classNames("overflow-hidden", width)}
        style={{
          height: inlineHeight,
          transition: `height ${duration}ms ease-out`,
        }}
      >
        <div className="py-1" style={{ paddingLeft }}>
          {children}
        </div>
      </div>
    </div>
  );
}
