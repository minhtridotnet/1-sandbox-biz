import { ArrowRight, Users, Sparkles, Map, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from './ui/Button';
import Card from './ui/Card';
import logoWhite from '@/assets/logo-white.png';
import background from '@/assets/background.jpg';

interface HeroProps {
  onStart: () => void;
  onDemo: () => void;
}

interface ValueCard {
  icon: ReactNode;
  title: string;
  desc: string;
}

const VALUE_CARDS: ValueCard[] = [
  {
    icon: <Sparkles size={22} />,
    title: 'Khám phá mô hình phù hợp',
    desc: 'AI gợi ý mô hình kinh doanh vừa với vốn, thời gian và kỹ năng của bạn.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Kiểm tra tài chính & rủi ro',
    desc: 'Tính chi phí, lợi nhuận trên mỗi đơn vị, điểm hòa vốn và rủi ro cần tránh.',
  },
  {
    icon: <Map size={22} />,
    title: 'Lộ trình 30-60-90 ngày',
    desc: 'Biết rõ bước đầu tiên nên làm gì tuần này, tháng này, và 3 tháng tới.',
  },
];

function CircuitLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
      preserveAspectRatio="none"
      viewBox="0 0 1200 600"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="#00D9FF" strokeWidth="1.2">
        <path
          d="M0 120 H220 V60 H460"
          strokeDasharray="6 8"
          className="animate-draw"
        />
        <path
          d="M1200 220 H880 V300 H640"
          strokeDasharray="6 8"
          className="animate-draw"
        />
        <path
          d="M0 420 H180 V360 H420 V300 H560"
          strokeDasharray="6 8"
          className="animate-draw"
        />
        <path
          d="M1200 520 H920 V460 H700"
          strokeDasharray="6 8"
          className="animate-draw"
        />
      </g>
      <g fill="#00D9FF">
        <circle cx="220" cy="60" r="3" />
        <circle cx="460" cy="60" r="3" />
        <circle cx="880" cy="300" r="3" />
        <circle cx="640" cy="300" r="3" />
        <circle cx="420" cy="300" r="3" />
        <circle cx="920" cy="460" r="3" />
      </g>
    </svg>
  );
}

function WaveBottom() {
  return (
    <svg
      className="pointer-events-none absolute bottom-0 left-0 w-full opacity-40"
      viewBox="0 0 1200 80"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 40 C200 70 400 10 600 40 C800 70 1000 10 1200 40"
        stroke="#00D9FF"
        strokeWidth="2"
        style={{ filter: 'drop-shadow(0 0 6px rgba(0,217,255,0.4))' }}
      />
    </svg>
  );
}

export default function Hero({ onStart, onDemo }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 bg-dotted-grid opacity-60" aria-hidden="true" />
      <img
        src={background}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen"
      />
      <CircuitLines />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sandbox-blue/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sandbox-cyan/15 blur-3xl" />
      <WaveBottom />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center md:py-28">
        <img
          src={logoWhite}
          alt="1 SANDBOX BIZ"
          className="mb-3 h-20 w-auto drop-shadow-[0_0_24px_rgba(255,199,44,0.35)] animate-fade-up"
        />

        <p className="section-eyebrow mb-12 animate-fade-up">From Ideas To Real Business</p>

        <h1 className="max-w-5xl text-4xl font-extrabold leading-tight text-sandbox-text animate-fade-up animate-delay-100 md:text-5xl">
          Hiện thực hóa ý tưởng kinh doanh của bạn
        </h1>

        <p className="mt-5 max-w-[46rem] text-base text-sandbox-softText animate-fade-up animate-delay-200 md:text-lg">
          1 SANDBOX BIZ là trợ lý AI cho doanh nghiệp một người — giúp người mới kinh doanh biết bắt đầu từ đâu, cần bao nhiêu vốn và bước tiếp theo là gì.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 animate-fade-up animate-delay-300 sm:flex-row">
          <Button variant="gold" size="lg" icon={<ArrowRight size={18} />} onClick={onStart}>
            Start AI Business Check
          </Button>
          <Button variant="ai" size="lg" icon={<Users size={18} />} onClick={onDemo}>
            Thử với người dùng mẫu
          </Button>
        </div>

        <p className="mt-6 max-w-2xl text-sm text-sandbox-muted animate-fade-up animate-delay-500">
          Bạn không cần biết thuật ngữ kinh doanh. Hãy trả lời từng câu hỏi đơn giản —
          AI sẽ giúp bạn nhìn rõ lựa chọn và rủi ro.
        </p>

        <div className="mt-14 grid w-full gap-4 sm:grid-cols-3">
          {VALUE_CARDS.map((card, i) => (
            <Card
              key={card.title}
              variant="elevated"
              glow="none"
              className={`animate-fade-up animate-delay-${(i + 1) * 100} text-left`}
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyanish bg-sandbox-cyan/10 text-sandbox-cyan">
                {card.icon}
              </div>
              <h3 className="text-base font-bold text-sandbox-text">{card.title}</h3>
              <p className="mt-1.5 text-sm text-sandbox-softText">{card.desc}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12 max-w-2xl animate-fade-up animate-delay-500">
          <p className="rounded-xl border border-sandbox-gold/30 bg-sandbox-gold/5 px-5 py-3 text-sm text-sandbox-softText">
            <span className="font-semibold text-sandbox-gold">KiotViet, Sapo, MISA</span> giúp
            bạn sau khi đã bắt đầu. <span className="font-semibold text-sandbox-gold">1 SANDBOX BIZ</span>{' '}
            giúp bạn trước khi bắt đầu.
          </p>
        </div>
      </div>
    </section>
  );
}
