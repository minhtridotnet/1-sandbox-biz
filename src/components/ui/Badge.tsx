import type { ReactNode } from 'react';

type Tone = 'cyan' | 'gold' | 'aqua' | 'risk-low' | 'risk-med' | 'risk-high';

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
}

const TONE_CLASS: Record<Tone, string> = {
  cyan: 'border-sandbox-cyan/40 text-sandbox-cyan bg-sandbox-cyan/10',
  gold: 'border-sandbox-gold/40 text-sandbox-gold bg-sandbox-gold/10',
  aqua: 'border-sandbox-aqua/40 text-sandbox-aqua bg-sandbox-aqua/10',
  'risk-low': 'border-sandbox-aqua/40 text-sandbox-aqua bg-sandbox-aqua/10',
  'risk-med': 'border-sandbox-gold/50 text-sandbox-gold bg-sandbox-gold/10',
  'risk-high': 'border-orange-400/50 text-orange-300 bg-orange-400/10',
};

export default function Badge({ tone = 'cyan', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}
