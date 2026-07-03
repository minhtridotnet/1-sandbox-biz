export function formatVND(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('vi-VN').format(Math.round(n));
}

export function formatCompactVND(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, '')} tỷ`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} triệu`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(Math.round(n));
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0 || !Number.isFinite(denominator)) return NaN;
  return numerator / denominator;
}

export function safeBreakEven(fixedCost: number, grossProfitPerUnit: number): number {
  if (grossProfitPerUnit <= 0 || !Number.isFinite(grossProfitPerUnit)) return NaN;
  return Math.ceil(fixedCost / grossProfitPerUnit);
}

/** Group raw digit string with vi-VN '.' every 3 digits. Empty / non-numeric -> empty. */
export function formatMoneyGrouped(digitsStr: string): string {
  const digits = digitsStr.replace(/\D/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('vi-VN').format(Number(digits));
}

/** Strip non-digits; empty -> 0. Inverse of formatMoneyGrouped for parsing. */
export function parseMoneyGrouped(str: string): number {
  const digits = str.replace(/\D/g, '');
  if (!digits) return 0;
  return Number(digits);
}

export interface FinanceInputs {
  productCost: number;
  packagingCost: number;
  shippingSupport: number;
  sellingPrice: number;
  fixedStartupCost: number;
  productionBudget: number;
  operatingReserve: number;
}

export interface FinanceDerived {
  totalUnitCost: number;
  grossProfitPerUnit: number;
  breakEvenQuantity: number;
  totalCapital: number;
}

export function deriveFinance(inputs: FinanceInputs): FinanceDerived {
  const totalUnitCost = inputs.productCost + inputs.packagingCost + inputs.shippingSupport;
  const grossProfitPerUnit = inputs.sellingPrice - totalUnitCost;
  const breakEvenQuantity = safeBreakEven(inputs.fixedStartupCost, grossProfitPerUnit);
  const totalCapital = inputs.productionBudget + inputs.operatingReserve;
  return { totalUnitCost, grossProfitPerUnit, breakEvenQuantity, totalCapital };
}

export interface SellRateDimensions {
  complexity: number;
  capital: number;
  market: number;
  reach: number;
}

export type SellStrategy = 'attack' | 'balance' | 'defensive';

export interface SellRateResult {
  rate: number;
  strategy: SellStrategy;
  score: number;
  dimensions: SellRateDimensions;
}

/**
 * Pure sell-rate computation. Each dimension is 1-5; total 4-20.
 * 4-8  -> 0.30 Attack, 9-14 -> 0.20 Balance, 15-20 -> 0.10 Defensive.
 * Dimensions are passed in already-resolved (format.ts stays dependency-free).
 */
export function computeSellRate(dimensions: SellRateDimensions): SellRateResult {
  const score = dimensions.complexity + dimensions.capital + dimensions.market + dimensions.reach;
  let rate: number;
  let strategy: SellStrategy;
  if (score <= 8) {
    rate = 0.3;
    strategy = 'attack';
  } else if (score <= 14) {
    rate = 0.2;
    strategy = 'balance';
  } else {
    rate = 0.1;
    strategy = 'defensive';
  }
  return { rate, strategy, score, dimensions };
}

export interface EstimateTestQuantityResult {
  quantity: number;
  rawQuantity: number;
  capped: boolean;
  capMessage?: string;
}

const MAX_CAP = 200;
const MIN_CAP = 15;

const MAX_CAP_MESSAGE =
  'Bạn chỉ cần tối đa 200 sản phẩm để thu thập đủ số liệu test thị trường. Hãy giữ lại số tiền thừa cho chi phí Marketing!';
const MIN_CAP_MESSAGE =
  'Số lượng dưới 15 cái là quá ít để chạy test thị trường. Bạn nên cân nhắc làm pre-order (đặt hàng trước) thay vì sản xuất ngay.';

/**
 * quantity = round(productionBudget / max(totalUnitCost,1) * sellRate), clamped to [15,200].
 * raw > 200 -> cap at 200 + Max-Cap message; raw < 15 -> keep raw + Min-Cap warning.
 */
export function estimateTestQuantity(
  productionBudget: number,
  totalUnitCost: number,
  sellRate: number,
): EstimateTestQuantityResult {
  const rawQuantity = Math.round(productionBudget / Math.max(totalUnitCost, 1) * sellRate);
  if (rawQuantity > MAX_CAP) {
    return { quantity: MAX_CAP, rawQuantity, capped: true, capMessage: MAX_CAP_MESSAGE };
  }
  if (rawQuantity < MIN_CAP) {
    return { quantity: rawQuantity, rawQuantity, capped: false, capMessage: MIN_CAP_MESSAGE };
  }
  return { quantity: rawQuantity, rawQuantity, capped: false };
}
