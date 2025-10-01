// src/presentation/atoms/table/Th.tsx
import * as React from "react";

type Props = React.ThHTMLAttributes<HTMLTableCellElement> & {
  align?: "left" | "center" | "right";
};

export default function Th({ align = "left", className = "", ...rest }: Props) {
  const alignCls =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  return (
    <th
      className={[
        "px-3 py-2 text-sm font-semibold text-base-content/80",
        "bg-base-200 sticky top-0 z-10",
        alignCls,
        className,
      ].join(" ")}
      {...rest}
    />
  );
}
