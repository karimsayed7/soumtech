'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ActionResult =
  | { success: true }
  | { success: false; error: string }

export async function registerForAsset(assetId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData.user) {
    return { success: false, error: 'لازم تسجل الدخول الأول' }
  }

  const { error } = await supabase.rpc('register_for_asset', {
    p_user_id: userData.user.id,
    p_asset_id: assetId,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/auctions`)
  return { success: true }
}

export async function placeBid(assetId: string, amount: number): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData.user) {
    return { success: false, error: 'لازم تسجل الدخول الأول' }
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: 'المبلغ لازم يكون رقم أكبر من صفر' }
  }

  const { error } = await supabase.rpc('place_bid', {
    p_user_id: userData.user.id,
    p_asset_id: assetId,
    p_amount: amount,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/auctions`)
  return { success: true }
}