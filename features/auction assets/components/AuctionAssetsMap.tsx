"use client"

import { useMemo, useState } from 'react'
import type { AuctionListItem } from '@/api/getAuctions'
import type { Database } from '@/lib/supabase/database.types'
import AssetCard from '@/components/shared/Asset/AssetCard'
import AssetDetails from '@/components/shared/Asset/AssetDetails'
import MapPage from '@/components/shared/map/MapPage'

interface AssetCardProps {
    assets: Database['public']['Tables']['assets']['Row'][] | null
    auction: AuctionListItem
}

type Asset = Database['public']['Tables']['assets']['Row']

export default function AuctionAssetsMap({ assets, auction }: AssetCardProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(assets?.[0] ?? null)


  return (
   <div className="flex flex-col gap-5 md:flex-row">
      <div className="order-2 w-full md:order-1 md:flex-[2]">
        <MapPage
          assets={assets}
          selectedAsset={selectedAsset}
          onSelectAsset={setSelectedAsset}
        />
      </div>

      <div className='flex-1 shadow-lg border-2 rounded-lg md:order-1 order-2 pb-3'>
        {selectedAsset && (
          <AssetCard
            asset={selectedAsset}
            auction={auction}
            shadow={false}
          />
        )}
        {selectedAsset && (
          <AssetDetails
            asset={selectedAsset}
            auction={auction}
          />
        )}
      </div>
    </div>
  )
}