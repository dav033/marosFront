import { useCallback,useEffect, useState } from "react";

const NAVIGATION_EVENTS = [
  "astro:page-load",
  "astro:after-swap",
  "popstate",
  "hashchange",
] as const;

export function useSidebarNavigation() {
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname
  );

  const updateCurrentPath = useCallback(() => {
    const path = window.location.pathname;

    setCurrentPath((prevPath) => {
      if (prevPath === path) return prevPath;

      // Auto-abrir dropdowns relevantes
      setOpenDropdowns((prevOpen) => {
        const newOpenDropdowns = new Set(prevOpen);

        if (path.startsWith("/leads/")) {
          newOpenDropdowns.add("leads");
        }

        if (path.startsWith("/reports/")) {
          newOpenDropdowns.add("reports");
          newOpenDropdowns.add("reports-remodelation");
        }

        return newOpenDropdowns;
      });

      return path;
    });
  }, []);

  useEffect(() => {
    updateCurrentPath();

    // MutationObserver más eficiente
    const observer = new MutationObserver((mutations) => {
      // Solo verificar si hay cambios relevantes
      const hasRelevantChanges = mutations.some(
        (mutation) =>
          mutation.type === "attributes" &&
          mutation.attributeName === "data-astro-transition-scope"
      );

      if (hasRelevantChanges) {
        const newPath = window.location.pathname;
        if (newPath !== currentPath) {
          updateCurrentPath();
        }
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-astro-transition-scope"],
      subtree: false, // Reducir el scope
    });

    // Agregar event listeners
    NAVIGATION_EVENTS.forEach((event) => {
      document.addEventListener(
        event as keyof DocumentEventMap,
        updateCurrentPath
      );
    });

    return () => {
      observer.disconnect();
      NAVIGATION_EVENTS.forEach((event) => {
        document.removeEventListener(
          event as keyof DocumentEventMap,
          updateCurrentPath
        );
      });
    };
  }, [updateCurrentPath, currentPath]);

  const toggleDropdown = useCallback((id: string) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const isDropdownOpen = useCallback(
    (id: string) => {
      return openDropdowns.has(id);
    },
    [openDropdowns]
  );

  return {
    currentPath,
    openDropdowns,
    toggleDropdown,
    isDropdownOpen,
  };
}
