// features/auction-assets/AuctionAssets.tsx
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAuctionById } from '@/api/getAuctions'
import AuctionAssetsPanner from './components/AuctionAssetsPanner'
import ReusableTable from '@/components/shared/Table/ReusableTable'
import { renderAssetCell } from '@/components/shared/Table/cells/asset-cells'
import AuctionAssetsTabs from './components/AuctionAssetsTabs'
import AssetCard from '@/components/shared/AssetCard'

const TABLE_HEADERS = [
  'انضم للمزاد',
  'اسم العقار',
  'سعر السوم الحالي',
  'المساحة',
  'عربون الدخول',
  'عدد السومات',
  'الموقت',
  'تفاصيل المزاد',
]

export default async function AuctionAssets({
  auctionId,
  shownAs,
}: {
  auctionId: string
  shownAs?: string
}) {
  const supabase = await createClient()

  let auction
  try {
    auction = await getAuctionById(auctionId)
  } catch {
    notFound()
  }

  const { data: assets } = await supabase
    .from('assets')
    .select('*')
    .eq('auction_id', auctionId)

  if (!auction) notFound()

  return (
    <div className="mb-20">
      <AuctionAssetsPanner
        auctionName={auction.name}
        assetsCount={assets?.length ?? auction.assets_count}
      />

      <Suspense fallback={null}>
        <AuctionAssetsTabs />
      </Suspense>

      {shownAs === "table" && (
        <ReusableTable
          th={TABLE_HEADERS}
          rows={assets ?? []}
          getRowKey={(asset) => asset.id}
          renderCell={(header, asset) => renderAssetCell(header, asset, auction)}
        />
      )}

      {shownAs === "cards" && 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {
            assets?.map((asset, index) => (
              <div key={index}>
                <AssetCard asset={asset} auction={auction}/>
              </div>
            ))
          }
        </div>
    }  
      {shownAs === "map" && <p>map</p>}
    </div>
  )
}