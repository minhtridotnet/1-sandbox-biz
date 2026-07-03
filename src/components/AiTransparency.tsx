import type { ReactNode } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

const AI_INPUTS = [
  'Số vốn bắt đầu',
  'Thời gian mỗi tuần',
  'Kỹ năng hiện có',
  'Ý tưởng sản phẩm',
  'Khách hàng mục tiêu',
  'Mục tiêu thu nhập',
  'Khả năng chịu rủi ro',
  'Giai đoạn kinh doanh hiện tại',
];

const AI_PROCESS = [
  'Phân loại giai đoạn của người dùng',
  'Ghép hồ sơ với các mô hình kinh doanh phù hợp',
  'Ước tính tài chính cơ bản',
  'Đánh dấu rủi ro phổ biến khi mới bắt đầu',
  'Tạo lộ trình và bước tiếp theo',
];

const AI_OUTPUTS = [
  'Mô hình kinh doanh được gợi ý',
  'Bảng tài chính cơ bản',
  'Bản đồ rủi ro',
  'Lộ trình 30-60-90 ngày',
  'Bước tiếp theo tốt nhất',
];

const USER_BENEFITS = [
  'Bớt bối rối khi chưa biết bắt đầu từ đâu',
  'Giảm rủi ro ở giai đoạn đầu',
  'Bước đầu tiên rõ ràng hơn',
  'Lập kế hoạch kinh doanh dễ tiếp cận hơn',
];

export default function AiTransparency() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10 text-center">
        <p className="section-eyebrow mb-3">AI minh bạch</p>
        <h2 className="text-3xl font-bold text-sandbox-text md:text-4xl">
          Cách 1 SANDBOX BIZ sử dụng AI
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sandbox-softText">
          AI trong 1 SANDBOX BIZ hoạt động theo quy tắc cố định, minh bạch và có giới hạn rõ ràng — để bạn hiểu được nó làm gì và không làm gì.
        </p>
      </header>

      {/* Input → Process → Output diagram */}
      <div className="mb-12 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <PipelineColumn
          tone="cyan"
          icon={<Sparkles size={20} />}
          title="Đầu vào"
          subtitle="Bạn cung cấp"
          items={AI_INPUTS}
        />
        <FlowArrow />
        <PipelineColumn
          tone="gold"
          icon={<Cpu size={20} />}
          title="Quy trình AI"
          subtitle="1 SANDBOX BIZ xử lý"
          items={AI_PROCESS}
        />
        <FlowArrow />
        <PipelineColumn
          tone="aqua"
          icon={<CheckCircle2 size={20} />}
          title="Kết quả"
          subtitle="Bạn nhận được"
          items={AI_OUTPUTS}
        />
      </div>

      {/* User benefit */}
      <div className="mb-10 animate-fade-up rounded-2xl border border-cyanish bg-sandbox-elevated p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <ShieldCheck size={20} className="text-sandbox-aqua" />
          <h3 className="text-base font-bold text-sandbox-text">Lợi ích của bạn</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {USER_BENEFITS.map((b) => (
            <div key={b} className="flex items-start gap-2.5 text-sm text-sandbox-softText">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-sandbox-aqua" />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-sandbox-muted">
        1 SANDBOX BIZ là công cụ hỗ trợ ra quyết định, không thay thế chuyên gia tài chính, pháp lý hay kế toán. Mọi quyết định cuối cùng thuộc về bạn.
      </p>
    </section>
  );
}

interface PipelineColumnProps {
  tone: 'cyan' | 'gold' | 'aqua';
  icon: ReactNode;
  title: string;
  subtitle: string;
  items: string[];
}

const TONE_STYLE: Record<PipelineColumnProps['tone'], { ring: string; text: string; dot: string }> = {
  cyan: {
    ring: 'border-sandbox-cyan/30 bg-sandbox-cyan/[0.05]',
    text: 'text-sandbox-cyan',
    dot: 'bg-sandbox-cyan',
  },
  gold: {
    ring: 'border-sandbox-gold/30 bg-sandbox-gold/[0.05]',
    text: 'text-sandbox-gold',
    dot: 'bg-sandbox-gold',
  },
  aqua: {
    ring: 'border-sandbox-aqua/30 bg-sandbox-aqua/[0.05]',
    text: 'text-sandbox-aqua',
    dot: 'bg-sandbox-aqua',
  },
};

function PipelineColumn({ tone, icon, title, subtitle, items }: PipelineColumnProps) {
  const style = TONE_STYLE[tone];
  return (
    <div className={`flex flex-col rounded-2xl border p-5 ${style.ring}`}>
      <div className="mb-1 flex items-center gap-2">
        <span className={style.text}>{icon}</span>
        <h3 className="text-sm font-bold text-sandbox-text">{title}</h3>
      </div>
      <p className="mb-4 text-xs text-sandbox-muted">{subtitle}</p>
      <ul className="space-y-2.5 text-sm">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sandbox-softText">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex items-center justify-center text-sandbox-muted md:py-0">
      <ArrowRight size={22} className="rotate-90 md:rotate-0" />
    </div>
  );
}
