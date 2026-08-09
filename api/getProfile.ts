import { createClient } from '@/lib/supabase/server'

export async function getProfile() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, birth_date, avatar_url, banner_url')
    .eq('id', userData.user.id)
    .single()

  return {
    full_name: profile?.full_name ?? '',
    email: userData.user.email ?? '',
    phone: profile?.phone ?? '',
    birth_date: profile?.birth_date ?? '',
    avatar_url: profile?.avatar_url ?? null,
    banner_url: profile?.banner_url ?? null,
  }
}