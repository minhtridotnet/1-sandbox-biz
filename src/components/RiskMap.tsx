import { AlertTriangle, ShieldCheck } from 'lucide-react';
import type { RiskItem } from '@/types';
import Card from './ui/Card';
import Badge from './ui/Badge';

interface RiskMapProps {
  risks: RiskItem[];
}

function severityTone(severity: RiskItem['severity']) {
  return severity === 'Low' ? 'risk-low' : severity === 'Medium' ? 'risk-med' : 'risk-high';
}

function severityLabel(severity: RiskItem['severity']) {
  return severity === 'Low' ? 'Mức độ thấp' : severity === 'Medium' ? 'Mức độ trung bình' : 'Mức độ cao';
}

export default function RiskMap({ risks }: RiskMapProps) {
  return (
    <section>
      <p className="section-eyebrow mb-1">D. Bản đồ rủi ro</p>
      <h3 className="mb-4 text-xl font-bold text-sandbox-text">Rủi ro cần tránh ở giai đoạn này</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {risks.map((risk) => (
          <Card key={risk.id} variant="base" glow="none" className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-sandbox-gold" />
                <h4 className="text-base font-bold text-sandbox-text">{risk.title}</h4>
              </div>
              <Badge tone={severityTone(risk.severity)}>{severityLabel(risk.severity)}</Badge>
            </div>
            <p className="mt-3 text-sm text-sandbox-softText">{risk.whyItMatters}</p>
            <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-sandbox-aqua/20 bg-sandbox-aqua/5 px-3 py-2.5">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-sandbox-aqua" />
              <p className="text-sm text-sandbox-softText">{risk.howToReduce}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
