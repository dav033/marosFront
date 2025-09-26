
import type { ButtonHTMLAttributes, HTMLAttributes,ReactNode } from "react";
export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean | undefined;
  children: ReactNode;
  className?: string | undefined;
}

export interface IconButtonProps extends Omit<BaseButtonProps, 'children'> {
  icon: string | ReactNode;
  'aria-label': string;
}

export interface GenericButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string | undefined;
  spinner?: ReactNode | undefined;
  className?: string | undefined;
}
export interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}
export interface SidebarItemProps {
  title: string;
  to: string;
  icon?: string;
  currentPath: string;
}
