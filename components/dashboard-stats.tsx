'use client';

import { BusinessType, BUSINESSES, getBusinessName } from '@/lib/types';
import { TicketIcon, CheckCircleIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface DashboardStatsProps {
  stats: {
    total: number;
    byBusiness: Record<BusinessType, number>;
    used: number;
    unused: number;
    usageRate: number;
  };
  loading: boolean;
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  if (loading) {
    return (
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-slate-200 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">쿠폰 발급 현황</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <StatCard
          label="전체 발급"
          value={stats.total}
          icon={<TicketIcon className="w-5 h-5" />}
          color="bg-blue-50 text-blue-600"
        />
        
        {BUSINESSES.map((b) => (
          <StatCard
            key={b.id}
            label={b.name}
            value={stats.byBusiness[b.id] || 0}
            color="bg-slate-50 text-slate-600"
          />
        ))}
        
        <StatCard
          label="사용완료"
          value={stats.used}
          icon={<CheckCircleIcon className="w-5 h-5" />}
          color="bg-emerald-50 text-emerald-600"
        />
        
        <StatCard
          label="미사용"
          value={stats.unused}
          icon={<ClockIcon className="w-5 h-5" />}
          color="bg-amber-50 text-amber-600"
        />
        
        <StatCard
          label="사용률"
          value={`${stats.usageRate}%`}
          icon={<ChartBarIcon className="w-5 h-5" />}
          color="bg-indigo-50 text-indigo-600"
        />
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`rounded-lg p-4 ${color}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
