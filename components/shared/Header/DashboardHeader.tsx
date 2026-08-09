import React from 'react'
import { createClient } from '@/lib/supabase/server'
import WalletBalance from './components/WalletBalance'
import ProfileSection from './components/ProfileSection'

export default async function DashboardHeader() {
  const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
  
    let profile = null
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, wallet_balance, role')
        .eq('id', user.id)
        .single()
      profile = data
    }
  
    const isLoggedIn = !!user
    const isAdmin = profile?.role === 'admin'

    
  return (
    <div className='flex items-center justify-between text-[#171D5B] py-4 border-b-2 border-gray-100'>
        <WalletBalance profile={profile} isLoggedIn={isLoggedIn} iconClassName="text-[#171D5B]"/>
        <ProfileSection isLoggedIn={isLoggedIn} profile={profile} />
    </div>
  )
}
