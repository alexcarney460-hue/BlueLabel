'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

export default function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-slate-400 mb-1">{label}</div>
          <div className="text-2xl font-bold text-white">{value}</div>
          {trend && <div className="text-xs text-emerald-400 mt-1">{trend}</div>}
        </div>
        <div className="p-2.5 bg-slate-800 rounded-xl text-sky-400">{icon}</div>
      </div>
    </div>
  );
}
