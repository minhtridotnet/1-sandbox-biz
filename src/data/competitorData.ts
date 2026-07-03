import type { Competitor, CompetitorRow } from '@/types';

/**
 * Competitor comparison matrix (Screen 6).
 * Columns: 1 SANDBOX BIZ + 4 reference tools. Rows: the 6 comparison axes from the spec.
 * Vietnamese throughout. 1 SANDBOX BIZ column is highlighted in the UI.
 */
export const COMPETITORS: Competitor[] = [
  { name: '1 SANDBOX BIZ', accent: 'gold', isSandboxBiz: true },
  { name: 'KiotViet', accent: 'cyan' },
  { name: 'Sapo', accent: 'cyan' },
  { name: 'MISA eShop', accent: 'cyan' },
];

export const COMPETITOR_ROWS: CompetitorRow[] = [
  {
    label: 'Phù hợp nhất với',
    values: [
      'Người mới chưa bắt đầu hoặc đang thử nghiệm ý tưởng',
      'Shop đã bán, cần quản lý bán hàng & tồn kho',
      'Người bán đa kênh đã hoạt động',
      'Doanh nghiệp nhỏ đã ổn định',
    ],
  },
  {
    label: 'Bắt đầu từ câu hỏi nào',
    values: [
      '"Tôi nên bắt đầu bán gì với số vốn này?"',
      '"Làm sao quản lý đơn hàng, tồn kho?"',
      '"Làm sao bán đồng thời trên nhiều kênh?"',
      '"Làm sao quản lý doanh thu và kế toán?"',
    ],
  },
  {
    label: 'Giai đoạn kinh doanh',
    values: [
      'Trước khi bắt đầu / mới bắt đầu',
      'Đã bán',
      'Đã bán, đa kênh',
      'Đã ổn định',
    ],
  },
  {
    label: 'Giá trị chính',
    values: [
      'Gợi ý mô hình + tài chính + rủi ro + lộ trình trước khi bỏ vốn',
      'Quản lý bán hàng, tồn kho, doanh thu',
      'Quản lý đa kênh bán hàng online',
      'Bán hàng + kế toán cơ bản',
    ],
  },
  {
    label: 'Không giải quyết được',
    values: [
      'Chưa quản lý vận hành sau khi đã bán đều (sẽ bổ sung tính năng này ở giai đoạn sau)',
      'Không giúp chọn món hàng hay kiểm tra khả thi trước khi bắt đầu',
      'Không giúp chọn kênh đầu tiên để bắt đầu',
      'Không giúp người mới hiểu khả thi trước khi ổn định',
    ],
  },
  {
    label: 'Điểm khác của 1 SANDBOX BIZ',
    values: [
      'Giúp bạn trước khi bắt đầu — nơi các công cụ kia chưa chạm tới',
      '1 SANDBOX BIZ giúp trước khi mở shop / nhập hàng; KiotViet giúp sau',
      '1 SANDBOX BIZ giúp chọn kênh đầu tiên; Sapo giúp quản lý nhiều kênh sau',
      '1 SANDBOX BIZ giúp người mới kiểm tra khả thi; MISA giúp ổn định vận hành',
    ],
  },
];
