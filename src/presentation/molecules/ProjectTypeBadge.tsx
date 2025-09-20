import React from "react";
import Badge from "@/presentation/atoms/Badge";
import type { ProjectTypeBadgeProps } from "@/types/components/badges";

/** Normaliza un color a hex válido (#RRGGBB) o devuelve fallback */
function normalizeHex(c?: string, fallback = "#BDBDBD"): string {
  if (!c) return fallback;
  const s = c.trim();
  // admite "#rgb", "#rrggbb" o "rrggbb"
  const hex = s.startsWith("#") ? s.slice(1) : s;
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    // expandir #rgb -> #rrggbb
    const r = hex[0], g = hex[1], b = hex[2];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return `#${hex}`.toUpperCase();
  }
  // Si vino algo tipo 'red' o invalido, usa fallback
  return fallback;
}

/** Calcula color de texto legible (blanco o casi negro) según luminancia */
function readableTextFor(bgHex: string): string {
  const hex = bgHex.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  // luminancia relativa (sRGB)
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

  return L > 0.5 ? "#111827" /* slate-900 aprox */ : "#FFFFFF";
}

export default function ProjectTypeBadge({ projectType, className = "" }: ProjectTypeBadgeProps) {
  if (!projectType || !projectType.name) {
    return (
      <Badge
        label="N/A"
        rounded="sm"
        uppercase
        className={`w-full justify-center ${className}`}
        // Sobrescribimos colores vía style para manejar color libre
        style={{ backgroundColor: "#BDBDBD", color: "#FFFFFF" }}
      />
    );
  }

  const bg = normalizeHex(projectType.color, "#BDBDBD");
  const fg = readableTextFor(bg);

  return (
    <Badge
      label={projectType.name}
      rounded="sm"
      uppercase
      className={`w-full justify-center ${className}`}
      style={{ backgroundColor: bg, color: fg }}
      title={projectType.name}
    />
  );
}
