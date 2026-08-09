import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'
import { formatCurrency } from '@/lib/utils'
import type { BidderRow } from '@/api/getAssetBidders'

export const BIDDERS_TABLE_HEADERS = ['الاسم', 'سعر السوم', 'الوقت']

export function renderBidderCell(header: string, bid: BidderRow) {
  switch (header) {
    case 'الاسم':
      return <span className="font-bold">{bid.bidder_name} - {bid.bidder_code}</span>
    case 'سعر السوم':
      return <span className="font-extrabold">{formatCurrency(bid.bid_amount)} ريال</span>
    case 'الوقت':
      return <span className="text-sm">{formatDistanceToNow(new Date(bid.bid_at), { locale: ar, addSuffix: true })}</span>
    default:
      return null
  }
}