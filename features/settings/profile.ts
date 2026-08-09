'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { profileSchema, type ProfileFormValues } from '@/schema/profile'

export type ActionResult = { success: true } | { success: false; error: string }

export async function updateProfile(values: ProfileFormValues): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة' }
  }

  const supabase = await createClient()
  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData.user) {
    return { success: false, error: 'لازم تسجل الدخول الأول' }
  }

  const { full_name, email, phone, birth_date } = parsed.data

  // البريد لوحده لأنه مخزن في نظام الـauth مش في profiles
  if (email !== userData.user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email })
    if (emailError) {
      return { success: false, error: emailError.message }
    }
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ full_name, phone, birth_date })
    .eq('id', userData.user.id)

  if (profileError) {
    return { success: false, error: profileError.message }
  }

  revalidatePath('/settings')
  return { success: true }
}

export async function uploadProfileImage(
  file: File,
  kind: 'avatar' | 'banner'
): Promise<ActionResult & { url?: string }> {
  const supabase = await createClient()
  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData.user) {
    return { success: false, error: 'لازم تسجل الدخول الأول' }
  }

  // Edge case: نوع الملف والحجم
  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'الملف لازم يكون صورة' }
  }
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'حجم الصورة لازم يكون أقل من 5 ميجا' }
  }

  const extension = file.name.split('.').pop() ?? 'png'
  const path = `${userData.user.id}/${kind}.${extension}?v=${Date.now()}`

  const { error: uploadError } = await supabase.storage
    .from('profile-media')
    .upload(path, file, { upsert: true })

  if (uploadError) {
    return { success: false, error: uploadError.message }
  }

  const { data: publicUrlData } = supabase.storage.from('profile-media').getPublicUrl(path)
  const column = kind === 'avatar' ? 'avatar_url' : 'banner_url'

  const { error: updateError } = await supabase
  .from('profiles')
  .update(
    kind === 'avatar'
      ? { avatar_url: publicUrlData.publicUrl }
      : { banner_url: publicUrlData.publicUrl }
  )
  .eq('id', userData.user.id)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  revalidatePath('/settings')
  return { success: true, url: publicUrlData.publicUrl }
}