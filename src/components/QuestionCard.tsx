import type { AnswerValue, Question } from '@/types';
import { formatMoneyGrouped } from '@/lib/format';

interface QuestionCardProps {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  otherValue?: string;
  onOtherChange?: (text: string) => void;
}

const OTHER_LABEL = 'Khác';

export default function QuestionCard({ question, value, onChange, otherValue, onOtherChange }: QuestionCardProps) {
  if (question.type === 'chips' && question.options) {
    const multiArr: string[] = question.multi && Array.isArray(value) ? value : [];
    const singleStr: string = !question.multi && typeof value === 'string' ? value : '';
    const otherActive = question.allowOther && !question.multi && singleStr === OTHER_LABEL;

    const toggle = (opt: string) => {
      if (question.multi) {
        const next = multiArr.includes(opt) ? multiArr.filter((o) => o !== opt) : [...multiArr, opt];
        onChange(next);
      } else {
        onChange(opt);
      }
    };

    const isActive = (opt: string) => (question.multi ? multiArr.includes(opt) : singleStr === opt);

    return (
      <div className="flex flex-wrap gap-2.5">
        {question.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`chip ${isActive(opt) ? 'chip-active' : ''}`}
          >
            {opt}
          </button>
        ))}
        {otherActive && onOtherChange && (
          <input
            className="input-field mt-3 w-full"
            type="text"
            placeholder="Viết nỗi lo / khó khăn thật của bạn"
            value={otherValue ?? ''}
            onChange={(e) => onOtherChange(e.target.value)}
            autoFocus
          />
        )}
      </div>
    );
  }

  if (question.type === 'text') {
    return (
      <input
        className="input-field w-full"
        type="text"
        placeholder={question.placeholder}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (question.type === 'number') {
    const isMoney = question.unit === 'VND' || question.unit === 'VND/tháng' || question.unit === 'VND/đơn vị';
    const rawStr = typeof value === 'string' ? value : typeof value === 'number' ? String(value) : '';
    const display = isMoney ? formatMoneyGrouped(rawStr) : rawStr;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isMoney) {
        const digits = e.target.value.replace(/\D/g, '');
        onChange(digits);
      } else {
        onChange(e.target.value);
      }
    };

    return (
      <div className="flex items-center gap-3">
        <input
          className="input-field flex-1"
          type="text"
          inputMode="numeric"
          min={0}
          placeholder={question.placeholder}
          value={display}
          onChange={handleChange}
        />
        {question.unit && (
          <span className="whitespace-nowrap text-sm text-sandbox-muted">{question.unit}</span>
        )}
      </div>
    );
  }

  if (question.type === 'boolean') {
    const val = typeof value === 'boolean' ? value : undefined;
    return (
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`chip ${val === true ? 'chip-active' : ''}`}
        >
          Có
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`chip ${val === false ? 'chip-active' : ''}`}
        >
          Không
        </button>
      </div>
    );
  }

  return null;
}
