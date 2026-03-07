'use client';

const STAGE_COLORS: Record<string, string> = {
  subscriber: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  lead: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  marketing_qualified_lead: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  sales_qualified_lead: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  opportunity: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  customer: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  evangelist: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  other: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

interface StageBadgeProps {
  stage: string | null | undefined;
}

export default function StageBadge({ stage }: StageBadgeProps) {
  const s = stage || 'unknown';
  const color = STAGE_COLORS[s] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${color}`}>
      {s.replace(/_/g, ' ')}
    </span>
  );
}
