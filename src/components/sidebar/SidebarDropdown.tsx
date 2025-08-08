import React, {
  useRef,
  useLayoutEffect,
  Children,
  isValidElement,
  cloneElement,
  useCallback,
  useMemo,
  useState,
  memo,
} from "react";
import { Icon } from "@iconify/react";
import type { SidebarDropdownProps } from "../../types/types";

const SIDEBAR_DROPDOWN_SYMBOL = Symbol("SidebarDropdown");

const SidebarDropdown = memo(function SidebarDropdown({
  trigger,
  width = "w-full",
  children,
  duration = 300,
  indentLevel = 0,
  id,
  isOpen,
  onToggle,
  currentPath,
}: SidebarDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inlineHeight, setInlineHeight] = useState("0px");

  // Función optimizada para leer altura
  const readHeight = useCallback(
    () => containerRef.current?.scrollHeight ?? 0,
    []
  );

  // Funciones de animación optimizadas
  const open = useCallback(() => {
    const fullHeight = readHeight();
    setInlineHeight(`${fullHeight}px`);
  }, [readHeight]);

  const close = useCallback(() => {
    const fullHeight = readHeight();
    setInlineHeight(`${fullHeight}px`);
    // Usar RAF para suavizar la animación
    requestAnimationFrame(() => setInlineHeight("0px"));
  }, [readHeight]);

  useLayoutEffect(() => {
    if (isOpen) open();
    else close();
  }, [isOpen, open, close]);

  // Event handlers optimizados
  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (e.propertyName === "height" && isOpen) {
        setInlineHeight("auto");
      }
    },
    [isOpen]
  );

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggle(id);
    },
    [onToggle, id]
  );

  // Valores memoizados
  const styles = useMemo(
    () => ({
      button: { paddingLeft: indentLevel ? `${indentLevel}px` : "16px" },
      container: {
        height: inlineHeight,
        transition: `height ${duration}ms ease-out`,
      },
      content: { paddingLeft: indentLevel ? `${indentLevel}px` : "16px" },
    }),
    [indentLevel, inlineHeight, duration]
  );

  const classes = useMemo(
    () => ({
      button: [
        "flex items-center cursor-pointer justify-between gap-2",
        "text-gray-300 hover:text-white transition-colors duration-200",
        trigger.className,
      ]
        .filter(Boolean)
        .join(" "),

      arrow: [
        "h-4 w-4 flex-shrink-0 transition-transform duration-200",
        isOpen && "rotate-180",
      ]
        .filter(Boolean)
        .join(" "),

      container: ["overflow-hidden", width].join(" "),
    }),
    [trigger.className, isOpen, width]
  );

  // Children con props optimizadas - Solución más robusta
  const enhancedChildren = useMemo(
    () =>
      Children.map(children, (child) => {
        if (!isValidElement(child)) return child;

        const childProps = child.props as any;

        // Verificar si es un dropdown anidado checkeando las props específicas
        const isNestedDropdown =
          childProps.hasOwnProperty("id") &&
          childProps.hasOwnProperty("isOpen") &&
          childProps.hasOwnProperty("onToggle") &&
          typeof childProps.onToggle === "function";

        return cloneElement(child, {
          ...childProps,
          indentLevel: isNestedDropdown
            ? indentLevel + 16
            : childProps.indentLevel,
          currentPath,
          onToggle,
        });
      }),
    [children, indentLevel, currentPath, onToggle]
  );

  return (
    <div className={`relative ${width}`}>
      <button
        onClick={handleToggle}
        aria-expanded={isOpen}
        className={classes.button}
        style={styles.button}
      >
        <span className="flex items-center gap-2">
          {trigger.icon && <Icon icon={trigger.icon} />}
          {trigger.title}
        </span>
        <Icon
          icon="material-symbols:arrow-drop-down"
          className={classes.arrow}
        />
      </button>

      <div
        ref={containerRef}
        onTransitionEnd={handleTransitionEnd}
        className={classes.container}
        style={styles.container}
      >
        <div className="py-1" style={styles.content}>
          {enhancedChildren}
        </div>
      </div>
    </div>
  );
});

// Agregar el símbolo para identificación (opcional)
(SidebarDropdown as any)[SIDEBAR_DROPDOWN_SYMBOL] = true;

export default SidebarDropdown;
