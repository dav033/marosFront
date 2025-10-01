import * as React from "react";

export type ContextMenuOption = Readonly<{
  id: string;
  label?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action?: () => void;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
}>;
export type ContextMenuPosition = Readonly<{ x: number; y: number }>;

type State = Readonly<{
  isVisible: boolean;
  position: ContextMenuPosition;
  options: ContextMenuOption[];
}>;

const HIDDEN: State = { isVisible: false, position: { x: 0, y: 0 }, options: [] };

function clampToViewport(x: number, y: number, w = 200, h = 240) {
  return {
    x: Math.max(0, Math.min(x, window.innerWidth - w)),
    y: Math.max(0, Math.min(y, window.innerHeight - h)),
  };
}

export function useContextMenu() {
  const [state, setState] = React.useState<State>(HIDDEN);

  const showContextMenu = React.useCallback((e: React.MouseEvent, options: ContextMenuOption[]) => {
    e.preventDefault();
    e.stopPropagation();
    const pos = clampToViewport(e.clientX, e.clientY);
    setState({ isVisible: true, position: pos, options });
  }, []);

  const hideContextMenu = React.useCallback(() => {
    setState((prev) => ({ ...prev, isVisible: false, options: [] }));
  }, []);

  React.useEffect(() => {
    if (!state.isVisible) return;
    const onDown = (ev: MouseEvent) => {
      const el = ev.target as HTMLElement | null;
      if (!el?.closest?.("[data-context-menu]")) hideContextMenu();
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") hideContextMenu();
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [state.isVisible, hideContextMenu]);

  return { contextMenu: state, showContextMenu, hideContextMenu };
}
