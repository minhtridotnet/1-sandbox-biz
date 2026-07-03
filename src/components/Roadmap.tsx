import type { RoadmapPhase } from '@/types';

interface RoadmapProps {
  phases: RoadmapPhase[];
}

const PHASE_META: Record<RoadmapPhase['phase'], { label: string; text: string; dot: string }> = {
  '30': { label: '30 ngày', text: 'text-sandbox-cyan', dot: 'bg-sandbox-cyan' },
  '60': { label: '60 ngày', text: 'text-sandbox-gold', dot: 'bg-sandbox-gold' },
  '90': { label: '90 ngày', text: 'text-sandbox-aqua', dot: 'bg-sandbox-aqua' },
};

export default function Roadmap({ phases }: RoadmapProps) {
  return (
    <section>
      <p className="section-eyebrow mb-1">E. Lộ trình 30-60-90 ngày</p>
      <h3 className="mb-4 text-xl font-bold text-sandbox-text">Biết rõ bước tiếp theo của bạn</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {phases.map((phase) => {
          const meta = PHASE_META[phase.phase];
          return (
            <div key={phase.phase} className="card-elevated flex flex-col p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className={`text-2xl font-extrabold ${meta.text}`}>{meta.label}</span>
              </div>
              <h4 className="mb-3 text-sm font-bold text-sandbox-text">{phase.title}</h4>
              <ul className="space-y-2.5">
                {phase.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-sandbox-softText">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
