
import { z } from 'zod'

export const companySchema = z.object({
  name: z.string().trim().min(2, 'اسم الشركة لازم يكون حرفين على الأقل'),
  phone: z
    .string()
    .trim()
    .regex(/^05\d{8}$/, 'رقم الجوال لازم يكون بصيغة سعودية صحيحة (05xxxxxxxx)'),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح'),
  commercial_registry: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'رقم السجل التجاري لازم يكون 10 أرقام'),
})

export type CompanyFormValues = z.infer<typeof companySchema>