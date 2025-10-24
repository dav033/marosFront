
import * as React from "react";
import type { ContextMenuOption } from "@/presentation"; 

type ContextMenuPosition = Readonly<{ x: number; y: number }>;

const initialState = {
  isVisible: false,
  position: { x: 0, y: 0 } as ContextMenuPosition,
};

export function useContextMenu() {
  const [state, setState] = React.useState(initialState);

  const handleContextMenu = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      const { clientX: x, clientY: y } = event;
      setState({ isVisible: true, position: { x, y } });
    },
    [],
  );

  const showContextMenu = React.useCallback(
    (event: React.MouseEvent, _options: ContextMenuOption[] = []) => {
      handleContextMenu(event);
    },
    [handleContextMenu],
  );

  const hideContextMenu = React.useCallback(() => {
    setState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const contextMenu = React.useMemo(
    () => ({
      isVisible: state.isVisible,
      position: state.position,
    }),
    [state.isVisible, state.position],
  );

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
  };
}

export default useContextMenu;
