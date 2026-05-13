import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { CouponView } from '@/components/coupon-view';

interface CouponPageProps {
  params: Promise<{ token: string }>;
}

export default async function CouponPage({ params }: CouponPageProps) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !coupon) {
    notFound();
  }

  // Check if expired
  const isExpired = new Date(coupon.expires_at) < new Date();
  if (isExpired && coupon.status === 'unused') {
    await supabase
      .from('coupons')
      .update({ status: 'expired' })
      .eq('id', coupon.id);
    coupon.status = 'expired';
  }

  return <CouponView coupon={coupon} />;
}
