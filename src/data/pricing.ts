import type { PricingTier } from '@/types';

/**
 * Revenue model (Screen 7). 4 tiers per spec.
 * Growth is the recommended tier (gold-highlighted in UI).
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free Starter',
    price: '0 ₫',
    period: 'miễn phí',
    description: 'Làm quen lần đầu với 1 SANDBOX BIZ — thử một ý tưởng.',
    features: [
      '1 lần phỏng vấn AI Business Discovery',
      '1 gợi ý mô hình kinh doanh cơ bản',
      'Danh sách việc cần làm cơ bản',
    ],
    cta: 'Bắt đầu miễn phí',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '49.000 ₫',
    period: '/tháng',
    description: 'Cho người đang thử nghiệm nhiều ý tưởng và muốn so sánh.',
    features: [
      '3 kế hoạch kinh doanh / tháng',
      'Gợi ý mô hình kinh doanh',
      'Bảng tài chính cơ bản',
      'Bản đồ rủi ro',
      'Lộ trình 30 ngày',
    ],
    cta: 'Chọn Starter',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '99.000 ₫',
    period: '/tháng',
    description: 'Cho người đã bán và muốn tăng trưởng có kiểm soát.',
    features: [
      'Nhiều kế hoạch hơn mỗi tháng',
      'Lộ trình 30-60-90 ngày',
      'Next Step Advisor hàng tuần',
      'Theo dõi nhiều dòng sản phẩm',
      'So sánh kịch bản',
    ],
    cta: 'Chọn Growth',
    recommended: true,
  },
  {
    id: 'launch',
    name: 'Business Launch Pack',
    price: '199.000 ₫',
    period: 'trả một lần',
    description: 'Gói một lần cho người sẵn sàng ra mắt một ý tưởng.',
    features: [
      '1 lần kiểm tra ý tưởng kinh doanh trọn vẹn',
      'Bảng tài chính cơ bản',
      'Bản đồ rủi ro',
      'Lộ trình 30-60-90 ngày',
      'Danh sách việc trước khi ra mắt',
    ],
    cta: 'Mua gói Launch',
  },
];

export const PRICING_NOTE =
  'Mô hình doanh thu chính: B2B / micro-SaaS cho người kinh doanh nhỏ. Định hướng tương lai (không phải mô hình chính): hợp tác với ngân hàng, chương trình giáo dục hoặc đào tạo khởi nghiệp để tài trợ truy cập cho người trẻ khởi nghiệp.';
