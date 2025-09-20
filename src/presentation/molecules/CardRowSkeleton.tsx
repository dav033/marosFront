// src/presentation/molecules/CardRowSkeleton.tsx
import React from "react";
import SkeletonBlock from "@/presentation/atoms/SkeletonBlock";

export type LineItem = { w: string; h?: number };

export type CardRowSkeletonProps = {
  /** Ítems (ancho/alto) de la primera línea */
  line1?: ReadonlyArray<LineItem>;
  /** Ítems (ancho/alto) de la segunda línea */
  line2?: ReadonlyArray<LineItem>;
  /** Cantidad de “acciones” a la derecha (botones fantasma) */
  actions?: number;
  /** Alto de cada acción en px */
  actionH?: number;
  /** Clase de ancho Tailwind para cada acción (ej: "w-8") */
  actionWClass?: string;
  /** Clases extra */
  className?: string;
  /** Clases del contenedor “card” */
  containerClassName?: string;
  /** Desactiva el pulso */
  pulse?: boolean;
};

const DEFAULT_LINE1: LineItem[] = [
  { w: "w-1/4", h: 16 },
  { w: "w-1/3", h: 16 },
  { w: "w-1/5", h: 16 },
  { w: "w-1/6", h: 16 },
];

const DEFAULT_LINE2: LineItem[] = [
  { w: "w-2/5", h: 12 },
  { w: "w-1/4", h: 12 },
];

export default function CardRowSkeleton({
  line1 = DEFAULT_LINE1,
  line2 = DEFAULT_LINE2,
  actions = 2,
  actionH = 32,
  actionWClass = "w-8",
  className = "",
  containerClassName = "bg-theme-gray-darker shadow rounded-lg p-4 space-y-3 border border-theme-gray",
  pulse = true,
}: CardRowSkeletonProps) {
  return (
    <div className={`${pulse ? "animate-pulse" : ""} ${className}`}>
      <div className={containerClassName}>
        {/* Línea 1 */}
        <div className="flex space-x-4">
          {line1.map(({ w, h = 16 }, i) => (
            <SkeletonBlock key={`l1-${i}`} h={h} className={w} />
          ))}
        </div>

        {/* Línea 2 */}
        <div className="flex space-x-4">
          {line2.map(({ w, h = 12 }, i) => (
            <SkeletonBlock key={`l2-${i}`} h={h} className={w} />
          ))}
        </div>

        {/* Acciones derecha */}
        {actions > 0 && (
          <div className="flex justify-end space-x-2 mt-3">
            {Array.from({ length: actions }).map((_, i) => (
              <SkeletonBlock
                key={`act-${i}`}
                h={actionH}
                className={actionWClass}
                rounded="lg"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
