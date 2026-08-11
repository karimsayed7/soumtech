import { createClient } from '@/lib/supabase/server'

export async function getAuctionsByCompany(companyId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('auctions')
    .select('id, name, city, status, banner_image, assets_count')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map((auction) => ({
    id: auction.id,
    name: auction.name,
    city: auction.city,
    status: auction.status,
    bannerImage: auction.banner_image,
    assetsCount: auction.assets_count,
  }))
}