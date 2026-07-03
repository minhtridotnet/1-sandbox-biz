import { useState } from 'react';
import { Target, Clock, CheckCircle2, Circle } from 'lucide-react';
import type { NextStep } from '@/types';
import Card from './ui/Card';
import Button from './ui/Button';

interface NextStepAdvisorProps {
  nextStep: NextStep;
}

export default function NextStepAdvisor({ nextStep }: NextStepAdvisorProps) {
  const [done, setDone] = useState(nextStep.done);
  const [checked, setChecked] = useState<boolean[]>(() => nextStep.checklist.map(() => false));

  const toggle = (i: number) => setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <Card variant="premium" glow="gold" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sandbox-gold/10 blur-3xl" />
      <p className="section-eyebrow mb-2">F. AI Next Step Advisor</p>
      <div className="flex items-start gap-3">
        <Target size={22} className="mt-0.5 shrink-0 text-sandbox-gold" />
        <div>
          <h3 className="text-lg font-bold text-sandbox-text">Bước tốt nhất nên làm tuần này</h3>
          <p className="mt-1 text-base font-semibold text-sandbox-gold">{nextStep.title}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-sandbox-softText">{nextStep.whyItMatters}</p>

      {nextStep.chosenModelName && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-sandbox-gold/40 bg-sandbox-gold/10 px-3 py-1.5 text-xs font-semibold text-sandbox-gold">
          <CheckCircle2 size={13} /> Mô hình bạn đã chọn: {nextStep.chosenModelName}
        </div>
      )}

      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-divider bg-white/[0.02] px-3 py-1 text-xs text-sandbox-muted">
        <Clock size={13} className="text-sandbox-cyan" />
        {nextStep.timeNeeded}
      </div>

      <div className="mt-5 space-y-2">
        {nextStep.checklist.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className="flex w-full items-start gap-2.5 rounded-lg border border-divider bg-white/[0.02] px-3 py-2.5 text-left text-sm transition hover:border-sandbox-cyan/40"
          >
            {checked[i] ? (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-sandbox-aqua" />
            ) : (
              <Circle size={18} className="mt-0.5 shrink-0 text-sandbox-muted" />
            )}
            <span className={checked[i] ? 'text-sandbox-muted line-through' : 'text-sandbox-softText'}>{item}</span>
          </button>
        ))}
      </div>

      <div className="mt-5">
        <Button
          variant={done ? 'secondary' : 'gold'}
          icon={done ? <CheckCircle2 size={16} /> : <Target size={16} />}
          onClick={() => setDone((d) => !d)}
        >
          {done ? 'Đã đánh dấu hoàn thành' : 'Đánh dấu đã làm xong'}
        </Button>
      </div>
    </Card>
  );
}
