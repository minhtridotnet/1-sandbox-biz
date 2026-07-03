import { Info, Sparkles } from 'lucide-react';
import type { FitCriterionKey, FitInsight, FitScoreBand, FitScoreBreakdown } from '@/types';
import ProgressRing from './ProgressRing';
import Card from './ui/Card';

interface BusinessFitScoreProps {
  score: number;
  breakdown: FitScoreBreakdown;
  insights: { overall: FitInsight; perCriterion: Record<FitCriterionKey, FitInsight> };
  band: FitScoreBand;
}

const TOOLTIP_TEXT =
  'Business Fit Score đo mức độ phù hợp giữa bạn và mô hình kinh doanh dựa trên kỹ năng, thời gian, vốn, kinh nghiệm và mục tiêu cá nhân. Điểm cao không có nghĩa chắc chắn thành công, mà nghĩa là mô hình này phù hợp hơn với điều kiện hiện tại của bạn.';

const CRITERIA: { key: FitCriterionKey; label: string; max: number; explanation: string }[] = [
  { key: 'skillMatch', label: 'Founder Skill Match', max: 25, explanation: 'Kỹ năng bạn đã có khớp với mô hình.' },
  { key: 'timeFit', label: 'Time Commitment Fit', max: 20, explanation: 'Thời gian bạn dành đủ cho mô hình.' },
  { key: 'experience', label: 'Experience & Knowledge Fit', max: 20, explanation: 'Kinh nghiệm ngành và bán hàng.' },
  { key: 'financial', label: 'Financial Fit', max: 20, explanation: 'Vốn phù hợp với nhu cầu mô hình.' },
  { key: 'goalAlignment', label: 'Goal Alignment', max: 15, explanation: 'Mục tiêu cá nhân khớp với mô hình.' },
];

const BAND_LABEL: Record<FitScoreBand, string> = {
  strong: 'Strong Fit',
  moderate: 'Moderate Fit',
  low: 'Low Fit',
};

const BAND_TONE: Record<FitScoreBand, string> = {
  strong: 'border-sandbox-cyan/40 bg-sandbox-cyan/10 text-sandbox-cyan',
  moderate: 'border-sandbox-gold/40 bg-sandbox-gold/10 text-sandbox-gold',
  low: 'border-red-400/40 bg-red-400/10 text-red-300',
};

export default function BusinessFitScore({ score, breakdown, insights, band }: BusinessFitScoreProps) {
  return (
    <Card variant="premium" glow="gold" className="text-center">
      <p className="section-eyebrow mb-4">A. Business Fit Score</p>

      <div className="group relative mx-auto inline-block">
        <ProgressRing value={score} gradientId="fit-score-grad" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-sandbox-text">{Math.round(score)}</span>
          <span className="text-xs text-sandbox-muted">/ 100</span>
        </div>
        <button
          type="button"
          aria-label="Giải thích Business Fit Score"
          className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sandbox-muted transition hover:text-sandbox-cyan focus:outline-none focus:ring-2 focus:ring-sandbox-cyan/50"
        >
          <Info size={14} />
        </button>
        <div
          role="tooltip"
          className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 w-72 -translate-x-1/2 rounded-xl border border-divider bg-sandbox-card px-4 py-3 text-left text-xs leading-relaxed text-sandbox-softText opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          {TOOLTIP_TEXT}
        </div>
      </div>

      <div className={`mx-auto mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold ${BAND_TONE[band]}`}>
        <Sparkles size={12} /> {BAND_LABEL[band]} — {insights.overall.nextAction}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
        {CRITERIA.map((item) => {
          const val = breakdown[item.key];
          const pct = (val / item.max) * 100;
          const insight = insights.perCriterion[item.key];
          return (
            <div key={item.key} className="rounded-lg border border-divider bg-white/[0.02] px-3.5 py-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-sandbox-softText">{item.label}</span>
                <span className="font-semibold text-sandbox-softText">
                  {val}/{item.max}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-sandbox-muted">{item.explanation}</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sandbox-gold to-sandbox-cyan transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-2.5 space-y-1 text-[11px] leading-snug">
                <p className="text-sandbox-muted">
                  <span className="text-sandbox-cyan">Điểm mạnh:</span> {insight.strength}
                </p>
                <p className="text-sandbox-muted">
                  <span className="text-sandbox-gold">Điểm yếu:</span> {insight.weakness}
                </p>
                <p className="text-sandbox-muted">
                  <span className="text-sandbox-text">Nên làm:</span> {insight.nextAction}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-sandbox-cyan/30 bg-sandbox-cyan/5 px-3 py-1 text-xs text-sandbox-cyan">
        <Sparkles size={12} /> Điểm được tính theo quy tắc cố định, không ngẫu nhiên
      </div>
    </Card>
  );
}
