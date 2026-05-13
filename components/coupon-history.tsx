'use client';

import { Coupon, getBusinessName, getStatusText, getStatusColor } from '@/lib/types';
import { TrashIcon, QrCodeIcon, LinkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { QRCodeModal } from './qr-code-modal';

interface CouponHistoryProps {
  coupons: Coupon[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function CouponHistory({ coupons, loading, onDelete }: CouponHistoryProps) {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getCouponUrl = (token: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/coupon/${token}`;
    }
    return `/coupon/${token}`;
  };

  const copyToClipboard = async (token: string) => {
    const url = getCouponUrl(token);
    await navigator.clipboard.writeText(url);
    alert('URL이 복사되었습니다.');
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-slate-100 rounded" />
        ))}
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        발급된 쿠폰이 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">제목</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">업체</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">할인 내용</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">상태</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">발급일</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">사용일</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">만료일</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">액션</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-sm font-medium text-slate-900">{coupon.title}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{getBusinessName(coupon.business)}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{coupon.discount_info}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(coupon.status)}`}>
                    {getStatusText(coupon.status)}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-slate-600">{formatDate(coupon.created_at)}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{formatDate(coupon.used_at)}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{formatDate(coupon.expires_at)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCoupon(coupon)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                      title="QR 코드 보기"
                    >
                      <QrCodeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(coupon.token)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                      title="URL 복사"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('정말 삭제하시겠습니까?')) {
                          onDelete(coupon.id);
                        }
                      }}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="삭제"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCoupon && (
        <QRCodeModal
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
        />
      )}
    </>
  );
}
