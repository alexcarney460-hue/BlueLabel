'use client';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  open: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  in_progress: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  open_deal: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  unqualified: 'bg-red-500/20 text-red-400 border-red-500/30',
  attempted_to_contact: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  connected: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  bad_timing: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

interface StatusBadgeProps {
  status: string | null | undefined;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const s = status || 'unknown';
  const color = STATUS_COLORS[s] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${color}`}>
      {s.replace(/_/g, ' ')}
    </span>
  );
}
