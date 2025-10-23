import React from 'react';

import Icon from './Icon';

type BadgeVariant = 'solid' | 'soft' | 'outline';
type BadgeColor = 'primary' | 'success' | 'warning' | 'danger' | 'gray';
type BadgeSize = 'sm' | 'md' | 'lg';
type BadgeRadius = 'full' | 'sm';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  children?: React.ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  rounded?: BadgeRadius;
  leftIcon?: string;
  uppercase?: boolean;
  disabled?: boolean;
  className?: string;
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-1 text-[11px] leading-tight',
  md: 'px-3 py-1.5 text-xs leading-tight',
  lg: 'px-4 py-2 text-sm leading-tight',
};

const roundedClasses: Record<BadgeRadius, string> = {
  full: 'rounded-full',
  sm: 'rounded-sm',
};

function makeColorClasses(variant: BadgeVariant, color: BadgeColor) {
  switch (variant) {
    case 'outline': {
      switch (color) {
        case 'primary':
          return 'border border-theme-primary text-theme-primary bg-transparent';
        case 'success':
          return 'border border-green-600 text-green-600 bg-transparent';
        case 'warning':
          return 'border border-yellow-500 text-yellow-500 bg-transparent';
        case 'danger':
          return 'border border-red-600 text-red-600 bg-transparent';
        default:
          return 'border border-theme-gray text-theme-light bg-transparent';
      }
    }
    case 'soft': {
      switch (color) {
        case 'primary':
          return 'bg-theme-primary/15 text-theme-primary';
        case 'success':
          return 'bg-green-600/15 text-green-500';
        case 'warning':
          return 'bg-yellow-500/20 text-yellow-400';
        case 'danger':
          return 'bg-red-600/15 text-red-400';
        default:
          return 'bg-theme-gray/20 text-theme-light/90';
      }
    }
    default: {
      switch (color) {
        case 'primary':
          return 'bg-theme-primary text-theme-light';
        case 'success':
          return 'bg-green-600 text-theme-light';
        case 'warning':
          return 'bg-yellow-600 text-theme-light';
        case 'danger':
          return 'bg-red-600 text-theme-light';
        default:
          return 'bg-theme-gray text-theme-light';
      }
    }
  }
}

const base = [
  // Layout
  'inline-flex items-center justify-center gap-1',
  // Consistencia visual y alineación
  'font-medium select-none align-middle',
  // Una sola línea, con elipsis si no cabe
  'max-w-full truncate',
].join(' ');

const iconCls = 'w-4 h-4 shrink-0';

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      label,
      children,
      variant = 'solid',
      color = 'gray',
      size = 'md',
      rounded = 'full',
      leftIcon,
      uppercase = false,
      disabled = false,
      className = '',
      ...rest
    },
    ref,
  ) => {
    const colorClasses = makeColorClasses(variant, color);
    const cn = [
      base,
      sizeClasses[size],
      roundedClasses[rounded],
      colorClasses,
      disabled ? 'opacity-60 cursor-not-allowed' : '',
      uppercase ? 'uppercase' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span
        aria-disabled={disabled || undefined}
        ref={ref}
        className={cn}
        title={typeof children === 'string' ? children : label}
        {...rest}
      >
        {leftIcon && <Icon name={leftIcon} className={iconCls} />}
        {children ?? label}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
export default Badge;
