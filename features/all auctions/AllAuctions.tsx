import { Suspense } from 'react'
import { Paginations } from '@/components/shared/Paginations';
import AuctionsTable from './components/AuctionsTable';
import AuctionsFilters from './components/AuctionsFilters';
import AuctionsBanner from './components/AuctionsBanner';
import { getAllAuctions, getAuctionCounts } from '@/lib/api/getAllAuctions';
import type { AuctionStatus } from './types'

interface Props {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>
}

export default async function AllAuctions({ searchParams }: Props) {
  const params = await searchParams
  const status = (params.status as AuctionStatus | 'all' | undefined) ?? 'all'
  const page = Number(params.page ?? 1)

  const [counts, { rows, totalPages, currentPage }] = await Promise.all([
    getAuctionCounts(),
    getAllAuctions({ search: params.search, status, page }),
  ])

  return (
    <div className="space-y-6">
      <AuctionsBanner counts={counts} />

      <div className="space-y-4">
        <AuctionsFilters defaultSearch={params.search} defaultStatus={status} />

        <Suspense fallback={<div className="py-10 text-center text-gray-400">جاري التحميل...</div>}>
          <AuctionsTable rows={rows} />
        </Suspense>
        <Paginations currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  )
}