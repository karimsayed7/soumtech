import { createClient } from '@/lib/supabase/server'

export async function getAssetsByAuction(auctionId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('assets')
    .select('id, property_name, property_type, district, area_sqm, current_bid_price, images')
    .eq('auction_id', auctionId)

  if (error || !data) return []

  return data.map((a) => ({
    id: a.id,
    propertyName: a.property_name,
    propertyType: a.property_type,
    district: a.district,
    areaSqm: a.area_sqm,
    currentBidPrice: a.current_bid_price,
    coverImageUrl: a.images?.[0] ?? null,
  }))
}