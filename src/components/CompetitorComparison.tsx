import { CheckCircle2 } from 'lucide-react';
import type { Competitor, CompetitorRow } from '@/types';
import { COMPETITORS, COMPETITOR_ROWS } from '@/data/competitorData';

interface CompetitorComparisonProps {
  competitors?: Competitor[];
  rows?: CompetitorRow[];
}

export default function CompetitorComparison({
  competitors = COMPETITORS,
  rows = COMPETITOR_ROWS,
}: CompetitorComparisonProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10 text-center">
        <p className="section-eyebrow mb-3">Giới thiệu</p>
        <h2 className="text-3xl font-bold text-sandbox-text md:text-4xl">
          1 SANDBOX BIZ giúp bạn <span className="text-gradient-gold">trước</span> khi bắt đầu
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sandbox-softText">
          1 SANDBOX BIZ là trợ lý AI dành cho doanh nghiệp một người, người bán hàng online, freelancer và người mới khởi nghiệp — những người có ý tưởng kinh doanh nhưng chưa biết bắt đầu từ đâu, cần bao nhiêu vốn, có lời hay không và bước tiếp theo nên làm gì.
<br className="hidden md:inline" /><br className="hidden md:inline" />
Ngày nay, Internet, mạng xã hội, TikTok Shop, sàn thương mại điện tử và AI đang khiến việc bắt đầu kinh doanh trở nên dễ tiếp cận hơn bao giờ hết. Một người có thể tự bán hàng, tự làm nội dung, tự tìm khách và vận hành một mô hình nhỏ ngay từ điện thoại hoặc laptop. Nhưng thực tế là nhiều người vẫn bắt đầu trong mơ hồ: chọn sản phẩm theo cảm tính, nhập hàng khi chưa kiểm chứng nhu cầu, không biết tính chi phí, không rõ mình đang lời hay lỗ, và không có một lộ trình phát triển rõ ràng.
<br className="hidden md:inline" /><br className="hidden md:inline" />
1 SANDBOX BIZ được xây dựng để giải quyết khoảng trống đó.
<br className="hidden md:inline" /><br className="hidden md:inline" />
Thay vì thả người dùng vào một chatbot trống và bắt họ tự nghĩ câu hỏi, 1 SANDBOX BIZ dẫn người dùng đi từng bước. Trước tiên, bạn chọn tình huống gần nhất với mình: chưa biết nên bán gì, đã có ý tưởng và muốn kiểm tra khả thi, hoặc đã bán được hàng và muốn phát triển tiếp. Sau đó, AI sẽ hỏi một số câu đơn giản về vốn, thời gian, kỹ năng, sản phẩm, khách hàng mục tiêu, mục tiêu thu nhập và mức độ chấp nhận rủi ro.
<br className="hidden md:inline" /><br className="hidden md:inline" />
Từ câu trả lời của bạn, AI sẽ gợi ý mô hình kinh doanh phù hợp, ước tính vốn và chi phí cơ bản, giúp bạn hiểu điểm hòa vốn, cảnh báo những rủi ro dễ gặp và đề xuất lộ trình hành động 30–60–90 ngày. Quan trọng nhất, AI sẽ giúp bạn xác định việc cần làm tiếp theo, để không bị rối giữa quá nhiều lời khuyên.
<br className="hidden md:inline" /><br className="hidden md:inline" />
1 SANDBOX BIZ không quyết định thay bạn. AI chỉ đóng vai trò như một người đồng hành: đặt đúng câu hỏi, diễn giải đơn giản, giúp bạn nhìn rõ lựa chọn và thử nghiệm nhỏ trước khi đầu tư lớn.
<br className="hidden md:inline" /><br className="hidden md:inline" />
Chúng tôi tin rằng rất nhiều người không thất bại vì thiếu cố gắng, mà vì phải bắt đầu một mình, thiếu định hướng và thiếu công cụ phù hợp.
        </p>
      </header>

      <div className="card-premium animate-fade-up overflow-x-auto p-0 hidden">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="w-44 border-b border-divider bg-sandbox-elevated/60 px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-sandbox-muted">
                Tiêu chí
              </th>
              {competitors.map((c) => (
                <th
                  key={c.name}
                  className={`border-b border-divider px-5 py-4 text-center align-bottom ${
                    c.isSandboxBiz
                      ? 'border-sandbox-gold/30 bg-sandbox-gold/10'
                      : 'bg-sandbox-elevated/40'
                  }`}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                      c.isSandboxBiz ? 'text-sandbox-gold' : 'text-sandbox-text'
                    }`}
                  >
                    {c.isSandboxBiz && <CheckCircle2 size={15} />}
                    {c.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.label} className={ri % 2 === 1 ? 'bg-white/[0.015]' : ''}>
                <th
                  scope="row"
                  className="border-b border-divider px-5 py-4 align-top text-xs font-semibold uppercase tracking-wide text-sandbox-softText"
                >
                  {row.label}
                </th>
                {row.values.map((value, ci) => {
                  const competitor = competitors[ci];
                  const isSb = competitor?.isSandboxBiz;
                  return (
                    <td
                      key={ci}
                      className={`border-b border-divider px-5 py-4 align-top text-sm ${
                        isSb ? 'bg-sandbox-gold/[0.06] text-sandbox-text' : 'text-sandbox-softText'
                      }`}
                    >
                      {isSb ? <span className="font-medium">{value}</span> : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-sandbox-muted hidden">
        1 SANDBOX BIZ không thay thế KiotViet, Sapo hay MISA — nó bổ sung cho giai đoạn mà các công cụ đó chưa chạm tới.
      </p>
    </section>
  );
}
