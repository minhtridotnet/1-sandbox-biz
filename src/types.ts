export type UserPath = 'discover' | 'feasibility' | 'grow';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type RiskTolerance = 'low' | 'medium' | 'high';

export type ProductType = 'product' | 'service' | 'both';

export type BusinessMode = 'online' | 'offline' | 'hybrid';

export type Stage = 'discovery' | 'feasibility' | 'growth';

export type View =
  | 'landing'
  | 'path'
  | 'interview'
  | 'dashboard'
  | 'personas'
  | 'sessions';

export type AnswerValue = string | number | boolean | string[];

export interface Question {
  id: string;
  prompt: string;
  helper?: string;
  type: 'chips' | 'text' | 'number' | 'boolean';
  options?: string[];
  unit?: string;
  placeholder?: string;
  required?: boolean;
  multi?: boolean;
  allowOther?: boolean;
}

export type IncomeFocus = 'business' | 'job' | 'balance';
export type PriorityOrientation = 'low-risk' | 'profit' | 'skills' | 'long-term';
export type GoalScale = 'small' | 'bigger';

export interface UserProfile {
  path: UserPath;
  answers: Record<string, AnswerValue>;
  capital: number;
  hoursPerWeek: number;
  skills: string[];
  productType: ProductType;
  targetCustomers: string;
  incomeGoal: number;
  biggestFear: string;
  hasSoldBefore: boolean;
  hasProductIdea: boolean;
  productIdeaDescription?: string;
  preferredChannel: string;
  riskTolerance: RiskTolerance;
  businessMode: BusinessMode;
  age?: number;
  occupation?: string;
  city?: string;
  displayName?: string;
  capitalTightness: number;
  incomeFocus: IncomeFocus;
  industryExperience: number;
  marketFamiliarity: number;
  priorityOrientation: PriorityOrientation;
  goalScale: GoalScale;
  currentShopScale?: string;
}

export interface BusinessRecommendation {
  id: string;
  name: string;
  whyItFits: string;
  estimatedCapital: number;
  riskLevel: RiskLevel;
  firstExperiment: string;
  firstChannel: string;
  fitScore?: number;
  complexityScore: number;
  fitsWhom: string;
  needsCapital: string;
  needsTime: string;
  pros: string[];
  risks: string[];
  requiredSkills: string[];
  skillLevel: string;
  competition: string;
  howItOperates: string;
}

export interface FinancePlan {
  productionBudget: number;
  operatingReserve: number;
  totalCapital: number;
  productCost: number;
  packagingCost: number;
  shippingSupport: number;
  marketingBudget: number;
  sellingPrice: number;
  fixedStartupCost: number;
  totalUnitCost: number;
  grossProfitPerUnit: number;
  breakEvenQuantity: number;
  estimatedTestQuantity: number;
  sellRate: number;
  sellStrategy: 'attack' | 'balance' | 'defensive';
  sellRateDimensions?: {
    complexity: number;
    capital: number;
    market: number;
    reach: number;
  };
  testQuantityCapMessage?: string;
}

export interface RiskItem {
  id: string;
  title: string;
  whyItMatters: string;
  howToReduce: string;
  severity: RiskLevel;
}

export interface RoadmapPhase {
  phase: '30' | '60' | '90';
  title: string;
  items: string[];
}

export type FitCriterionKey = 'skillMatch' | 'timeFit' | 'experience' | 'financial' | 'goalAlignment';

export type FitScoreBand = 'strong' | 'moderate' | 'low';

export interface FitInsight {
  strength: string;
  weakness: string;
  nextAction: string;
}

export interface FitScoreBreakdown {
  skillMatch: number;
  timeFit: number;
  experience: number;
  financial: number;
  goalAlignment: number;
}

export interface NextStep {
  title: string;
  whyItMatters: string;
  timeNeeded: string;
  checklist: string[];
  done: boolean;
  chosenModelName?: string;
}

export interface AiPlanResult {
  fitScore: number;
  fitScoreBreakdown: FitScoreBreakdown;
  fitScoreInsights: {
    overall: FitInsight;
    perCriterion: Record<FitCriterionKey, FitInsight>;
  };
  fitScoreBand: FitScoreBand;
  focusArea: string;
  recommendations: BusinessRecommendation[];
  financePlan: FinancePlan;
  risks: RiskItem[];
  roadmap: RoadmapPhase[];
  nextStep: NextStep;
  generatedAt: string;
}

export interface Persona {
  id: string;
  profile: UserProfile;
  summary: string;
  tagline: string;
  focus: string;
}

export interface CompetitorRow {
  label: string;
  values: string[];
}

export interface Competitor {
  name: string;
  accent: string;
  isSandboxBiz?: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  recommended?: boolean;
}

export interface AppState {
  view: View;
  path: UserPath | null;
  profile: UserProfile | null;
  result: AiPlanResult | null;
  chosenModelId?: string;
}
