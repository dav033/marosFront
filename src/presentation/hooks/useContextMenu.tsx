import { useState } from "react";

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<{
    isVisible: boolean;
    position: { x: number; y: number };
  }>({
    isVisible: false,
    position: { x: 0, y: 0 },
  });

  const showContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const { clientX, clientY } = event;

    const menuWidth = 160;
    const menuHeight = 100;
    const adjustedX =
      clientX + menuWidth > window.innerWidth ? clientX - menuWidth : clientX;
    const adjustedY =
      clientY + menuHeight > window.innerHeight
        ? clientY - menuHeight
        : clientY;

    setContextMenu({
      isVisible: true,
      position: { x: adjustedX, y: adjustedY },
    });
  };

  const hideContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, isVisible: false }));
  };

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
  };
};