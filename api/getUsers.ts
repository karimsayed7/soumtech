import { createAdminClient } from '@/lib/supabase/admin'

export interface UserRow {
  id: string
  full_name: string | null
  wallet_balance: number | null
  email: string | null
  phone: string | null
  created_at: string
  source: 'registered' | 'display'
}

interface GetUsersParams {
  page?: number
  pageSize?: number
  name?: string
}

interface GetUsersResult {
  users: UserRow[]
  totalCount: number
  totalPages: number
}

export async function getUsers({ page = 1, pageSize = 10, name }: GetUsersParams = {}): Promise<GetUsersResult> {
  const supabase = createAdminClient()

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('all_users_view')
    .select('id, full_name, wallet_balance, email, phone, created_at, source', { count: 'exact' })

  if (name?.trim()) {
    query = query.ilike('full_name', `%${name.trim()}%`)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(error.message)

  const totalCount = count ?? 0

  return {
    users: data ?? [],
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
  }
}