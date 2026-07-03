import { Check, Star } from 'lucide-react';
import type { PricingTier } from '@/types';
import { PRICING_TIERS, PRICING_NOTE } from '@/data/pricing';

interface PricingProps {
  tiers?: PricingTier[];
  note?: string;
}

export default function Pricing({ tiers = PRICING_TIERS, note = PRICING_NOTE }: PricingProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10 text-center">
        <p className="section-eyebrow mb-3">Mô hình doanh thu</p>
        <h2 className="text-3xl font-bold text-sandbox-text md:text-4xl">
          Bắt đầu miễn phí, nâng cấp khi bạn sẵn sàng
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sandbox-softText">
          1 SANDBOX BIZ là micro-SaaS cho người kinh doanh nhỏ. Trả phí chỉ khi bạn muốn lập kế hoạch cho nhiều ý tưởng hoặc tăng trưởng có kiểm soát.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier, i) => {
          const isRec = tier.recommended;
          return (
            <div
              key={tier.id}
              className={`animate-fade-up flex flex-col rounded-2xl border p-6 transition ${
                isRec
                  ? 'border-sandbox-gold/40 bg-sandbox-gold/[0.06] shadow-glow-gold-soft'
                  : 'border-cyanish bg-sandbox-elevated'
              }`}
              style={{ animationDelay: `${(i + 1) * 80}ms` }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3
                  className={`text-base font-bold ${isRec ? 'text-sandbox-gold' : 'text-sandbox-text'}`}
                >
                  {tier.name}
                </h3>
                {isRec && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-sandbox-gold/40 bg-sandbox-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sandbox-gold">
                    <Star size={11} /> Khuyên dùng
                  </span>
                )}
              </div>

              <div className="mb-1 flex items-baseline gap-1.5">
                <span className={`text-2xl font-bold ${isRec ? 'text-sandbox-gold' : 'text-sandbox-text'}`}>
                  {tier.price}
                </span>
                <span className="text-xs text-sandbox-muted">{tier.period}</span>
              </div>

              <p className="mb-5 text-sm text-sandbox-softText">{tier.description}</p>

              <ul className="mb-6 space-y-2.5 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sandbox-softText">
                    <Check
                      size={15}
                      className={`mt-0.5 shrink-0 ${isRec ? 'text-sandbox-gold' : 'text-sandbox-cyan'}`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`mt-auto rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isRec
                    ? 'bg-cta-gold text-[#06111F] shadow-glow-gold-soft hover:brightness-110'
                    : 'border border-cyanish text-sandbox-softText hover:border-sandbox-cyan hover:text-sandbox-cyan'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-divider bg-sandbox-navy/60 px-5 py-4 text-center text-xs leading-relaxed text-sandbox-muted">
        {note}
      </div>
    </section>
  );
}
