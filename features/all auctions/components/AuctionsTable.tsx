import ReusableTable from '@/components/shared/Table/ReusableTable'
// import { renderAuctionCell } from './renderAuctionCell'
import { renderAuctionCell } from '@/components/shared/Table/cells/renderAuctionCell'
import type { AuctionRow } from '../types'

const HEADERS = ['اسم المزاد', 'عدد الاصول', 'الوقت المتبقي', 'الحالة', '']

export default function AuctionsTable({ rows }: { rows: AuctionRow[] }) {
  if (rows.length === 0) {
    return <div className="py-16 text-center text-gray-400">لا توجد مزادات مطابقة</div>
  }

  return (
    <ReusableTable
      th={HEADERS}
      rows={rows}
      getRowKey={(row) => row.id}
      renderCell={renderAuctionCell}
    />
  )
}