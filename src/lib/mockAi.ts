import type {
  AiPlanResult,
  BusinessRecommendation,
  FinancePlan,
  FitCriterionKey,
  FitInsight,
  FitScoreBand,
  FitScoreBreakdown,
  RiskItem,
  RoadmapPhase,
  UserProfile,
} from '@/types';
import { MODEL_CATALOG, STAGE_BY_PATH, type BusinessModelTemplate } from '@/data/businessModels';
import {
  clamp,
  computeSellRate,
  deriveFinance,
  estimateTestQuantity,
  type SellRateDimensions,
} from '@/lib/format';

/**
 * Deterministic mock AI engine.
 * Pure function: no Math.random, no Date.now. Same profile → same output, always.
 * `generatedAt` is stamped by the caller to keep this function pure.
 */

function stageOf(profile: UserProfile) {
  if (profile.path === 'grow') return 'growth' as const;
  if (profile.path === 'feasibility') return 'feasibility' as const;
  return 'discovery' as const;
}

function focusAreaFor(profile: UserProfile): string {
  if (profile.path === 'discover') return 'discovery';
  if (profile.path === 'feasibility') return 'finance';
  return 'growth';
}

function riskToleranceNum(profile: UserProfile): number {
  return profile.riskTolerance === 'high' ? 3 : profile.riskTolerance === 'medium' ? 2 : 1;
}

/** Score a single model template against the profile. Higher = better fit. Deterministic. */
function scoreModel(model: BusinessModelTemplate, profile: UserProfile): number {
  const stage = stageOf(profile);
  let score = 0;

  if (model.stage === stage) score += 40;
  else if (model.stage === 'any') score += 15;
  else score -= 25;

  const cap = profile.capital;
  if (cap >= model.capitalMin && cap <= model.capitalMax) score += 25;
  else if (cap < model.capitalMin) {
    const ratio = model.capitalMin > 0 ? cap / model.capitalMin : 0;
    score += clamp(Math.round(ratio * 12), -20, 12);
  } else {
    score -= 6;
  }

  if (model.productType === 'any') score += 8;
  else if (model.productType === profile.productType) score += 18;
  else score -= 10;

  const rt = riskToleranceNum(profile);
  if (model.riskLevel === 'Low') score += rt === 1 ? 18 : rt === 2 ? 8 : 2;
  else if (model.riskLevel === 'Medium') score += rt === 2 ? 14 : rt === 3 ? 12 : 0;
  else score += rt === 3 ? 14 : rt === 2 ? -4 : -18;

  if (model.mode === 'any') score += 6;
  else if (model.mode === profile.businessMode) score += 12;
  else if (profile.businessMode === 'hybrid') score += 4;
  else score -= 6;

  const skills = profile.skills.join(' ').toLowerCase();
  if (model.tags.includes('service') || model.tags.includes('skills')) {
    if (skills.includes('viết') || skills.includes('thiết kế') || skills.includes('kỹ thuật') || skills.includes('chăm sóc')) {
      score += 10;
    }
  }
  if (model.tags.includes('handmade') && (skills.includes('thủ công') || skills.includes('may'))) {
    score += 10;
  }
  if (model.tags.includes('food') && skills.includes('nấu')) score += 10;

  if (profile.capital <= 3_000_000 && profile.riskTolerance === 'low') {
    if (model.tags.includes('preorder') || model.tags.includes('service')) score += 25;
    if (model.tags.includes('low-risk')) score += 12;
    if (model.riskLevel === 'High') score -= 40;
  }

  if (stage === 'growth') {
    if (model.tags.includes('growth') || model.tags.includes('repeat-customers')) score += 20;
    if (model.stage === 'discovery') score -= 15;
  }

  return score;
}

function whyItFits(model: BusinessModelTemplate, profile: UserProfile): string {
  const cap = profile.capital;
  const within = cap >= model.capitalMin && cap <= model.capitalMax;
  const capLine = within
    ? `Vốn ${cap.toLocaleString('vi-VN')} đ của bạn nằm đúng trong khoảng mà mô hình này cần (${model.capitalMin.toLocaleString('vi-VN')}–${model.capitalMax.toLocaleString('vi-VN')} đ).`
    : cap < model.capitalMin
      ? `Mô hình này cần khoảng ${model.capitalMin.toLocaleString('vi-VN')} đ; với vốn ${cap.toLocaleString('vi-VN')} đ bạn nên bắt đầu bằng lô nhỏ / đặt trước để giảm rủi ro.`
      : `Mô hình này cần vốn thấp hơn khoảng của bạn — bạn có thể bắt đầu gọn và giữ vốn dự phòng.`;

  const riskLine =
    profile.riskTolerance === 'low'
      ? `Rủi ro ${model.riskLevel === 'Low' ? 'thấp, hợp với mong muốn an toàn' : model.riskLevel === 'Medium' ? 'trung bình — cần kiểm soát tồn kho' : 'cao — cân nhắc kỹ'} của bạn.`
      : profile.riskTolerance === 'medium'
        ? `Rủi ro ${model.riskLevel}, vừa với mức chịu đựng trung bình của bạn.`
        : `Rủi ro ${model.riskLevel}, bạn sẵn sàng thử nên có thể khai thác tốt hơn.`;

  return `${capLine} ${riskLine} ${model.description}`;
}

function toRecommendation(model: BusinessModelTemplate, profile: UserProfile, rank: number): BusinessRecommendation {
  return {
    id: model.id,
    name: model.name,
    whyItFits: whyItFits(model, profile),
    estimatedCapital: Math.min(Math.max(model.capitalMin, Math.round(profile.capital / 1) || model.capitalMin), model.capitalMax),
    riskLevel: model.riskLevel,
    firstExperiment: model.firstExperiment,
    firstChannel: model.firstChannel,
    fitScore: clamp(100 - rank * 8, 40, 96),
    complexityScore: model.complexityScore,
    fitsWhom: model.fitsWhom,
    needsCapital: model.needsCapital,
    needsTime: model.needsTime,
    pros: model.pros,
    risks: model.risks,
    requiredSkills: model.requiredSkills,
    skillLevel: model.skillLevel,
    competition: model.competition,
    howItOperates: model.howItOperates,
  };
}

function selectRecommendations(profile: UserProfile): BusinessRecommendation[] {
  const scored = MODEL_CATALOG.map((m) => ({ model: m, score: scoreModel(m, profile) }))
    .sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 4);
  return top.map((entry, i) => toRecommendation(entry.model, profile, i));
}

/** Fixed map from preferredChannel string → customer-reach dimension (1-5). Deterministic. */
function reachFromChannel(channel: string): number {
  const c = channel.toLowerCase();
  if (c.includes('trực tiếp') || c.includes('khách quen')) return 1;
  if (c.includes('chưa biết') || c.includes('chưa rõ')) return 5;
  if (c.includes('instagram') || c.includes('tiktok') || c.includes('shopee') || c.includes('sàn')) return 3;
  if (c.includes('facebook cá nhân') || c.includes('group')) return 2;
  if (c.includes('facebook')) return 2;
  return 3;
}

function resolveModel(chosenId: string | undefined, top: BusinessRecommendation | undefined): BusinessModelTemplate | undefined {
  if (chosenId) {
    const found = MODEL_CATALOG.find((m) => m.id === chosenId);
    if (found) return found;
  }
  return MODEL_CATALOG.find((m) => m.id === top?.id);
}

function buildFinancePlan(profile: UserProfile, model: BusinessModelTemplate | undefined): FinancePlan {
  const productCost = model?.unitCost ?? 0;
  const packagingCost = model?.packagingCost ?? 0;
  const shippingSupport = model?.shippingSupport ?? 0;
  const sellingPrice = model?.sellingPrice ?? 0;
  const fixedStartupCost = model?.fixedStartupCost ?? Math.round(profile.capital * 0.3);
  const marketingBudget = Math.round(profile.capital * 0.1);

  // Seed production budget from capital (keep ~70% for production, ~30% as operating reserve).
  const productionBudget = Math.round(profile.capital * 0.7);
  const operatingReserve = Math.round(profile.capital * 0.3);

  const { totalUnitCost, grossProfitPerUnit, breakEvenQuantity, totalCapital } = deriveFinance({
    productCost, packagingCost, shippingSupport, sellingPrice, fixedStartupCost,
    productionBudget, operatingReserve,
  });

  const dimensions: SellRateDimensions = {
    complexity: model?.complexityScore ?? 3,
    capital: profile.capitalTightness,
    market: profile.marketFamiliarity,
    reach: reachFromChannel(profile.preferredChannel),
  };
  const sell = computeSellRate(dimensions);
  const est = estimateTestQuantity(productionBudget, totalUnitCost, sell.rate);

  return {
    productionBudget,
    operatingReserve,
    totalCapital,
    productCost,
    packagingCost,
    shippingSupport,
    marketingBudget,
    sellingPrice,
    fixedStartupCost,
    totalUnitCost,
    grossProfitPerUnit,
    breakEvenQuantity,
    estimatedTestQuantity: est.quantity,
    sellRate: sell.rate,
    sellStrategy: sell.strategy,
    sellRateDimensions: sell.dimensions,
    testQuantityCapMessage: est.capMessage,
  };
}

// ─── 5-criterion fit score engine ────────────────────────────────────────────
// Each criterion produces a 1-5 rating from profile signals, then is weighted:
// skillMatch ×5 (max 25), timeFit ×4 (20), experience ×4 (20), financial ×4 (20),
// goalAlignment ×3 (15). Total = sum of the 5 (NO +50 base). Clamp 0-100.

function skillMatchRating(profile: UserProfile): number {
  const realSkills = profile.skills.filter((s) => s && s !== 'Chưa rõ');
  const skillsRating = clamp(realSkills.length + 1, 1, 5);
  const industry = profile.industryExperience;
  return clamp(Math.round((skillsRating + industry) / 2), 1, 5);
}

function timeFitRating(profile: UserProfile): number {
  const h = profile.hoursPerWeek;
  let base = 1;
  if (h >= 20) base = 5;
  else if (h >= 12) base = 4;
  else if (h >= 8) base = 3;
  else if (h >= 4) base = 2;
  const adj = profile.incomeFocus === 'business' ? 1 : profile.incomeFocus === 'job' ? -1 : 0;
  return clamp(base + adj, 1, 5);
}

function experienceRating(profile: UserProfile): number {
  let r = profile.industryExperience;
  if (profile.hasSoldBefore) r += 1;
  return clamp(r, 1, 5);
}

function financialRating(profile: UserProfile, model: BusinessModelTemplate | undefined): number {
  const need = model ? Math.min(Math.max(model.capitalMin, profile.capital), model.capitalMax) : profile.capital;
  const ratio = need > 0 ? profile.capital / need : 1;
  let capRating = 1;
  if (ratio >= 1.5) capRating = 5;
  else if (ratio >= 1) capRating = 4;
  else if (ratio >= 0.6) capRating = 3;
  else if (ratio >= 0.3) capRating = 2;
  // capitalTightness: 1 = comfortable → 5 = very thin. Invert to a 1-5 strength.
  const tightnessRating = clamp(6 - profile.capitalTightness, 1, 5);
  return clamp(Math.round((capRating + tightnessRating) / 2), 1, 5);
}

function goalAlignmentRating(profile: UserProfile): number {
  const ratio = profile.capital > 0 ? profile.incomeGoal / profile.capital : 1;
  let base = 1;
  if (ratio <= 0.5) base = 5;
  else if (ratio <= 1) base = 4;
  else if (ratio <= 2) base = 3;
  else if (ratio <= 4) base = 2;
  // Bigger ambition with thin capital reduces alignment.
  if (profile.goalScale === 'bigger' && profile.capital < 10_000_000) base -= 1;
  return clamp(base, 1, 5);
}

function fitScoreBreakdown(profile: UserProfile, model: BusinessModelTemplate | undefined): FitScoreBreakdown {
  return {
    skillMatch: skillMatchRating(profile) * 5,
    timeFit: timeFitRating(profile) * 4,
    experience: experienceRating(profile) * 4,
    financial: financialRating(profile, model) * 4,
    goalAlignment: goalAlignmentRating(profile) * 3,
  };
}

function computeFitScore(breakdown: FitScoreBreakdown): number {
  const total =
    breakdown.skillMatch +
    breakdown.timeFit +
    breakdown.experience +
    breakdown.financial +
    breakdown.goalAlignment;
  return clamp(total, 0, 100);
}

function bandFor(score: number): FitScoreBand {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'moderate';
  return 'low';
}

export const FIT_BAND_MESSAGE: Record<FitScoreBand, string> = {
  strong:
    'Strong Fit — Mô hình phù hợp với nguồn lực hiện tại. AI gợi ý: "Bạn có nhiều lợi thế để bắt đầu. Ưu tiên thử nghiệm thị trường nhỏ trước khi mở rộng."',
  moderate:
    'Moderate Fit — Có tiềm năng nhưng còn một số khoảng trống. AI gợi ý: "Bạn có thể bắt đầu, nhưng nên bổ sung kỹ năng / nguồn lực ở các điểm sau…"',
  low:
    'Low Fit — Mô hình hiện tại chưa phù hợp với hoàn cảnh. AI gợi ý: "Bạn nên điều chỉnh mô hình hoặc tìm phương án thử nghiệm rủi ro thấp hơn."',
};

// Per-criterion insight templates keyed by rating band (low 1-2, mid 3, high 4-5).
const INSIGHT_TEMPLATES: Record<FitCriterionKey, { low: FitInsight; mid: FitInsight; high: FitInsight }> = {
  skillMatch: {
    low: {
      strength: 'Bạn đang ở điểm xuất phát sạch — chưa có thói quen xấu nào.',
      weakness: 'Hầu hết kỹ năng cần cho mô hình bạn chưa có.',
      nextAction: 'Bắt đầu với mô hình đơn giản, học theo từng bước nhỏ.',
    },
    mid: {
      strength: 'Bạn có một số kỹ năng có thể dùng được ngay.',
      weakness: 'Còn thiếu kỹ năng vận hành hoặc marketing cho mô hình.',
      nextAction: 'Chọn 1 kỹ năng cần học (vd: marketing) và học trong 30 ngày.',
    },
    high: {
      strength: 'Bạn đã có kỹ năng liên quan trực tiếp đến mô hình.',
      weakness: 'Đừng quên kỹ năng vận hành / bán hàng khi mở rộng.',
      nextAction: 'Dùng kỹ năng hiện có để làm mẫu thử ngay.',
    },
  },
  timeFit: {
    low: {
      strength: 'Bạn có thể thử mô hình không cần nhiều thời gian.',
      weakness: 'Thời gian hiện tại không đủ cho mô hình cần vận hành liên tục.',
      nextAction: 'Chọn mô hình pre-order / dịch vụ linh hoạt theo giờ.',
    },
    mid: {
      strength: 'Bạn có đủ thời gian để bắt đầu ở quy mô nhỏ.',
      weakness: 'Thời gian eo hẹp, khó mở rộng nhanh.',
      nextAction: 'Tối ưu quy trình, ưu tiên việc tạo ra đơn hàng.',
    },
    high: {
      strength: 'Thời gian bạn có đủ để vận hành mô hình.',
      weakness: 'Cần giữ kỷ luật khung giờ cố định.',
      nextAction: 'Lên lịch cố định mỗi tuần cho việc kinh doanh.',
    },
  },
  experience: {
    low: {
      strength: 'Bạn nhìn thị trường bằng góc nhìn tươi mới.',
      weakness: 'Chưa hiểu rõ khách hàng và đối thủ trong ngành.',
      nextAction: 'Hỏi 10-20 khách tiềm năng trước khi nhập hàng.',
    },
    mid: {
      strength: 'Bạn có một số trải nghiệm liên quan.',
      weakness: 'Chưa đủ kinh nghiệm để dự báo rủi ro.',
      nextAction: 'Ghi chép dữ liệu bán hàng để bù kinh nghiệm.',
    },
    high: {
      strength: 'Bạn đã có kinh nghiệm sâu trong ngành.',
      weakness: 'Cẩn thận lặp lại giả định cũ khi thị trường đổi.',
      nextAction: 'Dùng kinh nghiệm để tối ưu chi phí ngay từ đầu.',
    },
  },
  financial: {
    low: {
      strength: 'Bạn sẽ học cách làm việc với vốn ít.',
      weakness: 'Vốn hiện tại thấp hơn nhiều so với mô hình cần.',
      nextAction: 'Chọn mô hình vốn thấp hoặc gom vốn thêm trước khi bắt đầu.',
    },
    mid: {
      strength: 'Bạn có đủ vốn để bắt đầu ở quy mô nhỏ.',
      weakness: 'Vốn eo hẹp, mất lô đầu sẽ ảnh hưởng.',
      nextAction: 'Bắt đầu với pre-order để không kẹt vốn tồn kho.',
    },
    high: {
      strength: 'Vốn của bạn phù hợp với mô hình và có dự phòng.',
      weakness: 'Đừng vì vốn thoải mái mà nhập lô lớn vội.',
      nextAction: 'Giữ quỹ dự phòng, nhập lô nhỏ để test trước.',
    },
  },
  goalAlignment: {
    low: {
      strength: 'Bạn sẽ xác định lại mục tiêu rõ hơn sau khi thử.',
      weakness: 'Mục tiêu hiện tại không khớp với nguồn lực.',
      nextAction: 'Thử nghiệm nhỏ để xác nhận mục tiêu trước khi cam kết.',
    },
    mid: {
      strength: 'Mục tiêu có thể đạt được nếu điều chỉnh kỳ vọng.',
      weakness: 'Kỳ vọng doanh thu có thể cao hơn thực tế giai đoạn đầu.',
      nextAction: 'Đặt mục tiêu khiêm tốn tháng đầu, tăng dần sau.',
    },
    high: {
      strength: 'Mục tiêu của bạn phù hợp với mô hình.',
      weakness: 'Mục tiêu rõ ràng nhưng vẫn cần đo lường tiến độ.',
      nextAction: 'Đặt mốc doanh thu 30-60-90 ngày để kiểm tra.',
    },
  },
};

const OVERALL_INSIGHT: Record<FitScoreBand, FitInsight> = {
  strong: {
    strength: 'Bạn có nhiều lợi thế để bắt đầu.',
    weakness: 'Điểm cao không đảm bảo thành công — vẫn cần test thị trường.',
    nextAction: 'Ưu tiên thử nghiệm thị trường nhỏ trước khi mở rộng.',
  },
  moderate: {
    strength: 'Bạn có tiềm năng để bắt đầu.',
    weakness: 'Còn một số khoảng trống về kỹ năng / nguồn lực.',
    nextAction: 'Bổ sung kỹ năng hoặc giảm quy mô ban đầu để bù đắp.',
  },
  low: {
    strength: 'Bạn sẽ học nhiều khi bắt đầu từ mức thấp.',
    weakness: 'Mô hình hiện tại chưa phù hợp hoàn cảnh của bạn.',
    nextAction: 'Điều chỉnh mô hình hoặc tìm phương án thử nghiệm rủi ro thấp hơn.',
  },
};

function templateFor(rating1to5: number): 'low' | 'mid' | 'high' {
  if (rating1to5 >= 4) return 'high';
  if (rating1to5 === 3) return 'mid';
  return 'low';
}

function buildFitInsights(
  profile: UserProfile,
  model: BusinessModelTemplate | undefined,
  band: FitScoreBand,
): { overall: FitInsight; perCriterion: Record<FitCriterionKey, FitInsight> } {
  const ratings: Record<FitCriterionKey, number> = {
    skillMatch: skillMatchRating(profile),
    timeFit: timeFitRating(profile),
    experience: experienceRating(profile),
    financial: financialRating(profile, model),
    goalAlignment: goalAlignmentRating(profile),
  };
  const perCriterion = {} as Record<FitCriterionKey, FitInsight>;
  (Object.keys(ratings) as FitCriterionKey[]).forEach((key) => {
    perCriterion[key] = INSIGHT_TEMPLATES[key][templateFor(ratings[key])];
  });
  return { overall: OVERALL_INSIGHT[band], perCriterion };
}

const RISK_CATALOG: Record<string, Omit<RiskItem, 'id'>> = {
  'test-demand': {
    title: 'Chọn sản phẩm trước khi thử nhu cầu',
    whyItMatters: 'Nhập hàng theo cảm tính dễ dẫn đến tồn kho không bán được — lỗi phổ biến nhất của người mới.',
    howToReduce: 'Đăng bài thử / đặt trước 1 lô nhỏ 10-20 chiếc trước khi nhập số lượng lớn.',
    severity: 'High',
  },
  'over-inventory': {
    title: 'Nhập quá nhiều hàng quá sớm',
    whyItMatters: 'Vốn bị kẹt vào hàng tồn, không có tiền xoay vòng cho marketing hay mẫu mới.',
    howToReduce: 'Bắt đầu bằng lô nhỏ, chỉ nhập thêm khi đã có đơn thật và dữ liệu bán được.',
    severity: 'High',
  },
  'pricing-low': {
    title: 'Định giá quá thấp',
    whyItMatters: 'Bán rẻ che lỗ — bạn không biết mình lãi hay lỗ trên mỗi đơn vị.',
    howToReduce: 'Tính tổng chi phí trên 1 đơn vị (gồm đóng gói, vận chuyển) rồi cộng biên lợi nhuận tối thiểu 30-40%.',
    severity: 'Medium',
  },
  'no-profit-tracking': {
    title: 'Không theo dõi lợi nhuận trên mỗi sản phẩm',
    whyItMatters: 'Bạn tưởng đang lãi nhưng thực ra lỗ khi tính đủ chi phí ẩn.',
    howToReduce: 'Ghi chép chi phí nhập + đóng gói + vận chuyển + giá bán cho từng dòng sản phẩm.',
    severity: 'Medium',
  },
  'single-channel': {
    title: 'Phụ thuộc một kênh bán duy nhất',
    whyItMatters: 'Kênh đổi thuật toán / khóa tài khoản là mất nguồn đơn ngay lập tức.',
    howToReduce: 'Sau khi kênh chính ổn định, xây thêm 1 kênh phụ và nhóm khách quen riêng (Zalo).',
    severity: 'Medium',
  },
  'expand-too-fast': {
    title: 'Mở rộng trước khi hiểu khách mua lại',
    whyItMatters: 'Đẩy vốn vào mẫu mới / kênh mới khi chưa biết khách cũ vì sao mua dễ gây lỗ lớn.',
    howToReduce: 'Phỏng vấn 10 khách cũ, xác nhận lý do mua, rồi mới mở rộng dần.',
    severity: 'High',
  },
  'time-underestimate': {
    title: 'Đánh giá thấp thời gian cần thiết',
    whyItMatters: 'Kinh doanh ngoài giờ dễ kiệt sức, bỏ dở giữa chừng khi đơn không đều.',
    howToReduce: 'Dành khung giờ cố định mỗi tuần, đặt mục tiêu nhỏ 30 ngày trước khi cam kết dài hạn.',
    severity: 'Low',
  },
};

function selectRisks(profile: UserProfile): RiskItem[] {
  const stage = stageOf(profile);
  const keys: string[] = [];

  if (stage === 'discovery') {
    keys.push('test-demand', 'over-inventory');
    if (profile.hoursPerWeek < 5) keys.push('time-underestimate');
  }
  if (stage === 'feasibility') {
    keys.push('pricing-low', 'no-profit-tracking', 'over-inventory');
  }
  if (stage === 'growth') {
    keys.push('single-channel', 'expand-too-fast', 'no-profit-tracking');
  }
  if (profile.capital <= 3_000_000 && !keys.includes('over-inventory')) keys.push('over-inventory');

  const unique = Array.from(new Set(keys)).slice(0, 5);
  return unique.map((k) => ({ id: k, ...RISK_CATALOG[k] }));
}

const ROADMAP_TEMPLATES: Record<'discovery' | 'feasibility' | 'growth', RoadmapPhase[]> = {
  discovery: [
    {
      phase: '30',
      title: 'Khám phá & thử nghiệm nhỏ',
      items: [
        'Chọn 1 mô hình từ gợi ý và hiểu rõ tại sao nó hợp với bạn.',
        'Làm / nhập lô thử 10-20 chiếc, không nhập số lượng lớn.',
        'Đăng bài cho 20 người quen, đo lượt quan tâm và ai hỏi mua.',
        'Ghi lại câu hỏi và phản hồi của khách để hiểu nhu cầu thật.',
      ],
    },
    {
      phase: '60',
      title: 'Đo lường & điều chỉnh',
      items: [
        'Tính chi phí và giá bán cho 1 đơn vị; đảm bảo còn biên lợi nhuận.',
        'Nhận đặt trước đợt 2 nếu đợt 1 có người mua lại.',
        'Chọn 1 kênh chính để tập trung, đừng rải nhiều kênh cùng lúc.',
        'Thu thập 5-10 đánh giá / ảnh từ khách để dùng cho đợt sau.',
      ],
    },
    {
      phase: '90',
      title: 'Củng cố & quyết định tiếp',
      items: [
        'Quyết định giữ hay đổi mô hình dựa trên dữ liệu 60 ngày.',
        'Lập nhóm khách quen (Zalo / Instagram) để nuôi đơn mua lại.',
        'Đặt mục tiêu doanh thu tháng 4 khiêm tốn và reachable.',
        'Chỉ nhập lô lớn hơn khi đã có đơn thật ổn định.',
      ],
    },
  ],
  feasibility: [
    {
      phase: '30',
      title: 'Xác định sản phẩm & chi phí',
      items: [
        'Chốt 1 dòng sản phẩm cụ thể, không rải nhiều loại.',
        'Tính chi phí trên 1 đơn vị (nhập + đóng gói + vận chuyển).',
        'Đặt giá bán sao cho biên lợi nhuận ≥ 30-40%.',
        'Nhập / làm lô thử 15-20 chiếc, không nhập lô lớn.',
      ],
    },
    {
      phase: '60',
      title: 'Thử thị trường & hòa vốn',
      items: [
        'Đăng bán 2 tuần, theo dõi số người hỏi / số người mua.',
        'Cập nhật bảng tài chính: doanh thu, chi phí, lợi nhuận thật.',
        'Tính điểm hòa vốn và so với số đơn đã bán.',
        'Điều chỉnh giá hoặc chi phí nếu biên lợi nhuận quá mỏng.',
      ],
    },
    {
      phase: '90',
      title: 'Quyết định mở rộng',
      items: [
        'Chỉ nhập lô lớn hơn khi đã đạt hoặc gần điểm hòa vốn.',
        'Xây kênh phụ để không phụ thuộc 1 nơi bán.',
        'Lập danh sách khách mua lại để chăm sóc riêng.',
        'Lập kế hoạch vốn cho 3 tháng tiếp theo dựa trên dữ liệu thật.',
      ],
    },
  ],
  growth: [
    {
      phase: '30',
      title: 'Hiểu khách & sản phẩm chạy',
      items: [
        'Xem dữ liệu 90 ngày qua, chọn 1-2 mẫu bán chạy nhất.',
        'Phỏng vấn 10 khách cũ: lý do mua, điều gì họ thích.',
        'Dừng rải vốn vào mẫu bán chậm, dồn vào mẫu chạy.',
        'Đo tỷ lệ khách mua lại (khách cũ quay lại).',
      ],
    },
    {
      phase: '60',
      title: 'Giữ khách & tối ưu kênh',
      items: [
        'Lập nhóm Zalo / thẻ tích điểm cho khách quen.',
        'Đẩy 1 chiến dịch nội dung trên kênh đang mang nhiều đơn.',
        'Kiểm soát nhập nguyên liệu theo dự báo đơn, tránh tồn kho.',
        'Theo dõi lợi nhuận trên từng dòng, không chỉ doanh thu.',
      ],
    },
    {
      phase: '90',
      title: 'Mở rộng có kiểm soát',
      items: [
        'Thử 1 dòng sản phẩm mới bằng lô nhỏ đặt trước.',
        'Xây kênh phụ nếu kênh chính đã bão hòa.',
        'Đặt mục tiêu tăng trưởng khiêm tốn dựa trên dữ liệu 60 ngày.',
        'Lập quy trình nhập / đóng gói để mở rộng mà không rối.',
      ],
    },
  ],
};

function buildRoadmap(profile: UserProfile): RoadmapPhase[] {
  const stage = stageOf(profile);
  const base = ROADMAP_TEMPLATES[stage];
  const product = profile.productIdeaDescription?.split(',')[0]?.trim();
  const channel = profile.preferredChannel.split(' ')[0];

  return base.map((phase) => ({
    ...phase,
    items: phase.items.map((item) => {
      if (product && item.includes('1 dòng sản phẩm cụ thể')) {
        return item.replace('1 dòng sản phẩm cụ thể', `1 dòng sản phẩm cụ thể (${product})`);
      }
      if (channel && item.includes('kênh chính')) {
        return item.replace('kênh chính', `kênh chính (${channel})`);
      }
      return item;
    }),
  }));
}

function buildNextStep(profile: UserProfile, chosenModelName?: string) {
  const stage = stageOf(profile);
  const chosenLine = chosenModelName
    ? ` Bạn đã chọn mô hình "${chosenModelName}" — các bước dưới đây giúp bạn thử nghiệm nó với rủi ro thấp nhất.`
    : '';
  if (stage === 'discovery') {
    return {
      title: 'Đừng nhập hàng lớn chưa — hỏi 20 khách hàng tiềm năng trước',
      whyItMatters: `Việc bạn cần nhất bây giờ là biết có ai thực sự muốn mua mô hình bạn chọn hay không, trước khi bỏ vốn.${chosenLine}`,
      timeNeeded: '2-3 giờ trong tuần này',
      checklist: [
        'Chọn 1 mô hình từ danh sách gợi ý.',
        'Viết 1 câu mô tả sản phẩm đơn giản.',
        'Hỏi 20 người quen / hội nhóm: "Bạn sẽ mua món này với giá bao nhiêu?"',
        'Ghi lại ai nói sẽ mua và mức giá họ chấp nhận.',
      ],
      done: false,
      chosenModelName,
    };
  }
  if (stage === 'feasibility') {
    return {
      title: 'Chốt 1 dòng sản phẩm, tính chi phí trên mỗi đơn vị, thử lô nhỏ',
      whyItMatters: `Biết chính xác chi phí và giá bán trên 1 đơn vị giúp bạn không bán lỗ và biết cần bán bao nhiêu để hòa vốn.${chosenLine}`,
      timeNeeded: '3-4 giờ trong tuần này',
      checklist: [
        'Chốt 1 dòng sản phẩm cụ thể (không rải nhiều loại).',
        'Tính chi phí nhập + đóng gói + vận chuyển cho 1 đơn vị.',
        'Đặt giá bán với biên lợi nhuận ≥ 30-40%.',
        'Nhập / làm lô thử 15-20 chiếc trước khi nhập lớn.',
      ],
      done: false,
      chosenModelName,
    };
  }
  return {
    title: 'Phỏng vấn 10 khách hàng cũ trước khi ra mẫu mới',
    whyItMatters: `Khách cũ đã mua là nguồn thông tin đáng tin nhất: họ cho bạn biết mẫu nào nên đẩy, mẫu nào nên bỏ, và lý do họ quay lại.${chosenLine}`,
    timeNeeded: '2-3 giờ trong tuần này',
    checklist: [
      'Liệt kê 10-20 khách đã mua trong 90 ngày qua.',
      'Nhắn tin hỏi: "Bạn thích nhất điều gì ở sản phẩm? Bạn sẽ mua lại không?"',
      'Ghi lại câu trả lời và tìm mẫu chung.',
      'Dựa vào đó chọn 1-2 mẫu tập trung đẩy, không ra mẫu mới vội.',
    ],
    done: false,
    chosenModelName,
  };
}

/**
 * Generate a full plan from a profile. Pure: no Date.now / Math.random.
 * Pass `chosenModelId` to seed finance + next-step from a user-chosen model
 * (the "Chọn mô hình này" action) instead of the top-scored recommendation.
 */
export function generatePlan(profile: UserProfile, chosenModelId?: string): Omit<AiPlanResult, 'generatedAt'> {
  const recommendations = selectRecommendations(profile);
  const top = recommendations[0];
  const model = resolveModel(chosenModelId, top);
  const financePlan = buildFinancePlan(profile, model);
  const breakdown = fitScoreBreakdown(profile, model);
  const fitScore = computeFitScore(breakdown);
  const band = bandFor(fitScore);
  const fitScoreInsights = buildFitInsights(profile, model, band);
  const risks = selectRisks(profile);
  const roadmap = buildRoadmap(profile);
  const nextStep = buildNextStep(profile, model?.name);

  return {
    fitScore,
    fitScoreBreakdown: breakdown,
    fitScoreInsights,
    fitScoreBand: band,
    focusArea: focusAreaFor(profile),
    recommendations,
    financePlan,
    risks,
    roadmap,
    nextStep,
  };
}

export { STAGE_BY_PATH };
