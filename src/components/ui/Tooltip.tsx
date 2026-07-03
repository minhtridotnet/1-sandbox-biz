import type { ReactNode } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  text: string;
  children?: ReactNode;
  iconClassName?: string;
  className?: string;
}

export default function Tooltip({ text, children, iconClassName, className }: TooltipProps) {
  return (
    <span className={`group relative inline-flex items-center gap-1 ${className ?? ''}`}>
      {children}
      <span
        tabIndex={0}
        role="button"
        aria-label="Xem giải thích"
        className="inline-flex cursor-help items-center text-sandbox-muted transition hover:text-sandbox-cyan focus:outline-none focus:ring-2 focus:ring-sandbox-cyan/40 rounded-full"
      >
        <Info size={13} className={iconClassName} />
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-xl border border-divider bg-sandbox-card px-3.5 py-2.5 text-left text-xs leading-relaxed text-sandbox-softText opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
