'use server'

import { createClient } from '@/lib/supabase/server'
import { forgetPasswordSchema} from '@/schema/Auth'

export async function forgetPasswordAction(values: { email: string }) {
  const parsed = forgetPasswordSchema.safeParse(values)
  if (!parsed.success) return { error: 'بيانات غير صحيحة' }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=/ResetPassword`,
  })

  if (error) return { error: 'حدث خطأ، حاول مرة أخرى' }
  return { success: true }
}