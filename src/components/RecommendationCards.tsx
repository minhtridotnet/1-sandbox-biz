import { useState } from 'react';
import { Coins, Clock, FlaskConical, Radio, ChevronDown, Check, Users, Wrench, Trophy, AlertTriangle, Swords, BarChart3, Settings2 } from 'lucide-react';
import type { BusinessRecommendation } from '@/types';
import { formatCompactVND } from '@/lib/format';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface RecommendationCardsProps {
  recommendations: BusinessRecommendation[];
  chosenModelId?: string;
  onChoose?: (id: string) => void;
}

function riskTone(level: BusinessRecommendation['riskLevel']) {
  return level === 'Low' ? 'risk-low' : level === 'Medium' ? 'risk-med' : 'risk-high';
}

function riskLabel(level: BusinessRecommendation['riskLevel']) {
  return level === 'Low' ? 'Rủi ro thấp' : level === 'Medium' ? 'Rủi ro trung bình' : 'Rủi ro cao';
}

export default function RecommendationCards({ recommendations, chosenModelId, onChoose }: RecommendationCardsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <section>
      <p className="section-eyebrow mb-1">B. Mô hình kinh doanh gợi ý</p>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h3 className="text-xl font-bold text-sandbox-text">AI gợi ý để bạn khám phá và chọn</h3>
        <p className="text-xs text-sandbox-muted">Chạm vào mỗi mô hình để xem chi tiết, rồi tự chọn mô hình phù hợp với bạn.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((rec) => {
          const open = expandedId === rec.id;
          const chosen = chosenModelId === rec.id;
          return (
            <Card key={rec.id} variant="elevated" glow={chosen ? 'gold' : 'cyan'} className="flex flex-col">
              <button
                type="button"
                onClick={() => toggle(rec.id)}
                aria-expanded={open}
                className="flex items-start justify-between gap-3 text-left"
              >
                <div className="flex items-center gap-2">
                  {chosen && <Check size={16} className="shrink-0 text-sandbox-gold" />}
                  <h4 className="text-base font-bold text-sandbox-text">{rec.name}</h4>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge tone={riskTone(rec.riskLevel)}>{riskLabel(rec.riskLevel)}</Badge>
                  <ChevronDown
                    size={18}
                    className={`text-sandbox-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Users size={15} className="mt-0.5 shrink-0 text-sandbox-cyan" />
                  <span className="text-sandbox-muted">
                    Phù hợp với: <span className="font-semibold text-sandbox-softText">{rec.fitsWhom}</span>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Coins size={15} className="mt-0.5 shrink-0 text-sandbox-gold" />
                  <span className="text-sandbox-muted">
                    Cần vốn: <span className="font-semibold text-sandbox-softText">{rec.needsCapital}</span>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={15} className="mt-0.5 shrink-0 text-sandbox-cyan" />
                  <span className="text-sandbox-muted">
                    Cần thời gian: <span className="font-semibold text-sandbox-softText">{rec.needsTime}</span>
                  </span>
                </div>
              </div>

              {open && (
                <div className="mt-4 space-y-4 border-t border-divider pt-4 text-sm animate-fade-up">
                  <p className="text-sandbox-softText">{rec.whyItFits}</p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-divider bg-white/[0.02] px-3 py-2.5">
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-sandbox-cyan">
                        <Trophy size={13} /> Ưu điểm
                      </p>
                      <ul className="space-y-1 text-xs text-sandbox-softText">
                        {rec.pros.map((p) => (
                          <li key={p} className="flex gap-1.5">
                            <span className="text-sandbox-cyan">+</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-divider bg-white/[0.02] px-3 py-2.5">
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-sandbox-gold">
                        <AlertTriangle size={13} /> Rủi ro
                      </p>
                      <ul className="space-y-1 text-xs text-sandbox-softText">
                        {rec.risks.map((r) => (
                          <li key={r} className="flex gap-1.5">
                            <span className="text-sandbox-gold">!</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-sandbox-softText">
                    <div className="flex items-start gap-2">
                      <Wrench size={13} className="mt-0.5 shrink-0 text-sandbox-cyan" />
                      <span>
                        <span className="text-sandbox-muted">Kỹ năng cần có: </span>
                        {rec.requiredSkills.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <BarChart3 size={13} className="mt-0.5 shrink-0 text-sandbox-cyan" />
                      <span>
                        <span className="text-sandbox-muted">Mức độ kỹ năng: </span>
                        {rec.skillLevel}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Swords size={13} className="mt-0.5 shrink-0 text-sandbox-cyan" />
                      <span>
                        <span className="text-sandbox-muted">Mức độ cạnh tranh: </span>
                        {rec.competition}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Settings2 size={13} className="mt-0.5 shrink-0 text-sandbox-cyan" />
                      <span>
                        <span className="text-sandbox-muted">Cách vận hành: </span>
                        {rec.howItOperates}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-divider pt-3">
                    <div className="flex gap-2">
                      <FlaskConical size={15} className="mt-0.5 shrink-0 text-sandbox-cyan" />
                      <span className="text-sandbox-softText">{rec.firstExperiment}</span>
                    </div>
                    <div className="flex gap-2">
                      <Radio size={15} className="mt-0.5 shrink-0 text-sandbox-cyan" />
                      <span className="text-sandbox-softText">{rec.firstChannel}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-divider pt-3">
                    <span className="text-xs text-sandbox-muted">
                      Vốn ước tính: <span className="font-semibold text-sandbox-text">{formatCompactVND(rec.estimatedCapital)} đ</span>
                    </span>
                    {onChoose && (
                      <Button
                        variant={chosen ? 'secondary' : 'gold'}
                        size="sm"
                        icon={chosen ? <Check size={15} /> : undefined}
                        onClick={() => onChoose(rec.id)}
                        disabled={chosen}
                      >
                        {chosen ? 'Đã chọn mô hình này' : 'Chọn mô hình này'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-sandbox-muted">
        AI gợi ý các mô hình dựa trên hồ sơ của bạn — bạn tự chọn mô hình phù hợp nhất. Khi chọn, AI sẽ điều chỉnh kế hoạch tài chính và bước tiếp theo theo mô hình bạn chọn.
      </p>
    </section>
  );
}
