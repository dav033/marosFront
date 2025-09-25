import classNames from "classnames";
import * as React from "react";

export type SectionTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center" | "right";
};

export default function SectionTitle({
  title,
  subtitle,
  className,
  align = "left",
}: SectionTitleProps) {
  const alignment =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  return (
    <div className={classNames("mb-4", alignment, className)}>
      <h2 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h2>
      {subtitle ? <p className="text-sm text-gray-500 mt-1">{subtitle}</p> : null}
    </div>
  );
}
