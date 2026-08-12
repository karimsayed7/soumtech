'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { WizardFormValues } from '@/schema/auctionWizard'

type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string }

async function getNextDealNumber(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from('auctions')
    .select('deal_number')
    .order('deal_number', { ascending: false })
    .limit(1)
    .single()

  return (data?.deal_number ?? 0) + 1
}

// ============ إنشاء مزاد جديد ============
export async function createAuction(
  companyId: string,
  name: string,
  city: string,
  bannerImage: File | null
): Promise<ActionResult<{ auctionId: string }>> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'غير مصرح لك بهذا الإجراء' }

  if (!name.trim()) return { success: false, error: 'اسم المزاد مطلوب' }
  if (!city.trim()) return { success: false, error: 'المدينة مطلوبة' }
  if (!bannerImage) return { success: false, error: 'صورة المزاد مطلوبة' }

  const ext = bannerImage.name.split('.').pop()
  const path = `${companyId}/${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('auction-banners')
    .upload(path, bannerImage)

  if (uploadError) {
    return { success: false, error: 'فشل رفع الصورة' }
  }

  const bannerImageUrl = supabase.storage.from('auction-banners').getPublicUrl(path).data.publicUrl

  const dealNumber = await getNextDealNumber(supabase)

  const { data: auction, error } = await supabase
    .from('auctions')
    .insert({
      company_id: companyId,
      name: name.trim(),
      city: city.trim(),
      banner_image: bannerImageUrl,
      deal_number: dealNumber,
      status: 'waiting_approval',
    })
    .select('id')
    .single()

  if (error || !auction) {
    return { success: false, error: 'حدث خطأ أثناء إنشاء المزاد' }
  }

  revalidatePath(`/userDashboard/myAuctions/${companyId}`)

  return { success: true, data: { auctionId: auction.id } }
}

// ============ حذف مزاد ============
export async function deleteAuction(
  companyId: string,
  auctionId: string
): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('auctions')
    .delete()
    .eq('id', auctionId)
    .eq('company_id', companyId)

  if (error) {
    return { success: false, error: 'تعذر حذف المزاد' }
  }

  revalidatePath(`/userDashboard/myAuctions/${companyId}`)
  return { success: true, data: null }
}

// ============ إضافة أصل لمزاد (من الـ Wizard) ============
export async function addAssetToAuction(
  companyId: string,
  auctionId: string,
  values: WizardFormValues,
  images: File[]
): Promise<ActionResult<{ assetId: string }>> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'غير مصرح لك بهذا الإجراء' }

  // رفع الصور أولًا
  let imageUrls: string[] = []

  if (images.length > 0) {
    const uploads = await Promise.all(
      images.map(async (file) => {
        const ext = file.name.split('.').pop()
        const path = `${auctionId}/${crypto.randomUUID()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('asset-images')
          .upload(path, file)

        if (uploadError) return null

        return supabase.storage.from('asset-images').getPublicUrl(path).data.publicUrl
      })
    )

    imageUrls = uploads.filter((url): url is string => url !== null)
  }

  // إدخال الأصل — الحقول اللي فعليًا موجودة في جدول assets
  const areaSqm = values.area_sqm
  const pricePerMeter = areaSqm > 0 ? values.opening_price / areaSqm : 0

  const { data: asset, error: assetError } = await supabase
    .from('assets')
    .insert({
      auction_id: auctionId,
      property_name: values.property_name,
      property_type: values.property_type,
      district: values.district,
      street: values.street,
      description: values.description,
      lat: values.lat,
      lng: values.lng,
      boundary_north: values.boundary_north,
      boundary_south: values.boundary_south,
      boundary_east: values.boundary_east,
      boundary_west: values.boundary_west,
      area_sqm: areaSqm,
      price_per_meter: pricePerMeter,
      deed_number: values.deed_number,
      opening_price: values.opening_price,
      current_bid_price: values.opening_price,
      bid_increment: values.bid_increment,
      entry_deposit: values.entry_deposit,
      images: imageUrls,
    })
    .select('id')
    .single()

  if (assetError || !asset) {
    console.error('assetError:', JSON.stringify(assetError, null, 2)) 
    return { success: false, error: 'فشل إضافة الأصل' }
  }

  // تحديث بيانات المزاد نفسه (المواعيد + العداد + الحالة)
  const { data: currentAuction } = await supabase
    .from('auctions')
    .select('assets_count')
    .eq('id', auctionId)
    .single()

  const { error: auctionUpdateError } = await supabase
    .from('auctions')
    .update({
      static_open_at: values.open_at,
      static_close_at: values.close_at,
      assets_count: (currentAuction?.assets_count ?? 0) + 1,
      status: 'waiting_approval',
    })
    .eq('id', auctionId)
    .eq('company_id', companyId)

  if (auctionUpdateError) {
    return { success: false, error: 'فشل تحديث بيانات المزاد' }
  }

  revalidatePath(`/userDashboard/myAuctions/${companyId}`)

  return { success: true, data: { assetId: asset.id } }
}