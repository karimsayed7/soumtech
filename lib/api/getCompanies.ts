import { createClient } from '@/lib/supabase/server'

export interface CompanyRow {
  id: string
  name: string
  owner_name: string | null
  phone: string | null
  email: string | null
  commercial_registry: string | null
}

export async function getCompanies(): Promise<CompanyRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('companies')
    .select(`
      id,
      name,
      phone,
      email,
      commercial_registry,
      owner:profiles!companies_owner_id_fkey ( full_name )
    `)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    owner_name: (c.owner as { full_name: string | null } | null)?.full_name ?? null,
    phone: c.phone,
    email: c.email,
    commercial_registry: c.commercial_registry,
  }))
}