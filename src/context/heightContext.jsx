// HeightContext.js
import { createContext } from "react";
export const HeightUpdateContext = createContext(() => {});

// SidebarDropdown.jsx
import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useContext,
} from "react";
const HeightContext = HeightUpdateContext;

export default function SidebarDropdown({
  trigger,
  width = "w-full",
  children,
  duration = 300,
  indentLevel = 0,
}) {
  const notifyParent = useContext(HeightContext);
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const dropdownRef = useRef(null);
  const rafId = useRef(null);

  const readHeight = useCallback(
    () => dropdownRef.current?.scrollHeight ?? 0,
    [],
  );
  const writeHeight = useCallback(
    (h) => {
      setHeight(h);
      notifyParent(); // avisamos al padre
    },
    [notifyParent],
  );

  const scheduleHeightUpdate = useCallback(() => {
    if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      writeHeight(readHeight());
    });
  }, [readHeight, writeHeight]);

  useLayoutEffect(() => {
    if (isOpen) scheduleHeightUpdate();
    else writeHeight(0);
    return () => rafId.current != null && cancelAnimationFrame(rafId.current);
  }, [isOpen, scheduleHeightUpdate, writeHeight]);

  // Observador de cambios de tamaño interno
  useLayoutEffect(() => {
    if (!isOpen || !dropdownRef.current) return;
    const ro = new ResizeObserver(scheduleHeightUpdate);
    ro.observe(dropdownRef.current);
    return () => ro.disconnect();
  }, [isOpen, scheduleHeightUpdate]);

  const paddingLeft = indentLevel ? `${indentLevel}px` : "16px";
  const ContextProvider = HeightUpdateContext.Provider;

  return (
    <ContextProvider value={scheduleHeightUpdate}>
      <div className={`relative ${width}`}>
        {/* disparador */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          aria-expanded={isOpen}
          className={`flex items-center justify-between …`}
          style={{ paddingLeft }}
        >
          {/* …Contenido del trigger… */}
        </button>

        {/* animación */}
        <div
          className={`overflow-hidden transition-[height] ease-out ${width}`}
          style={{ height: `${height}px`, transitionDuration: `${duration}ms` }}
        >
          <div ref={dropdownRef} className="py-1" style={{ paddingLeft }}>
            {children}
          </div>
        </div>
      </div>
    </ContextProvider>
  );
}
