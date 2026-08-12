import { z } from 'zod'

export const messageSchema = z.object({
  message: z.string().min(3, 'الرسالة لازم تكون 3 أحرف على الأقل').max(500),
})

export type MessageFormValues = z.infer<typeof messageSchema>