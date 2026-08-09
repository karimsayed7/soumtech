// app/settings/page.tsx
import { getProfile } from '@/api/getProfile'
import Sittings from '@/features/settings/Sittings'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const profile = await getProfile()
  if (!profile) redirect('/SignIn')

  const { avatar_url, banner_url, ...formData } = profile

  return (
    <Sittings
      initialData={formData}
      initialAvatarUrl={avatar_url}
      initialBannerUrl={banner_url}
    />
  )
}