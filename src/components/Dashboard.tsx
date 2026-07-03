import { useState, useEffect } from 'react';
import { RotateCcw, Sparkles, Printer } from 'lucide-react';
import type { AiPlanResult } from '@/types';
import BusinessFitScore from './BusinessFitScore';
import RecommendationCards from './RecommendationCards';
import FinancePlanner from './FinancePlanner';
import RiskMap from './RiskMap';
import Roadmap from './Roadmap';
import NextStepAdvisor from './NextStepAdvisor';
import Button from './ui/Button';

interface DashboardProps {
  result: AiPlanResult;
  onRestart: () => void;
  onChooseModel?: (id: string) => void;
  chosenModelId?: string;
}

const FOCUS_LABEL: Record<string, string> = {
  discovery: 'Tìm ý tưởng phù hợp',
  finance: 'Kiểm tra khả thi về tài chính',
  growth: 'Tăng trưởng khách hàng',
};

export default function Dashboard({ result, onRestart, onChooseModel, chosenModelId }: DashboardProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setRevealed(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  const revealClass = (delay: string) =>
    `transition-all duration-700 ease-out ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${delay}`;

  return (
    <div className="printable mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className={revealClass('delay-75')}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-eyebrow mb-2">Kế hoạch kinh doanh của bạn</p>
            <h1 className="text-2xl font-extrabold text-sandbox-text sm:text-3xl">
              Đây là nơi ý tưởng của bạn bắt đầu rõ ràng
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-sandbox-muted">
              <Sparkles size={14} className="text-sandbox-cyan" />
              AI gợi ý, bạn quyết định — Trọng tâm giai đoạn này:{' '}
              <span className="font-semibold text-sandbox-cyan">
                {FOCUS_LABEL[result.focusArea] ?? result.focusArea}
              </span>
            </p>
            <p className="mt-1 text-xs text-sandbox-muted">
              AI là trợ lý phân tích và gợi ý, không quyết định thay bạn. Hãy dùng kết quả này làm điểm khởi đầu để kiểm chứng với khách hàng thật.
            </p>
          </div>
          <div className="no-print flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Printer size={15} />}
              onClick={() => window.print()}
            >
              Xuất báo cáo
            </Button>
            <Button variant="ghost" size="sm" icon={<RotateCcw size={15} />} onClick={onRestart}>
              Làm lại từ đầu
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <div className={revealClass('delay-100')}>
          <BusinessFitScore
            score={result.fitScore}
            breakdown={result.fitScoreBreakdown}
            insights={result.fitScoreInsights}
            band={result.fitScoreBand}
          />
        </div>

        <div className={revealClass('delay-200')}>
          <RecommendationCards
            recommendations={result.recommendations}
            chosenModelId={chosenModelId}
            onChoose={onChooseModel}
          />
        </div>

        <div className={revealClass('delay-300')}>
          <FinancePlanner plan={result.financePlan} />
        </div>

        <div className={revealClass('delay-300')}>
          <RiskMap risks={result.risks} />
        </div>

        <div className={revealClass('delay-500')}>
          <Roadmap phases={result.roadmap} />
        </div>

        <div className={revealClass('delay-500')}>
          <NextStepAdvisor nextStep={result.nextStep} />
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-sandbox-muted">
        1 SANDBOX BIZ chỉ cung cấp gợi ý tham khảo — không phải tư vấn tài chính, pháp lý hay thuế chính thức.
      </p>
    </div>
  );
}
