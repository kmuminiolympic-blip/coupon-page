'use client';

import { Coupon, getBusinessName } from '@/lib/types';
import { QRCodeSVG } from 'qrcode.react';
import { XMarkIcon, ClipboardIcon } from '@heroicons/react/24/outline';

interface QRCodeModalProps {
  coupon: Coupon;
  onClose: () => void;
}

export function QRCodeModal({ coupon, onClose }: QRCodeModalProps) {
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
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{coupon.title}</h3>
          <p className="text-sm text-slate-500 mb-4">
            {getBusinessName(coupon.business)} - {coupon.discount_info}
          </p>

          <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block mb-4">
            <QRCodeSVG value={couponUrl} size={200} />
          </div>

          <div className="bg-slate-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-slate-500 mb-1">쿠폰 URL</p>
            <p className="text-sm text-slate-700 break-all font-mono">{couponUrl}</p>
          </div>

          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition-colors"
          >
            <ClipboardIcon className="w-4 h-4" />
            URL 복사하기
          </button>
        </div>
      </div>
    </div>
  );
}
