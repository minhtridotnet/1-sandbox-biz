import type { ReactNode } from 'react';

type Variant = 'base' | 'elevated' | 'premium';
type Glow = 'cyan' | 'gold' | 'none';

interface CardProps {
  variant?: Variant;
  glow?: Glow;
  className?: string;
  children: ReactNode;
}

const VARIANT_CLASS: Record<Variant, string> = {
  base: 'card-base',
  elevated: 'card-elevated',
  premium: 'card-premium',
};

const GLOW_CLASS: Record<Glow, string> = {
  cyan: 'glow-cyan',
  gold: 'glow-gold',
  none: '',
};

export default function Card({
  variant = 'premium',
  glow = 'none',
  className,
  children,
}: CardProps) {
  return (
    <div
      className={`${VARIANT_CLASS[variant]} ${GLOW_CLASS[glow]} p-6 ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
