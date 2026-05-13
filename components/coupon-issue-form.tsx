'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Coupon, BusinessType, BUSINESSES, generateToken } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';

interface CouponIssueFormProps {
  onCouponIssued: (coupon: Coupon) => void;
}

export function CouponIssueForm({ onCouponIssued }: CouponIssueFormProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessType>('pungdong');
  const [selectedDiscount, setSelectedDiscount] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [nextCount, setNextCount] = useState<Record<BusinessType, number>>({} as Record<BusinessType, number>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchCounters();
  }, []);

  useEffect(() => {
    const business = BUSINESSES.find((b) => b.id === selectedBusiness);
    if (business && business.discountOptions.length > 0) {
      setSelectedDiscount(business.discountOptions[0].value);
    }
  }, [selectedBusiness]);

  const fetchCounters = async () => {
    const { data, error } = await supabase.from('coupon_counters').select('*');
    if (data) {
      const counters: Record<BusinessType, number> = {} as Record<BusinessType, number>;
      data.forEach((row: { business: BusinessType; count: number }) => {
        counters[row.business] = row.count + 1;
      });
      setNextCount(counters);
    }
  };

  const selectedBusinessInfo = BUSINESSES.find((b) => b.id === selectedBusiness);
  const defaultTitle = nextCount[selectedBusiness] ? `${nextCount[selectedBusiness]}번` : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = generateToken();
    const title = customTitle || defaultTitle;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const { data: couponData, error: couponError } = await supabase
      .from('coupons')
      .insert({
        token,
        title,
        business: selectedBusiness,
        discount_info: selectedDiscount,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (couponError) {
      console.error('[v0] Error creating coupon:', couponError);
      alert('쿠폰 발급에 실패했습니다.');
      setIsSubmitting(false);
      return;
    }

    // Update counter
    await supabase
      .from('coupon_counters')
      .update({ count: nextCount[selectedBusiness] })
      .eq('business', selectedBusiness);

    setCustomTitle('');
    fetchCounters();
    onCouponIssued(couponData);
    setIsSubmitting(false);
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">쿠폰 발행</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">업체 선택</label>
            <select
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value as BusinessType)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              {BUSINESSES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">할인 내용</label>
            <select
              value={selectedDiscount}
              onChange={(e) => setSelectedDiscount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              {selectedBusinessInfo?.discountOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              제목 <span className="text-slate-400">(기본: {defaultTitle})</span>
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder={defaultTitle}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">유효기간 (일)</label>
            <input
              type="number"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(Number(e.target.value))}
              min={1}
              max={365}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            <PlusIcon className="w-4 h-4 mr-2" />
            {isSubmitting ? '발급 중...' : '쿠폰 발행'}
          </Button>
        </div>
      </form>
    </section>
  );
}
