'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Coupon, getBusinessName, getStatusText } from '@/lib/types';
import { TicketIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface CouponViewProps {
  coupon: Coupon;
}

export function CouponView({ coupon: initialCoupon }: CouponViewProps) {
  const [coupon, setCoupon] = useState(initialCoupon);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUsing, setIsUsing] = useState(false);

  const supabase = createClient();

  const isUsable = coupon.status === 'unused';
  const isUsed = coupon.status === 'used';
  const isExpired = coupon.status === 'expired';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleUse = async () => {
    setIsUsing(true);
    const { error } = await supabase
      .from('coupons')
      .update({
        status: 'used',
        used_at: new Date().toISOString(),
      })
      .eq('id', coupon.id);

    if (error) {
      console.error('[v0] Error using coupon:', error);
      alert('쿠폰 사용에 실패했습니다.');
    } else {
      setCoupon({ ...coupon, status: 'used', used_at: new Date().toISOString() });
    }
    setIsUsing(false);
    setShowConfirm(false);
  };

  // Used Coupon View
  if (isUsed) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full">
          <div className="bg-slate-200 rounded-3xl p-6 relative overflow-hidden">
            {/* Diagonal stripes pattern for used coupon */}
            <div className="absolute inset-0 opacity-10">
              <div 
                className="absolute inset-0" 
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)',
                  backgroundSize: '10px 10px'
                }}
              />
            </div>
            
            <div className="relative">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircleIcon className="w-8 h-8 text-slate-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-500">{getBusinessName(coupon.business)}</h1>
                <p className="text-sm text-slate-400 mt-1">쿠폰 #{coupon.title}</p>
              </div>

              {/* Discount Info */}
              <div className="bg-slate-300 rounded-2xl p-5 text-center mb-4">
                <p className="text-slate-400 text-sm mb-1">할인 내용</p>
                <p className="text-xl font-bold text-slate-500">{coupon.discount_info}</p>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-slate-400 mb-6">
                <div className="flex justify-between">
                  <span>발급일</span>
                  <span>{formatDate(coupon.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span>사용일</span>
                  <span>{coupon.used_at ? formatDate(coupon.used_at) : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span>만료일</span>
                  <span>{formatDate(coupon.expires_at)}</span>
                </div>
              </div>

              {/* Used Button */}
              <button
                disabled
                className="w-full py-4 bg-slate-400 text-white rounded-2xl font-semibold text-lg cursor-not-allowed"
              >
                사용완료
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Expired Coupon View
  if (isExpired) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full">
          <div className="bg-red-50 rounded-3xl p-6 border-2 border-red-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-red-600">{getBusinessName(coupon.business)}</h1>
              <p className="text-sm text-red-400 mt-1">쿠폰 #{coupon.title}</p>
            </div>

            <div className="bg-red-100 rounded-2xl p-5 text-center mb-4">
              <p className="text-red-400 text-sm mb-1">할인 내용</p>
              <p className="text-xl font-bold text-red-500">{coupon.discount_info}</p>
            </div>

            <div className="space-y-2 text-sm text-red-400 mb-6">
              <div className="flex justify-between">
                <span>발급일</span>
                <span>{formatDate(coupon.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span>만료일</span>
                <span className="text-red-500 font-medium">{formatDate(coupon.expires_at)}</span>
              </div>
            </div>

            <button
              disabled
              className="w-full py-4 bg-red-300 text-white rounded-2xl font-semibold text-lg cursor-not-allowed"
            >
              만료된 쿠폰
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Coupon View
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="bg-white rounded-3xl shadow-xl p-6 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-full" />
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-50 rounded-full" />
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TicketIcon className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{getBusinessName(coupon.business)}</h1>
            <p className="text-sm text-slate-500 mt-1">쿠폰 #{coupon.title}</p>
          </div>

          {/* Discount Info */}
          <div className="bg-emerald-50 rounded-2xl p-5 text-center mb-4">
            <p className="text-emerald-600 text-sm mb-1">할인 내용</p>
            <p className="text-2xl font-bold text-emerald-700">{coupon.discount_info}</p>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-slate-500 mb-6">
            <div className="flex justify-between">
              <span>발급일</span>
              <span className="text-slate-700">{formatDate(coupon.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span>만료일</span>
              <span className="text-slate-700">{formatDate(coupon.expires_at)}</span>
            </div>
          </div>

          {/* Use Button */}
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-semibold text-lg hover:bg-emerald-700 transition-colors active:scale-[0.98]"
          >
            쿠폰 사용하기
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">쿠폰을 사용하시겠습니까?</h3>
            <p className="text-sm text-slate-500 mb-6">
              사용하면 쿠폰이 소멸됩니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleUse}
                disabled={isUsing}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isUsing ? '처리중...' : '사용하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
