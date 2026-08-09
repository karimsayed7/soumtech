// features/auction-assets/AuctionAssets.tsx
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAuctionById } from '@/api/getAuctions'
import AuctionAssetsPanner from './components/AuctionAssetsPanner'
import ReusableTable from '@/components/shared/Table/ReusableTable'
import { renderAssetCell } from '@/components/shared/Table/cells/asset-cells'
import AuctionAssetsTabs from './components/AuctionAssetsTabs'
import AssetCard from '@/components/shared/Asset/AssetCard'
import AuctionAssetsMap from './components/AuctionAssetsMap'
import DynamicBreadcrumb from '@/components/shared/DynamicBreadCrump'

const TABLE_HEADERS = [
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

const assetIds = assets?.map((a) => a.id) ?? []

let bidsCountMap = new Map<string, number>()
if (assetIds.length > 0) {
  const { data: bids } = await supabase
    .from('bidders')
    .select('asset_id')
    .in('asset_id', assetIds)

  bidsCountMap = (bids ?? []).reduce((map, bid) => {
  if (!bid.asset_id) return map
  map.set(bid.asset_id, (map.get(bid.asset_id) ?? 0) + 1)
  return map
}, new Map<string, number>())
}

const assetsWithBidsCount = (assets ?? []).map((asset) => ({
  ...asset,
  real_bids_count: bidsCountMap.get(asset.id) ?? 0,
}))

  if (!auction) notFound()

  return (
    <div className="mb-50">
      <DynamicBreadcrumb
        items={[
          {
            href: "/",
            label: "الرئيسية",
          },
          {
            href: "/auctions",
            label: "المزادات",
          },
          {
            href: ``,
            label: `${auction.name}`,
          }
        ]}
      />
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
          rows={assetsWithBidsCount}
          getRowKey={(asset) => asset.id}
          renderCell={(header, asset) => renderAssetCell(header, asset, auction)}
        />
      )}

      {shownAs === "cards" && 
        <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8">
          {
            assets?.map((asset, index) => (
              <div key={index} className='max-w-[450px]'>
                <AssetCard asset={asset} auction={auction}/>
              </div>
            ))
          }
        </div>
    }  
      {shownAs === "map" && (
        <>
          <AuctionAssetsMap assets={assets} auction={auction}/>
        </>
      )
      }
    </div>
  )
}