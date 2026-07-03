import type { ReactNode } from 'react';
import { Compass, Calculator, TrendingUp, ArrowRight, MapPin } from 'lucide-react';
import type { Persona, UserProfile, UserPath } from '@/types';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';

interface PersonaDemoProps {
  personas: Persona[];
  onSelect: (profile: UserProfile) => void;
}

type FocusKey = 'discovery' | 'finance' | 'growth';

function focusKeyFor(path: UserPath): FocusKey {
  if (path === 'discover') return 'discovery';
  if (path === 'feasibility') return 'finance';
  return 'growth';
}

const FOCUS_META: Record<
  FocusKey,
  { tone: 'cyan' | 'gold' | 'aqua'; badge: string; icon: ReactNode; avatar: string; text: string; button: 'gold' | 'ai' }
> = {
  discovery: {
    tone: 'cyan',
    badge: 'Business Discovery',
    icon: <Compass size={22} />,
    avatar: 'border-sandbox-cyan/40 bg-sandbox-cyan/10 text-sandbox-cyan',
    text: 'text-sandbox-cyan',
    button: 'ai',
  },
  finance: {
    tone: 'gold',
    badge: 'Feasibility & Finance',
    icon: <Calculator size={22} />,
    avatar: 'border-sandbox-gold/40 bg-sandbox-gold/10 text-sandbox-gold',
    text: 'text-sandbox-gold',
    button: 'gold',
  },
  growth: {
    tone: 'aqua',
    badge: 'Growth Roadmap',
    icon: <TrendingUp size={22} />,
    avatar: 'border-sandbox-aqua/40 bg-sandbox-aqua/10 text-sandbox-aqua',
    text: 'text-sandbox-aqua',
    button: 'ai',
  },
};

const SHORT_NAME: Record<string, string> = {
  chi: 'Chi',
  tra: 'Trà',
  myanh: 'Mỹ Anh',
};

export default function PersonaDemo({ personas, onSelect }: PersonaDemoProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-10 text-center">
        <p className="section-eyebrow mb-3">Thử với người dùng mẫu</p>
        <h2 className="text-3xl font-bold text-sandbox-text md:text-4xl">
          Xem 1 SANDBOX BIZ hoạt động trong 30 giây
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sandbox-softText">
          Chọn một người dùng mẫu — AI sẽ tự điền thông tin và đưa bạn thẳng đến kế hoạch đã được tùy chỉnh cho từng người.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        {personas.map((persona, i) => {
          const focus = FOCUS_META[focusKeyFor(persona.profile.path)];
          const p = persona.profile;
          const shortName = SHORT_NAME[persona.id] ?? 'người dùng này';
          return (
            <Card
              key={persona.id}
              variant="elevated"
              glow="none"
              className={`flex animate-fade-up flex-col animate-delay-${(i + 1) * 100}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${focus.avatar}`}
                >
                  {focus.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold leading-snug text-sandbox-text">{p.displayName}</h3>
                  <p className="text-xs text-sandbox-muted">
                    {p.age ? `${p.age} tuổi` : ''}
                    {p.age && p.occupation ? ' · ' : ''}
                    {p.occupation ?? ''}
                  </p>
                </div>
              </div>

              <p className={`text-sm font-semibold ${focus.text}`}>{persona.tagline}</p>
              <p className="mt-2 text-sm text-sandbox-softText">{persona.summary}</p>

              <p className="mt-4 flex items-center gap-1.5 text-xs text-sandbox-muted">
                <MapPin size={13} className="shrink-0" />
                {p.city ?? 'Việt Nam'}
              </p>

              <div className="mt-4">
                <Badge tone={focus.tone}>Trọng tâm: {focus.badge}</Badge>
              </div>

              <div className="mt-6 pt-2">
                <Button
                  variant={focus.button}
                  className="w-full"
                  icon={<ArrowRight size={16} />}
                  onClick={() => onSelect(persona.profile)}
                >
                  Thử với {shortName}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-sandbox-muted">
        Cùng một người dùng mẫu sẽ cho ra cùng một kết quả mỗi lần — AI của 1 SANDBOX BIZ hoạt động theo quy tắc cố định, không ngẫu nhiên.
      </p>
    </section>
  );
}
