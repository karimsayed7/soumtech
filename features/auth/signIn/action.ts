'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signInSchema} from '@/schema/Auth'

export async function signInAction(values: { email: string; password: string }) {
  const parsed = signInSchema.safeParse(values)
  if (!parsed.success) return { error: 'بيانات غير صحيحة' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) return { error: 'الإيميل أو كلمة المرور غلط' }
  redirect('/')
}

export async function adminDemoSignInAction() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: 'admin@gmail.com',
    password: '011500600',
  })

  if (error) return { error: 'تعذر تسجيل الدخول كأدمن تجريبي' }
  redirect('/')
}