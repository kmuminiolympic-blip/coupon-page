import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // service role key 사용
)

export async function POST(req: Request) {
  try {
    const { token, title, business, discount_info, expires_at } = await req.json()

    // 쿠폰 insert
    const { data: couponData, error: couponError } = await supabase
      .from('coupons')
      .insert({ token, title, business, discount_info, expires_at })
      .select()
      .single()

    if (couponError) throw couponError

    // 카운터 upsert (없으면 insert, 있으면 update)
    const { data: counter } = await supabase
      .from('coupon_counters')
      .select('count')
      .eq('business', business)
      .single()

    await supabase
      .from('coupon_counters')
      .upsert({
        business,
        count: (counter?.count ?? 0) + 1
      })

    return NextResponse.json({ success: true, coupon: couponData })
  } catch (error: any) {
    console.error('Coupon error:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
