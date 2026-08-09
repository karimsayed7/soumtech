
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/lib/supabase/database.types'
import type { AuctionListItem } from './getAuctions'

export type RegisteredAsset = Tables<'assets'> & {
  auction: AuctionListItem
  real_bids_count: number
  is_registered: true
  is_top_bidder: boolean
}

export async function getRegisteredAssets(): Promise<RegisteredAsset[]> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return []

  const currentUserId = userData.user.id

  const { data: registrations, error } = await supabase
    .from('registrations')
    .select('asset_id, assets(*, auction:auctions_live(*, companies(name, logo_url)))')
    .eq('user_id', currentUserId)
    .order('created_at', { ascending: false })

  if (error) throw error
  if (!registrations || registrations.length === 0) return []

  const assetIds = registrations.map((r) => r.asset_id)

  const { data: bids } = await supabase
    .from('bidders')
    .select('asset_id, bidder_id, bidder_type, bid_amount')
    .in('asset_id', assetIds)
    .order('bid_amount', { ascending: false })

  const bidsCountMap = new Map<string, number>()
  const topBidderMap = new Map<string, { bidder_id: string; bidder_type: string }>()

  ;(bids ?? []).forEach((bid) => {
    if (!bid.asset_id) return
    bidsCountMap.set(bid.asset_id, (bidsCountMap.get(bid.asset_id) ?? 0) + 1)
    if (!bid.bidder_id || topBidderMap.has(bid.asset_id)) return
    topBidderMap.set(bid.asset_id, { bidder_id: bid.bidder_id, bidder_type: bid.bidder_type })
  })

  return registrations
    .filter((r) => r.assets !== null)
    .map((r) => {
      const asset = r.assets as Tables<'assets'> & { auction: AuctionListItem }
      const topBidder = topBidderMap.get(asset.id)

      return {
        ...asset,
        real_bids_count: bidsCountMap.get(asset.id) ?? 0,
        is_registered: true as const,
        is_top_bidder: topBidder?.bidder_type === 'real' && topBidder?.bidder_id === currentUserId,
      }
    })
}