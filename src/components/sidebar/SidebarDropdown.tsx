import { Icon } from "@iconify/react";
import classNames from "classnames";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";

import type { SidebarDropdownProps } from "@/types";

export default function SidebarDropdown({
  trigger,
  width = "w-full",
  children,
  duration = 300,
  indentLevel = 0,
  defaultOpen = false,
}: SidebarDropdownProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
  const [inlineHeight, setInlineHeight] = useState(defaultOpen ? "auto" : "0px"); 
  const containerRef = useRef<HTMLDivElement>(null);

  const readHeight = useCallback(() => containerRef.current?.scrollHeight ?? 0, []);

  const open = useCallback(() => {
    const fullHeight = readHeight();
    setInlineHeight(`${fullHeight}px`);
  }, [readHeight]);

  const close = useCallback(() => {
    const fullHeight = readHeight();
    setInlineHeight(`${fullHeight}px`);
    // Guard for SSR: use globalThis.requestAnimationFrame if available
    const raf = globalThis && typeof globalThis.requestAnimationFrame === "function"
      ? globalThis.requestAnimationFrame.bind(globalThis)
      : (cb: FrameRequestCallback) => cb(0);
    raf(() => setInlineHeight("0px"));
  }, [readHeight]);

  useLayoutEffect(() => {
    if (isOpen) open();
    else close();
  }, [isOpen, open, close]);

    const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "height") return;
    if (isOpen) setInlineHeight("auto"); 
  };

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

    const paddingLeft = indentLevel ? `${indentLevel}px` : "16px";

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
