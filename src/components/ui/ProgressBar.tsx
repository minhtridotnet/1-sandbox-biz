interface ProgressBarProps {
  value: number;
  max: number;
  tone?: 'cyan' | 'aqua';
  label?: string;
}

export default function ProgressBar({ value, max, tone = 'cyan', label }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const barColor = tone === 'aqua' ? 'bg-sandbox-aqua' : 'bg-sandbox-cyan';
  const glow = tone === 'aqua' ? 'shadow-[0_0_12px_rgba(20,241,217,0.55)]' : 'shadow-[0_0_12px_rgba(0,217,255,0.55)]';

  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center justify-between text-xs text-sandbox-muted">
          <span>{label}</span>
          <span className="font-semibold text-sandbox-softText">
            {value}/{max}
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full border border-cyanish bg-white/5">
        <div
          className={`h-full rounded-full ${barColor} ${glow} transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
