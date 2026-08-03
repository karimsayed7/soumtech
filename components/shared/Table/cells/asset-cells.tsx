// features/auction-assets/asset-cells.tsx
import Image from 'next/image'
import Link from 'next/link'
import { AuctionStatusCard } from '@/components/shared/Auction/timer/AuctionStatusCard'
import { Button } from '@/components/ui/button'
import { formatOpenDateTime } from '@/lib/FormatComingDate'
import type { Database } from '@/lib/supabase/database.types'
import { ImageWithFallback } from '../../Imagewithfallback'
import type { AuctionListItem } from '@/api/getAuctions'

type Asset = Database['public']['Tables']['assets']['Row']

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function renderAssetCell(header: string, asset: Asset, auction: AuctionListItem) {
    const { date: openDate, time: openTime } = formatOpenDateTime(auction.current_open_at);
    
  switch (header) {
    case 'انضم للمزاد':
      return (
        <Button
          className="flex items-center gap-1 bg-blue-950 text-white cursor-pointer hover:bg-blue-950 rounded-lg px-3 py-2 w-fit"
        >
          <span>+</span>
          سجل في المزاد
        </Button>
      )
    case 'اسم العقار':
      return (
        <div className="flex items-center gap-2">
          {asset.images?.[0] && (
            <div className='w-9 h-9 relative rounded-full overflow-hidden border-2 border-gray-100'>
              {/* <Image src={asset.images[0]} alt={asset.property_name} fill className="object-cover" /> */}
              <ImageWithFallback src={asset.images[0]} alt={asset.property_name} fill className="object-cover" text='no img'/>
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold">{asset.property_name}</span>
            <span className="text-sm text-muted-foreground">{auction.city}</span>
          </div>
        </div>
      )
    case 'سعر السوم الحالي':
      return (
        <div className="flex flex-col">
          <span className="text-orange-600 text-[17px] font-extrabold">{formatCurrency(asset.current_bid_price)} ر.س</span>
          <span className="text-xs text-black">({formatCurrency(asset.price_per_meter)} ر.س) للمتر</span>
        </div>
      )
    case 'المساحة':
      return <span className="font-bold text-black">
                {asset.area_sqm} م<sup>2</sup>
            </span>
    case 'عربون الدخول':
      return <span className="font-bold text-black">{formatCurrency(asset.entry_deposit)} ر.س</span>
    case 'عدد السومات':
      return <span className='text-[17px]'>({asset.bids_count}) مزايد</span>
    case 'الموقت':
      return <AuctionStatusCard status={auction.status} remainingSeconds={auction.remaining_seconds} startDate={openDate} startTime={openTime} />
    case 'تفاصيل المزاد':
      return (
        <Link href={`/auctions/${auction.id}/assets/${asset.id}`} className="text-white transition hover:bg-yellow-600 bg-yellow-500 rounded-lg px-3 py-2 w-fit block text-center">
          تفاصيل المزاد
        </Link>
      )
    default:
      return null
  }
}