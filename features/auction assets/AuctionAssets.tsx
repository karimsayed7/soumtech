// features/auction-assets/AuctionAssets.tsx
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAuctionById } from '@/lib/api/getAuctions'
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
  const { data: userData } = await supabase.auth.getUser()
  const currentUserId = userData.user?.id ?? null

  let bidsCountMap = new Map<string, number>()
  let topBidderMap = new Map<string, { bidder_id: string; bidder_type: string }>()
  let registeredSet = new Set<string>()

  if (assetIds.length > 0) {
    const [{ data: bids }, { data: registrations }] = await Promise.all([
      supabase
        .from('bidders')
        .select('asset_id, bidder_id, bidder_type, bid_amount')
        .in('asset_id', assetIds)
        .order('bid_amount', { ascending: false }),
      currentUserId
        ? supabase.from('registrations').select('asset_id').eq('user_id', currentUserId).in('asset_id', assetIds)
        : Promise.resolve({ data: [] as { asset_id: string }[] }),
    ])

    bidsCountMap = (bids ?? []).reduce((map, bid) => {
      if (!bid.asset_id) return map
      map.set(bid.asset_id, (map.get(bid.asset_id) ?? 0) + 1)
      return map
    }, new Map<string, number>())

    topBidderMap = (bids ?? []).reduce((map, bid) => {
      if (!bid.asset_id || !bid.bidder_id || map.has(bid.asset_id)) return map
      map.set(bid.asset_id, { bidder_id: bid.bidder_id, bidder_type: bid.bidder_type })
      return map
    }, new Map<string, { bidder_id: string; bidder_type: string }>())

    registeredSet = new Set((registrations ?? []).map((r) => r.asset_id))
  }

  const assetsWithExtras = (assets ?? []).map((asset) => {
    const topBidder = topBidderMap.get(asset.id)
    return {
      ...asset,
      real_bids_count: bidsCountMap.get(asset.id) ?? 0,
      is_registered: registeredSet.has(asset.id),
      is_top_bidder: !!currentUserId && topBidder?.bidder_type === 'real' && topBidder?.bidder_id === currentUserId,
    }
  })

  if (!auction) notFound()

  return (
    <div className="mb-50">
      <DynamicBreadcrumb
        items={[
          { href: "/", label: "الرئيسية" },
          { href: "/auctions", label: "المزادات" },
          { href: ``, label: `${auction.name}` }
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
          rows={assetsWithExtras}
          getRowKey={(asset) => asset.id}
          renderCell={(header, asset) => renderAssetCell(header, asset, auction)}
        />
      )}

      {shownAs === "cards" &&
        <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,420px))] gap-8">
          {assetsWithExtras.map((asset) => (
            <div key={asset.id}>
              <AssetCard asset={asset} auction={auction} />
            </div>
          ))}
        </div>
      }

      {shownAs === "map" && (
        <AuctionAssetsMap assets={assets} auction={auction} />
      )}
    </div>
  )
}