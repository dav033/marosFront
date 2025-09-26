import { Icon as Iconify } from "@iconify/react";
import type { ComponentProps } from "react";

type Props = {
  name: string;
  className?: string;
  inline?: boolean;
  size?: number; // px
} & Omit<ComponentProps<"span">, "children">;

export default function Icon({
  name,
  className = "",
  inline = false,
  size = 16,
  ...rest
}: Props) {
  return (
    <span className={`inline-flex items-center ${className}`} {...rest}>
      <Iconify
        icon={name}
        inline={inline}
        style={{ width: size, height: size }}
      />
    </span>
  );
}
