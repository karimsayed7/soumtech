import { z } from 'zod'

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, 'الاسم لازم يكون حرفين على الأقل'),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح'),
  phone: z
    .string()
    .trim()
    .regex(/^05\d{8}$/, 'رقم الجوال لازم يكون بصيغة سعودية صحيحة (05xxxxxxxx)'),
  birth_date: z
    .string()
    .min(1, 'تاريخ الميلاد مطلوب')
    .refine((val) => new Date(val) < new Date(), 'تاريخ الميلاد غير صحيح'),
})

export type ProfileFormValues = z.infer<typeof profileSchema>