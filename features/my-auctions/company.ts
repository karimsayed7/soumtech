'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { companySchema, type CompanyFormValues } from '@/schema/company'

export type ActionResult = { success: true; companyId?: string } | { success: false; error: string }

async function uploadLogoIfProvided(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  logoFile: File | null
): Promise<string | null> {
  if (!logoFile || logoFile.size === 0) return null

  if (!logoFile.type.startsWith('image/')) {
    throw new Error('شعار الشركة لازم يكون صورة')
  }
  if (logoFile.size > 5 * 1024 * 1024) {
    throw new Error('حجم الصورة لازم يكون أقل من 5 ميجا')
  }

  const extension = logoFile.name.split('.').pop() ?? 'png'
  const path = `${userId}/${Date.now()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from('company-logos')
    .upload(path, logoFile, { upsert: true })

  if (uploadError) throw new Error(uploadError.message)

  const { data } = supabase.storage.from('company-logos').getPublicUrl(path)
  return data.publicUrl
}

export async function createCompany(values: CompanyFormValues, logoFile: File | null): Promise<ActionResult> {
  const parsed = companySchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة' }
  }

  const supabase = await createClient()
  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData.user) {
    return { success: false, error: 'لازم تسجل الدخول الأول' }
  }

  try {
    const logoUrl = await uploadLogoIfProvided(supabase, userData.user.id, logoFile)

    const { data: company, error } = await supabase
      .from('companies')
      .insert({ ...parsed.data, owner_id: userData.user.id, logo_url: logoUrl })
      .select('id')
      .single()

    if (error) return { success: false, error: error.message }

    revalidatePath('/my-companies')
    return { success: true, companyId: company.id }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'حدث خطأ غير متوقع' }
  }
}

export async function updateCompany(
  companyId: string,
  values: CompanyFormValues,
  logoFile: File | null
): Promise<ActionResult> {
  const parsed = companySchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة' }
  }

  const supabase = await createClient()
  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData.user) {
    return { success: false, error: 'لازم تسجل الدخول الأول' }
  }

  try {
    const logoUrl = await uploadLogoIfProvided(supabase, userData.user.id, logoFile)

    const { error } = await supabase
      .from('companies')
      .update({ ...parsed.data, ...(logoUrl ? { logo_url: logoUrl } : {}) })
      .eq('id', companyId)
      .eq('owner_id', userData.user.id) 

    if (error) return { success: false, error: error.message }

    revalidatePath('/my-companies')
    revalidatePath(`/my-companies/${companyId}`)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'حدث خطأ غير متوقع' }
  }
}

export async function deleteCompany(companyId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData.user) {
    return { success: false, error: 'لازم تسجل الدخول الأول' }
  }

  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', companyId)
    .eq('owner_id', userData.user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/my-companies')
  return { success: true }
}