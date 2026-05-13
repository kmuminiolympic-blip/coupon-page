export type CouponStatus = 'unused' | 'used' | 'expired';

export type BusinessType = 'pungdong' | 'dakdongari' | 'happyple' | 'sugisoguem' | 'nuneuldamda';

export interface Coupon {
  id: string;
  token: string;
  title: string;
  business: BusinessType;
  discount_info: string;
  status: CouponStatus;
  used_at: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface CouponCounter {
  business: BusinessType;
  count: number;
}

export interface BusinessInfo {
  id: BusinessType;
  name: string;
  discountOptions: { label: string; value: string }[];
}

export const BUSINESSES: BusinessInfo[] = [
  {
    id: 'pungdong',
    name: '풍동',
    discountOptions: [{ label: '천원 할인', value: '천원 할인' }],
  },
  {
    id: 'dakdongari',
    name: '닭동가리',
    discountOptions: [{ label: '음료 증정', value: '음료 증정' }],
  },
  {
    id: 'happyple',
    name: '해피플',
    discountOptions: [
      { label: '5만원 할인권 1개', value: '5만원 할인권 1개' },
      { label: '3만원 할인권 2개', value: '3만원 할인권 2개' },
      { label: '1만원 할인권 3개', value: '1만원 할인권 3개' },
    ],
  },
  {
    id: 'sugisoguem',
    name: '수기소금',
    discountOptions: [
      { label: '크림치즈 크래커 1개 (6장)', value: '크림치즈 크래커 1개 (6장)' },
      { label: '팥빙수 1개 (6장)', value: '팥빙수 1개 (6장)' },
      { label: '감자튀김 (8장)', value: '감자튀김 (8장)' },
    ],
  },
  {
    id: 'nuneuldamda',
    name: '눈을 담다',
    discountOptions: [
      { label: '아메리카노 1000원 할인', value: '아메리카노 1000원 할인' },
      { label: '요거트 아이스크림 3000원 할인', value: '요거트 아이스크림 3000원 할인' },
    ],
  },
];

export function getBusinessName(business: BusinessType): string {
  const found = BUSINESSES.find((b) => b.id === business);
  return found ? found.name : business;
}

export function getStatusText(status: CouponStatus): string {
  switch (status) {
    case 'unused':
      return '미사용';
    case 'used':
      return '사용완료';
    case 'expired':
      return '만료됨';
    default:
      return status;
  }
}

export function getStatusColor(status: CouponStatus): string {
  switch (status) {
    case 'unused':
      return 'bg-emerald-100 text-emerald-700';
    case 'used':
      return 'bg-slate-100 text-slate-600';
    case 'expired':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

export function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
