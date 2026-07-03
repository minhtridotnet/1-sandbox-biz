import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import type { AnswerValue, GoalScale, IncomeFocus, PriorityOrientation, UserProfile, UserPath } from '@/types';
import { QUESTIONS_BY_PATH, PATH_META } from '@/data/questions';
import { loadDraftAnswers, saveDraftAnswers, clearDraftAnswers } from '@/lib/storage';
import ProgressBar from './ui/ProgressBar';
import QuestionCard from './QuestionCard';
import Button from './ui/Button';

interface InterviewWizardProps {
  path: UserPath;
  onComplete: (profile: UserProfile) => void;
  onBack: () => void;
}

function num(v: AnswerValue | undefined): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim()) {
    const cleaned = v.replace(/[.,\s]/g, '');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function leadingDigit(v: AnswerValue | undefined): number {
  if (typeof v !== 'string') return 0;
  const m = v.match(/\d/);
  return m ? Number(m[0]) : 0;
}

function mapIncomeFocus(v: string): IncomeFocus {
  if (v.startsWith('Có việc')) return 'job';
  if (v.startsWith('Cân bằng')) return 'balance';
  return 'business';
}

function mapPriority(v: string): PriorityOrientation {
  if (v.startsWith('Ít rủi ro')) return 'low-risk';
  if (v.startsWith('Lợi nhuận')) return 'profit';
  if (v.startsWith('Phù hợp với kỹ năng')) return 'skills';
  return 'long-term';
}

function mapGoalScale(v: string): GoalScale {
  return v.startsWith('Mục tiêu lớn hơn') ? 'bigger' : 'small';
}

function buildProfile(path: UserPath, answers: Record<string, AnswerValue>): UserProfile {
  const str = (id: string): string => (typeof answers[id] === 'string' ? (answers[id] as string) : '');
  const arr = (id: string): string[] => (Array.isArray(answers[id]) ? (answers[id] as string[]) : []);
  const bool = (id: string): boolean | undefined =>
    typeof answers[id] === 'boolean' ? (answers[id] as boolean) : undefined;

  const ptRaw = str('productType').toLowerCase();
  const productType: UserProfile['productType'] = ptRaw.includes('dịch vụ')
    ? 'service'
    : ptRaw.includes('cả hai')
      ? 'both'
      : 'product';

  const riskRaw = str('riskTolerance');
  const riskTolerance: UserProfile['riskTolerance'] = riskRaw.startsWith('Cao')
    ? 'high'
    : riskRaw.startsWith('Trung')
      ? 'medium'
      : 'low';

  const modeRaw = str('businessMode');
  const businessMode: UserProfile['businessMode'] = modeRaw.includes('Kết hợp')
    ? 'hybrid'
    : modeRaw.startsWith('Offline')
      ? 'offline'
      : 'online';

  const fearRaw = str('biggestFear');
  const fearOther = str('biggestFear_other');
  const biggestFear = fearRaw === 'Khác' && fearOther.trim() ? fearOther.trim() : fearRaw;

  return {
    path,
    answers,
    capital: num('capital'),
    hoursPerWeek: num('hoursPerWeek'),
    skills: arr('skills'),
    productType,
    targetCustomers: str('targetCustomers'),
    incomeGoal: num('incomeGoal'),
    biggestFear,
    hasSoldBefore: bool('hasSoldBefore') ?? (path === 'grow'),
    hasProductIdea: bool('hasProductIdea') ?? (path !== 'discover'),
    productIdeaDescription: str('productIdeaDescription') || undefined,
    preferredChannel: str('preferredChannel'),
    riskTolerance,
    businessMode,
    capitalTightness: leadingDigit(answers['capitalTightness']) || 3,
    incomeFocus: mapIncomeFocus(str('incomeFocus')) || 'balance',
    industryExperience: leadingDigit(answers['industryExperience']) || 1,
    marketFamiliarity: leadingDigit(answers['marketFamiliarity']) || 3,
    priorityOrientation: mapPriority(str('priorityOrientation')) || 'low-risk',
    goalScale: mapGoalScale(str('goalScale')) || 'small',
    currentShopScale: str('currentShopScale') || undefined,
  };
}

function isAnswered(value: AnswerValue | undefined): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.length > 0;
  return false;
}

export default function InterviewWizard({ path, onComplete, onBack }: InterviewWizardProps) {
  const questions = QUESTIONS_BY_PATH[path];
  const meta = PATH_META[path];

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [phase, setPhase] = useState<'answering' | 'loading'>('answering');

  useEffect(() => {
    const draft = loadDraftAnswers(path);
    if (draft) {
      setStepIndex(Math.min(draft.stepIndex, questions.length - 1));
      setAnswers(draft.answers);
    }
  }, [path, questions.length]);

  useEffect(() => {
    if (phase === 'answering') {
      saveDraftAnswers(path, { stepIndex, answers });
    }
  }, [path, stepIndex, answers, phase]);

  const current = questions[stepIndex];
  const isLast = stepIndex === questions.length - 1;
  const answered = isAnswered(answers[current.id]);
  const needsOtherText =
    current.allowOther && !current.multi && answers[current.id] === 'Khác';
  const canAdvance = answered && (!needsOtherText || isAnswered(answers[`${current.id}_other`]));

  const setAnswer = (value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const setOther = (text: string) => {
    setAnswers((prev) => ({ ...prev, [`${current.id}_other`]: text }));
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      onBack();
    } else {
      setStepIndex((i) => i - 1);
    }
  };

  const handleNext = () => {
    if (!canAdvance) return;
    if (isLast) {
      setPhase('loading');
      clearDraftAnswers(path);
      window.setTimeout(() => {
        onComplete(buildProfile(path, answers));
      }, 1800);
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  if (phase === 'loading') {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="card-premium glow-cyan w-full animate-fade-up p-10">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-sandbox-cyan/40 bg-sandbox-cyan/10 text-sandbox-cyan">
            <Loader2 size={30} className="animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-sandbox-text">Đang tạo kế hoạch kinh doanh của bạn</h2>
          <p className="mt-3 text-sm text-sandbox-softText">
            AI đang phân tích vốn, thời gian, kỹ năng và mức rủi ro của bạn…
          </p>
          <div className="mt-6 space-y-2 text-left">
            {[
              'Phân loại giai đoạn kinh doanh',
              'Đối chiếu hồ sơ với các mô hình phù hợp',
              'Tính chi phí, lợi nhuận và điểm hòa vốn',
              'Xác định rủi ro và bước tiếp theo',
            ].map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-2.5 text-xs text-sandbox-muted animate-fade-up"
                style={{ animationDelay: `${i * 220}ms` }}
              >
                <Sparkles size={14} className="text-sandbox-cyan" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <header className="mb-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-sandbox-muted transition hover:text-sandbox-cyan"
        >
          <ArrowLeft size={14} /> Thay đổi tình huống
        </button>
        <p className="section-eyebrow mb-2">AI Business Discovery Interview</p>
        <h2 className="text-2xl font-bold text-sandbox-text">{meta.title}</h2>
      </header>

      <ProgressBar
        value={stepIndex + 1}
        max={questions.length}
        label="Tiến độ phỏng vấn"
        tone="cyan"
      />

      <div key={current.id} className="card-premium mt-6 animate-fade-up p-7">
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-sandbox-cyan">
          Câu {stepIndex + 1}/{questions.length}
        </div>
        <h3 className="text-lg font-bold leading-snug text-sandbox-text">{current.prompt}</h3>
        {current.helper && <p className="mt-2 text-sm text-sandbox-muted">{current.helper}</p>}
        <div className="mt-5">
          <QuestionCard
            question={current}
            value={answers[current.id]}
            onChange={setAnswer}
            otherValue={typeof answers[`${current.id}_other`] === 'string' ? (answers[`${current.id}_other`] as string) : ''}
            onOtherChange={setOther}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={handleBack}>
          Quay lại
        </Button>
        <Button
          variant={isLast ? 'gold' : 'ai'}
          icon={isLast ? <Sparkles size={16} /> : <ArrowRight size={16} />}
          onClick={handleNext}
          disabled={!canAdvance}
        >
          {isLast ? 'Generate My Business Plan' : 'Tiếp tục'}
        </Button>
      </div>
    </section>
  );
}
