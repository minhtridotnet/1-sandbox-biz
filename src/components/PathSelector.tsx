import type { ReactNode } from 'react';
import { Compass, Calculator, TrendingUp, ArrowRight } from 'lucide-react';
import type { UserPath } from '@/types';
import { PATH_META } from '@/data/questions';
import Card from './ui/Card';
import Button from './ui/Button';

interface PathSelectorProps {
  onSelect: (path: UserPath) => void;
}

const PATHS: { id: UserPath; icon: ReactNode }[] = [
  { id: 'discover', icon: <Compass size={24} /> },
  { id: 'feasibility', icon: <Calculator size={24} /> },
  { id: 'grow', icon: <TrendingUp size={24} /> },
];

export default function PathSelector({ onSelect }: PathSelectorProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-20 text-center">
        <p className="section-eyebrow mb-3">Khám phá hướng kinh doanh phù hợp</p>
        <h2 className="text-3xl font-bold text-sandbox-text md:text-4xl">Bạn đang ở giai đoạn nào?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sandbox-softText">
          Chọn tình huống gần nhất với bạn. AI sẽ hỏi vài câu đơn giản và gợi ý hướng đi phù hợp.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        {PATHS.map((p) => {
          const meta = PATH_META[p.id];
          return (
            <Card key={p.id} variant="elevated" glow="none" className="flex animate-fade-up flex-col">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-cyanish bg-sandbox-cyan/10 text-sandbox-cyan">
                {p.icon}
              </div>
              <h3 className="text-lg font-bold text-sandbox-text">{meta.title}</h3>
              <p className="mt-2 text-sm text-sandbox-softText">{meta.subtitle}</p>
              <p className="mt-4 rounded-lg border border-divider bg-white/[0.02] px-3 py-2.5 text-xs italic text-sandbox-muted">
                {meta.story}
              </p>
              <div className="mt-6 pt-2">
                <Button
                  variant="ai"
                  className="w-full"
                  icon={<ArrowRight size={16} />}
                  onClick={() => onSelect(p.id)}
                >
                  Chọn mục này
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
