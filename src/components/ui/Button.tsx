import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'gold' | 'ai' | 'ghost' | 'secondary';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

const VARIANT_CLASS: Record<Variant, string> = {
  gold: 'btn-gold',
  ai: 'btn-ai',
  ghost: 'btn-ghost',
  secondary: 'btn-secondary',
};

const SIZE_CLASS: Record<Size, string> = {
  sm: 'text-xs px-4 py-2',
  md: 'text-sm px-5 py-3',
  lg: 'text-base px-6 py-3.5',
};

export default function Button({
  variant = 'gold',
  size = 'md',
  icon,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className ?? ''}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
