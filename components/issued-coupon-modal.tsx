'use client';

import { Coupon, getBusinessName } from '@/lib/types';
import { QRCodeSVG } from 'qrcode.react';
import { XMarkIcon, ClipboardIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface IssuedCouponModalProps {
  coupon: Coupon;
  onClose: () => void;
}

export function IssuedCouponModal({ coupon, onClose }: IssuedCouponModalProps) {
  const couponUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/coupon/${coupon.token}`
    : `/coupon/${coupon.token}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(couponUrl);
    alert('URL이 복사되었습니다.');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-slate-900 mb-1">쿠폰이 발급되었습니다!</h3>
          <p className="text-sm text-slate-500 mb-6">
            아래 QR 코드 또는 URL을 공유하세요.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <p className="text-sm font-medium text-slate-700 mb-1">{coupon.title}</p>
            <p className="text-xs text-slate-500">
              {getBusinessName(coupon.business)} - {coupon.discount_info}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block mb-4">
            <QRCodeSVG value={couponUrl} size={180} />
          </div>

          <div className="bg-slate-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-slate-500 mb-1">쿠폰 URL</p>
            <p className="text-sm text-slate-700 break-all font-mono">{couponUrl}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyToClipboard}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition-colors"
            >
              <ClipboardIcon className="w-4 h-4" />
              URL 복사
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
