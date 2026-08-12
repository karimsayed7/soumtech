import 'server-only'
import { createClient } from '@supabase/supabase-js'

// ⚠️ الملف ده لازم يفضل Server-only. لو استوردته فى Client Component
// هيرمي error وقت البناء بفضل مكتبة "server-only"
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // لازم يكون فى .env.local بدون NEXT_PUBLIC_ prefix
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}