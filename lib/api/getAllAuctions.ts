import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { AuctionRow, AuctionsQueryParams, AuctionCounts, AuctionStatus } from '@/features/all auctions/types'

const PAGE_SIZE = 10

export async function getAllAuctions({ search, status, page = 1 }: AuctionsQueryParams) {
  const supabase = await createClient()

  let query = supabase
    .from('auctions_live') // بدل 'auctions' — عشان نجيب remaining_seconds في نفس الاستعلام
    .select(
      `id, name, city, status, assets_count, current_open_at, remaining_seconds,
       companies ( name )`,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })

  if (search?.trim()) {
    query = query.ilike('name', `%${search.trim()}%`)
  }
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) throw new Error(`Failed to fetch auctions: ${error.message}`)

  const rows: AuctionRow[] = (data ?? [])
  .filter((a): a is typeof a & { id: string; name: string; city: string } =>
    a.id !== null && a.name !== null && a.city !== null
  )
  .map((a) => ({
    id: a.id,
    name: a.name,
    city: a.city,
    status: a.status as AuctionStatus,
    assets_count: a.assets_count ?? 0,
    company_name: a.companies?.name ?? null,
    remaining_seconds: a.remaining_seconds,
    current_open_at: a.current_open_at
  }))

  return {
    rows,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
    currentPage: page,
  }
}

export async function getAuctionCounts(): Promise<AuctionCounts> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('auctions').select('status') // من الجدول الأصلي، مش من الـ view
  if (error) throw new Error(`Failed to fetch counts: ${error.message}`)

  return (data ?? []).reduce(
    (acc, { status }) => {
      acc.total += 1
      if (status in acc) acc[status as keyof AuctionCounts] += 1
      return acc
    },
    { total: 0, ongoing: 0, upcoming: 0, waiting_approval: 0, ended: 0 } as AuctionCounts
  )
}