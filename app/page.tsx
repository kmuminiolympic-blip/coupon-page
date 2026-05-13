'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Coupon, BusinessType, BUSINESSES, getBusinessName } from '@/lib/types';
import { DashboardStats } from '@/components/dashboard-stats';
import { CouponHistory } from '@/components/coupon-history';
import { CouponIssueForm } from '@/components/coupon-issue-form';
import { IssuedCouponModal } from '@/components/issued-coupon-modal';

export default function HomePage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessType | 'all'>('all');
  const [issuedCoupon, setIssuedCoupon] = useState<Coupon | null>(null);

  const supabase = createClient();

  const fetchCoupons = useCallback(async () => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[v0] Error fetching coupons:', error);
    } else {
      setCoupons(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCouponIssued = (coupon: Coupon) => {
    setIssuedCoupon(coupon);
    fetchCoupons();
  };

  const handleDeleteCoupon = async (id: string) => {
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) {
      console.error('[v0] Error deleting coupon:', error);
    } else {
      fetchCoupons();
    }
  };

  const filteredCoupons =
    selectedBusiness === 'all'
      ? coupons
      : coupons.filter((c) => c.business === selectedBusiness);

  const stats = {
    total: coupons.length,
    byBusiness: BUSINESSES.reduce(
      (acc, b) => {
        acc[b.id] = coupons.filter((c) => c.business === b.id).length;
        return acc;
      },
      {} as Record<BusinessType, number>
    ),
    used: coupons.filter((c) => c.status === 'used').length,
    unused: coupons.filter((c) => c.status === 'unused').length,
    usageRate: coupons.length > 0
      ? Math.round((coupons.filter((c) => c.status === 'used').length / coupons.length) * 100)
      : 0,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900">쿠폰 관리 시스템</h1>
          <p className="text-slate-500 text-sm mt-1">쿠폰 발급 및 현황 관리</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <DashboardStats stats={stats} loading={loading} />

        <CouponIssueForm onCouponIssued={handleCouponIssued} />

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">쿠폰 발급 내역</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedBusiness('all')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  selectedBusiness === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                전체
              </button>
              {BUSINESSES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBusiness(b.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    selectedBusiness === b.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <CouponHistory
            coupons={filteredCoupons}
            loading={loading}
            onDelete={handleDeleteCoupon}
          />
        </section>
      </main>

      {issuedCoupon && (
        <IssuedCouponModal
          coupon={issuedCoupon}
          onClose={() => setIssuedCoupon(null)}
        />
      )}
    </div>
  );
}
