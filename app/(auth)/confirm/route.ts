// app/auth/confirm/route.ts
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
// import { confirmEmailToken } from '@/features/auth/services/confirm-email'
import { confirmEmailToken } from '@/features/auth/confirm-email'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const { error } = await confirmEmailToken(token_hash, type)
    if (!error) redirect(next)
  }

  redirect('/auth/error')
}