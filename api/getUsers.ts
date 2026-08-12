// import { createAdminClient } from '@/lib/supabase/admin'
import { createAdminClient } from "@/lib/supabase/admin"

export interface UserRow {
  id: string
  full_name: string | null
  wallet_balance: number
  email: string | null
  phone: string | null
  created_at: string
}

export async function getUsers(): Promise<UserRow[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('users_view')
    .select('id, full_name, wallet_balance, email, phone, created_at')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return data ?? []
}