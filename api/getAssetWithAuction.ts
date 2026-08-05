import { createClient } from '@/lib/supabase/server'
import { AssetWithAuction } from '@/lib/supabase/types'

export async function getAssetWithAuction(
  assetId: string
): Promise<AssetWithAuction | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('assets')
    .select(`*, auction:auctions_live(*)`)
    .eq('id', assetId)
    .single()
    .returns<AssetWithAuction>()

  if (error) {
    console.error('getAssetWithAuction error:', error)
    return null
  }

  return data
}