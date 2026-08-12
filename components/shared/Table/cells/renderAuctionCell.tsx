
import AuctionActionsMenu from '@/features/all auctions/components/AuctionActionsMenu'
import type { AuctionRow } from '@/features/all auctions/types'
import AuctionStatusBadge from '@/features/all auctions/components/AuctionStatusBadge'
import { AuctionStatusCard } from '@/components/shared/Auction/timer/AuctionStatusCard'
import { formatOpenDateTime } from '@/lib/FormatComingDate'

export function renderAuctionCell(header: string, auction: AuctionRow) {
  switch (header) {
    case 'اسم المزاد':
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-base">{auction.name}</span>
          <span className="text-sm text-muted-foreground">{auction.company_name} · {auction.city}</span>
        </div>
      )

    case 'عدد الاصول':
      return <span className="text-lg ">{auction.assets_count}</span>

    case 'الوقت المتبقي': {
      // AuctionStatusCard only understands ongoing | upcoming | ended —
      // it's the public-facing timer, not an admin state machine.
      if (auction.status === 'ongoing' || auction.status === 'upcoming' || auction.status === 'ended') {
        const { date, time } = formatOpenDateTime(auction.current_open_at) // adjust field to whatever your row exposes
        return (
          <div className='pl-10'>
            <AuctionStatusCard
              status={auction.status}
              remainingSeconds={auction.remaining_seconds}
              startDate={date}
              startTime={time}
              size="sm"
            />
          </div>
        )
      }
      return <span className="text-gray-400 text-sm">—</span>
    }

    case 'الحالة':
      return <AuctionStatusBadge status={auction.status} />

    case '':
      return <AuctionActionsMenu auction={auction} />

    default:
      return null
  }
}