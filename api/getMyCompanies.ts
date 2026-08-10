
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/lib/supabase/database.types'

export async function getMyCompanies(): Promise<Tables<'companies'>[]> {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return []

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', userData.user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}