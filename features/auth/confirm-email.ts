
import { type EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

export async function confirmEmailToken(token_hash: string, type: EmailOtpType) {
  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({ type, token_hash })
  return { error }
}