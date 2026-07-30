'use server'

import { createClient } from '@/lib/supabase/server'
import { resetPasswordSchema} from '@/schema/Auth'
import { redirect } from 'next/navigation'

export async function resetPasswordAction(values: { password: string; confirmPassword: string }) {
  const parsed = resetPasswordSchema.safeParse(values)
  if (!parsed.success) return { error: 'بيانات غير صحيحة' }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'انتهت صلاحية الرابط، اطلب رابط جديد' }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
  if (error) return { error: 'تعذر تحديث كلمة المرور، حاول مرة أخرى' }

  redirect('/')
}