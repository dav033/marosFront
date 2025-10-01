import React from "react";
import { useIsFetching } from "@tanstack/react-query";

/**
 * Barra de progreso superior que aparece cuando hay requests en curso.
 * No requiere configuración: basta con renderizarla una vez en la app.
 */
export default function TopLoader() {
  const fetching = useIsFetching(); // número de queries/mutations activas
  const visible = fetching > 0;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: visible ? 3 : 0,
        width: "100%",
        zIndex: 9999,
        overflow: "hidden",
        transition: "height 150ms ease",
        background:
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.15) 80%, rgba(255,255,255,0) 100%)",
      }}
    >
      {visible && (
        <div
          style={{
            height: "100%",
            width: "30%",
            animation: "toploader 1.2s linear infinite",
            background: "currentColor",
          }}
          className="bg-theme-primary"
        />
      )}

      <style>
        {`@keyframes toploader {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }`}
      </style>
    </div>
  );
}
