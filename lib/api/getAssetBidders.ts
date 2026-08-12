
import { createClient } from '@/lib/supabase/server'

export interface BidderRow {
  id: string
  bid_amount: number
  bid_at: string
  bidder_name: string
  bidder_code: string
}

type BidderInfo = { id: string; full_name: string; code: string | null }

export async function getAssetBidders(assetId: string): Promise<BidderRow[]> {
  const supabase = await createClient()

  const { data: bids, error } = await supabase
    .from('bidders')
    .select('id, bid_amount, bid_at, bidder_id, bidder_type')
    .eq('asset_id', assetId)
    .order('bid_amount', { ascending: false })

  if (error) throw error
  if (!bids || bids.length === 0) return []

  const displayIds = bids
    .filter((b) => b.bidder_type === 'display' && b.bidder_id !== null)
    .map((b) => b.bidder_id as string)

  const realIds = bids
    .filter((b) => b.bidder_type === 'real' && b.bidder_id !== null)
    .map((b) => b.bidder_id as string)

  const [{ data: displayBidders }, { data: realBidders }] = await Promise.all([
    displayIds.length
      ? supabase.from('display_bidders').select('id, full_name, national_id').in('id', displayIds)
      : Promise.resolve({ data: [] as { id: string; full_name: string; national_id: string | null }[] }),
    realIds.length
      ? supabase.from('profiles').select('id, full_name, phone').in('id', realIds)
      : Promise.resolve({ data: [] as { id: string; full_name: string; phone: string | null }[] }),
  ])

  const nameMap = new Map<string, BidderInfo>()

  ;(displayBidders ?? []).forEach((b) =>
  nameMap.set(b.id, { id: b.id, full_name: b.full_name ?? 'مجهول', code: b.national_id })
)
  ;(realBidders ?? []).forEach((b) =>
  nameMap.set(b.id, { id: b.id, full_name: b.full_name ?? 'مجهول', code: b.phone })
)

  return bids
    .filter((bid) => bid.bidder_id !== null)
    .map((bid) => {
      const info = nameMap.get(bid.bidder_id as string)
      return {
        id: bid.id,
        bid_amount: bid.bid_amount,
        bid_at: bid.bid_at,
        bidder_name: info?.full_name ?? 'مجهول',
        bidder_code: info?.code?.slice(-5) ?? '-----',
      }
    })
}