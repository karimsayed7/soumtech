import { z } from 'zod'

export const step1Schema = z.object({
  property_name: z.string().trim().min(2, 'اسم الأصل مطلوب'),
  district: z.string().trim().min(2, 'الحي مطلوب'),
  city: z.string().trim().min(2, 'المدينة مطلوبة'),
  street: z.string().trim().min(2, 'اسم الشارع مطلوب'),
  property_type: z.string().trim().min(2, 'نوع العقار مطلوب'),
  description: z.string().trim().min(5, 'وصف العقار مطلوب'),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
})

export const step2Schema = z.object({
  boundary_north: z.string().trim().min(1, 'مطلوب'),
  boundary_south: z.string().trim().min(1, 'مطلوب'),
  boundary_east: z.string().trim().min(1, 'مطلوب'),
  boundary_west: z.string().trim().min(1, 'مطلوب'),
  area_sqm: z.coerce.number().positive('المساحة يجب أن تكون أكبر من صفر'),
  deed_number: z.string().trim().min(1, 'رقم الصك مطلوب'),
})

export const step3Schema = z
  .object({
    open_at: z.string().min(1, 'موعد بداية المزاد مطلوب'),
    close_at: z.string().min(1, 'موعد نهاية المزاد مطلوب'),
    opening_price: z.coerce.number().positive('سعر الافتتاح يجب أن يكون أكبر من صفر'),
    bid_increment: z.coerce.number().positive('فرق السوم يجب أن يكون أكبر من صفر'),
    entry_deposit: z.coerce.number().positive('العربون يجب أن يكون أكبر من صفر'),
  })
  .refine((data) => new Date(data.close_at) > new Date(data.open_at), {
    message: 'موعد النهاية يجب أن يكون بعد موعد البداية',
    path: ['close_at'],
  })

export const fullWizardSchema = step1Schema.and(step2Schema).and(step3Schema)
export type WizardFormValues = z.infer<typeof fullWizardSchema>