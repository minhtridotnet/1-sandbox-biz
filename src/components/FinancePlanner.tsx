import { useEffect, useMemo, useState } from 'react';
import { Calculator, TrendingUp, AlertCircle, RotateCcw, ChevronDown, Sparkles } from 'lucide-react';
import type { FinancePlan } from '@/types';
import {
  formatVND,
  formatNumber,
  formatMoneyGrouped,
  parseMoneyGrouped,
  deriveFinance,
  estimateTestQuantity,
} from '@/lib/format';
import Card from './ui/Card';
import Button from './ui/Button';
import Tooltip from './ui/Tooltip';

interface FinancePlannerProps {
  plan: FinancePlan;
}

type MoneyKey =
  | 'productionBudget'
  | 'operatingReserve'
  | 'productCost'
  | 'packagingCost'
  | 'shippingSupport'
  | 'fixedStartupCost'
  | 'marketingBudget'
  | 'sellingPrice';

interface EditableField {
  key: MoneyKey;
  label: string;
  hint: string;
}

const EDITABLE: EditableField[] = [
  { key: 'productionBudget', label: 'Ngân sách sản xuất', hint: 'Tiền dành để nhập / làm sản phẩm thử nghiệm' },
  { key: 'operatingReserve', label: 'Quỹ dự phòng vận hành', hint: 'Dự phòng cho chi phí phát sinh khi đang chạy test' },
  { key: 'productCost', label: 'Chi phí nhập hàng / đơn vị', hint: 'Giá vốn từng sản phẩm' },
  { key: 'packagingCost', label: 'Bao bì / đơn vị', hint: 'Túi, hộp, tem nhãn cho 1 sản phẩm' },
  { key: 'shippingSupport', label: 'Hỗ trợ ship / đơn vị', hint: 'Phần ship bạn chịu thay khách' },
  { key: 'fixedStartupCost', label: 'Chi phí cố định ban đầu', hint: 'Máy móc, dụng cụ, setup một lần' },
  { key: 'marketingBudget', label: 'Ngân sách marketing thử nghiệm', hint: 'Chạy quảng cáo / mẫu thử nhỏ' },
  { key: 'sellingPrice', label: 'Giá bán / đơn vị', hint: 'Giá bạn dự định bán 1 sản phẩm' },
];

const STRATEGY_OPTIONS: { rate: number; strategy: 'attack' | 'balance' | 'defensive'; label: string; explain: string }[] = [
  {
    rate: 0.3,
    strategy: 'attack',
    label: '30% — Tấn công',
    explain: 'Sản xuất nhiều hơn để phủ nhanh thị trường. Dùng khi sản phẩm đơn giản, vốn thoải mái, thị trường quen thuộc, đã có cộng đồng.',
  },
  {
    rate: 0.2,
    strategy: 'balance',
    label: '20% — Cân bằng',
    explain: 'Cân bằng giữa rủi ro và cơ hội. Dùng khi có một vài yếu tố chưa chắc chắn nhưng không quá rủi ro.',
  },
  {
    rate: 0.1,
    strategy: 'defensive',
    label: '10% — Phòng thủ',
    explain: 'Sản xuất ít, giữ tiền cho marketing. Dùng khi sản phẩm phức tạp, vốn mỏng, thị trường mới, chưa có khách.',
  },
];

const STRATEGY_LABEL: Record<'attack' | 'balance' | 'defensive', string> = {
  attack: 'Tấn công',
  balance: 'Cân bằng',
  defensive: 'Phòng thủ',
};

export default function FinancePlanner({ plan }: FinancePlannerProps) {
  // String-state model so empty inputs are representable (spec: empty boxes).
  const [draft, setDraft] = useState<Record<MoneyKey, string>>(() => ({
    productionBudget: String(plan.productionBudget ?? 0),
    operatingReserve: String(plan.operatingReserve ?? 0),
    productCost: String(plan.productCost ?? 0),
    packagingCost: String(plan.packagingCost ?? 0),
    shippingSupport: String(plan.shippingSupport ?? 0),
    fixedStartupCost: String(plan.fixedStartupCost ?? 0),
    marketingBudget: String(plan.marketingBudget ?? 0),
    sellingPrice: String(plan.sellingPrice ?? 0),
  }));
  const [strategy, setStrategy] = useState<'attack' | 'balance' | 'defensive'>(plan.sellStrategy ?? 'balance');
  const [showFormula, setShowFormula] = useState(false);

  // Re-sync if the engine produces a new plan (persona switch / model chosen / restart).
  useEffect(() => {
    setDraft({
      productionBudget: String(plan.productionBudget ?? 0),
      operatingReserve: String(plan.operatingReserve ?? 0),
      productCost: String(plan.productCost ?? 0),
      packagingCost: String(plan.packagingCost ?? 0),
      shippingSupport: String(plan.shippingSupport ?? 0),
      fixedStartupCost: String(plan.fixedStartupCost ?? 0),
      marketingBudget: String(plan.marketingBudget ?? 0),
      sellingPrice: String(plan.sellingPrice ?? 0),
    });
    setStrategy(plan.sellStrategy ?? 'balance');
  }, [plan]);

  const nums = useMemo(() => {
    const get = (k: MoneyKey) => parseMoneyGrouped(draft[k]);
    return {
      productionBudget: get('productionBudget'),
      operatingReserve: get('operatingReserve'),
      productCost: get('productCost'),
      packagingCost: get('packagingCost'),
      shippingSupport: get('shippingSupport'),
      fixedStartupCost: get('fixedStartupCost'),
      marketingBudget: get('marketingBudget'),
      sellingPrice: get('sellingPrice'),
    };
  }, [draft]);

  const derived = useMemo(
    () =>
      deriveFinance({
        productCost: nums.productCost,
        packagingCost: nums.packagingCost,
        shippingSupport: nums.shippingSupport,
        sellingPrice: nums.sellingPrice,
        fixedStartupCost: nums.fixedStartupCost,
        productionBudget: nums.productionBudget,
        operatingReserve: nums.operatingReserve,
      }),
    [nums],
  );

  const currentRate = STRATEGY_OPTIONS.find((o) => o.strategy === strategy)!.rate;

  const testQty = useMemo(
    () => estimateTestQuantity(nums.productionBudget, derived.totalUnitCost, currentRate),
    [nums.productionBudget, derived.totalUnitCost, currentRate],
  );

  const updateField = (key: MoneyKey, raw: string) => {
    const digits = raw.replace(/\D/g, '');
    setDraft((prev) => ({ ...prev, [key]: digits }));
  };

  const reset = () => {
    setDraft({
      productionBudget: String(plan.productionBudget ?? 0),
      operatingReserve: String(plan.operatingReserve ?? 0),
      productCost: String(plan.productCost ?? 0),
      packagingCost: String(plan.packagingCost ?? 0),
      shippingSupport: String(plan.shippingSupport ?? 0),
      fixedStartupCost: String(plan.fixedStartupCost ?? 0),
      marketingBudget: String(plan.marketingBudget ?? 0),
      sellingPrice: String(plan.sellingPrice ?? 0),
    });
    setStrategy(plan.sellStrategy ?? 'balance');
  };

  const breakEvenValid = Number.isFinite(derived.breakEvenQuantity);

  const derivedRows: { label: string; tooltip: string; value: string }[] = [
    {
      label: 'Tổng chi phí / đơn vị',
      tooltip: 'Nhập hàng + bao bì + hỗ trợ ship cho 1 sản phẩm.',
      value: formatVND(derived.totalUnitCost),
    },
    {
      label: 'Lợi nhuận gộp / đơn vị',
      tooltip: 'Giá bán trừ đi tổng chi phí mỗi đơn vị.',
      value: formatVND(derived.grossProfitPerUnit),
    },
    {
      label: 'Số đơn vị hòa vốn',
      tooltip: 'Chi phí cố định chia cho lợi nhuận gộp mỗi đơn vị. Số đơn vị cần bán để gỡ hết chi phí cố định.',
      value: breakEvenValid ? formatNumber(derived.breakEvenQuantity) + ' đơn vị' : '—',
    },
    {
      label: 'Tổng vốn',
      tooltip: 'Ngân sách sản xuất cộng quỹ dự phòng vận hành. Đây là tổng số tiền bạn cần chuẩn bị.',
      value: formatVND(derived.totalCapital),
    },
  ];

  return (
    <section>
      <div className="mb-1 flex items-center justify-between gap-3">
        <div>
          <p className="section-eyebrow mb-1">C. AI Feasibility & Finance Planner</p>
          <h3 className="text-xl font-bold text-sandbox-text">Bảng tài chính thử nghiệm</h3>
        </div>
        <Button variant="ghost" size="sm" icon={<RotateCcw size={14} />} onClick={reset}>
          Khôi phục
        </Button>
      </div>
      <p className="mb-4 text-sm text-sandbox-muted">
        AI gợi ý chiến lược, bạn quyết định. Chỉnh sửa từng con số — kết quả tự tính cập nhật ngay lập tức.
      </p>

      <Card variant="elevated" glow="none" className="overflow-hidden p-0">
        <div className="grid gap-px bg-[rgba(148,163,184,0.18)] md:grid-cols-2">
          {EDITABLE.map((field) => (
            <div key={field.key} className="bg-sandbox-elevated px-5 py-3.5 relative hover:z-10 focus-within:z-10">
              <label className="flex items-center justify-between gap-3">
                <Tooltip text={field.hint} className="text-sm text-sandbox-softText">
                  <span>{field.label}</span>
                </Tooltip>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatMoneyGrouped(draft[field.key])}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder="0"
                  className="input-field w-44 px-3 py-1.5 text-right text-sm font-semibold text-sandbox-text"
                />
              </label>
            </div>
          ))}
        </div>

        <div className="border-t border-divider bg-sandbox-card/40 px-5 py-4">
          <div className="mb-3 flex items-center gap-2 text-sandbox-cyan">
            <Calculator size={16} />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Kết quả tự tính</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {derivedRows.map((row) => (
              <div key={row.label} className="rounded-lg border border-sandbox-cyan/20 bg-sandbox-cyan/5 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <Tooltip text={row.tooltip} className="text-xs text-sandbox-softText">
                    <span>{row.label}</span>
                  </Tooltip>
                  <span className="text-base font-bold text-sandbox-cyan">{row.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated test quantity */}
        <div className="border-t border-divider px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tooltip
              text="Số sản phẩm AI gợi ý nên sản xuất / nhập để thử nghiệm thị trường, tính từ ngân sách sản xuất và chiến lược bán bạn chọn."
              className="text-sm font-semibold text-sandbox-text"
            >
              <span>Dự định số lượng sản xuất thử (Estimated test quantity)</span>
            </Tooltip>
            <span className="text-2xl font-extrabold text-sandbox-gold">{formatNumber(testQty.quantity)} đơn vị</span>
          </div>

          <button
            type="button"
            onClick={() => setShowFormula((v) => !v)}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-sandbox-cyan transition hover:text-sandbox-cyan/80"
          >
            <ChevronDown size={14} className={`transition-transform duration-300 ${showFormula ? 'rotate-180' : ''}`} />
            Xem cách AI tính con số này
          </button>

          {showFormula && (
            <div className="mt-3 space-y-3 rounded-lg border border-divider bg-white/[0.02] px-4 py-3 text-xs text-sandbox-softText animate-fade-up">
              <p>
                <span className="font-semibold text-sandbox-text">Công thức:</span>{' '}
                Số lượng = (Ngân sách sản xuất ÷ Tổng chi phí / đơn vị) × Tỷ lệ bán dự kiến.
              </p>
              <p className="text-sandbox-muted">
                Với ngân sách <span className="font-semibold text-sandbox-text">{formatVND(nums.productionBudget)}</span>, chi
                phí / đơn vị <span className="font-semibold text-sandbox-text">{formatVND(derived.totalUnitCost)}</span> và tỷ lệ{' '}
                <span className="font-semibold text-sandbox-text">{Math.round(currentRate * 100)}%</span> →{' '}
                <span className="font-semibold text-sandbox-gold">{formatNumber(testQty.rawQuantity)} đơn vị</span>.
              </p>
              <p>
                <span className="font-semibold text-sandbox-text">Chiến lược hiện tại:</span>{' '}
                {Math.round(currentRate * 100)}% — {STRATEGY_LABEL[strategy]}.{' '}
                {STRATEGY_OPTIONS.find((o) => o.strategy === strategy)!.explain}
              </p>
              <p className="text-sandbox-muted">
                Giới hạn: số lượng được giữ trong khoảng 15–200 để vừa đủ số liệu test, vừa không rủi ro vốn.
              </p>
            </div>
          )}

          {testQty.capMessage && (
            <div
              className={`mt-3 flex items-start gap-2.5 rounded-lg border px-4 py-2.5 text-xs ${
                testQty.capped
                  ? 'border-sandbox-cyan/30 bg-sandbox-cyan/5 text-sandbox-cyan'
                  : 'border-orange-400/25 bg-orange-400/5 text-orange-300'
              }`}
            >
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{testQty.capMessage}</span>
            </div>
          )}

          {/* Strategy selector */}
          <div className="mt-4 border-t border-divider pt-4">
            <p className="mb-2 text-xs italic text-sandbox-muted">Bạn muốn thay đổi chiến lược?</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {STRATEGY_OPTIONS.map((opt) => {
                const active = opt.strategy === strategy;
                return (
                  <button
                    key={opt.strategy}
                    type="button"
                    onClick={() => setStrategy(opt.strategy)}
                    className={`rounded-lg border px-3 py-2.5 text-left text-xs transition ${
                      active
                        ? 'border-sandbox-gold/50 bg-sandbox-gold/10 text-sandbox-gold'
                        : 'border-divider bg-white/[0.02] text-sandbox-softText hover:border-sandbox-cyan/40'
                    }`}
                  >
                    <span className="block font-semibold">{opt.label}</span>
                    <span className="mt-1 block text-[11px] leading-snug text-sandbox-muted">{opt.explain}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      <div
        className={`mt-4 flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm ${
          breakEvenValid
            ? 'border-sandbox-gold/20 bg-sandbox-gold/5'
            : 'border-orange-400/25 bg-orange-400/5'
        }`}
      >
        {breakEvenValid ? (
          <>
            <TrendingUp size={16} className="mt-0.5 shrink-0 text-sandbox-gold" />
            <p className="text-sandbox-softText">
              Bạn cần bán khoảng{' '}
              <span className="font-semibold text-sandbox-gold">{formatNumber(derived.breakEvenQuantity)} đơn vị</span> để
              hòa vốn chi phí cố định. Hãy thử lô nhỏ{' '}
              <span className="font-semibold text-sandbox-gold">{formatNumber(testQty.quantity)} đơn vị</span> trước khi nhập hàng
              lớn.
            </p>
          </>
        ) : (
          <>
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-orange-300" />
            <p className="text-sandbox-softText">
              <span className="font-semibold text-orange-300">Lưu ý:</span>{' '}
              Giá bán đang thấp hơn hoặc bằng chi phí mỗi đơn vị — bạn sẽ lỗ trên mỗi đơn hàng. Hãy tăng giá bán hoặc giảm
              chi phí trước khi thử nghiệm.
            </p>
          </>
        )}
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-sandbox-muted">
        <Sparkles size={12} className="text-sandbox-cyan" /> AI gợi ý số liệu dựa trên hồ sơ của bạn — bạn có thể chỉnh sửa từng con số.
      </p>
    </section>
  );
}
