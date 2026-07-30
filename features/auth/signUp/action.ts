'use server'

import { createClient } from '@/lib/supabase/server'
import { signUpSchema} from '@/schema/Auth'

export async function signUpAction(values: {
  name: string
  phone: string
  email: string
  password: string
}) {
  const parsed = signUpSchema.safeParse(values)
  if (!parsed.success) return { error: 'بيانات غير صحيحة' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.name,
        phone: parsed.data.phone,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  })

  if (error) {
    return { error: error.message === 'User already registered' ? 'الإيميل مسجل بالفعل' : 'حدث خطأ، حاول مرة أخرى' }
  }

  return { success: true } 
}