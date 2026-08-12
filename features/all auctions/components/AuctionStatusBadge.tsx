import { AUCTION_STATUS_LABELS, type AuctionStatus } from '../types'

const STYLES: Record<AuctionStatus, string> = {
  ongoing: 'bg-green-50 text-green-700 border-green-200',
  upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  waiting_approval: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  ended: 'bg-gray-100 text-gray-500 border-gray-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
}

export default function AuctionStatusBadge({ status }: { status: AuctionStatus }) {
  return (
    <span className={`text-base font-semibold px-3  py-1 rounded-full border w-fit ${STYLES[status]}`}>
      {AUCTION_STATUS_LABELS[status]}
    </span>
  )
}