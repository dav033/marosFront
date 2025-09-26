import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode };

export default function TableRoot({ children, className = "", ...rest }: Props) {
  return (
    <div
      className={`overflow-x-auto shadow-md rounded-lg bg-theme-dark text-theme-light ${className}`}
      {...rest}
    >
      <table className="w-full table-fixed custom-table text-theme-light">{children}</table>
    </div>
  );
}
