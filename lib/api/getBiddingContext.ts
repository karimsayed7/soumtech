import { createClient } from '@/lib/supabase/server'

export interface BiddingContext {
  userId: string | null
  walletBalance: number
  isRegistered: boolean
}

export async function getBiddingContext(assetId: string): Promise<BiddingContext> {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    return { userId: null, walletBalance: 0, isRegistered: false }
  }

  const [{ data: profile }, { data: registration }] = await Promise.all([
    supabase.from('profiles').select('wallet_balance').eq('id', userData.user.id).single(),
    supabase
      .from('registrations')
      .select('id')
      .eq('user_id', userData.user.id)
      .eq('asset_id', assetId)
      .maybeSingle(),
  ])

  return {
    userId: userData.user.id,
    walletBalance: Number(profile?.wallet_balance ?? 0),
    isRegistered: !!registration,
  }
}