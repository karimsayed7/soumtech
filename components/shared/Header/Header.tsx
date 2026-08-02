import ProfileSection from './components/ProfileSection'
import Logo from './components/Logo'
import NavLinks from './components/NavLinks'
import WalletBalance from './components/WalletBalance'
// import MobileNav from './components/MobileNav'
import MobileNav from './components/MobileNav'
import { createClient } from '@/lib/supabase/server'

export default async function Header() {
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
    <div className='py-3 pb-8 pt-6 md:pt-3 md:pb-3 text-[#171D5B] md:text-white bg-white md:bg-[#171D5B] flex items-center justify-between px-4 md:px-10 max-w-325 mx-auto'>
      <div className='flex items-center gap-4 md:gap-7'>
        <Logo />
        <div className='hidden md:block'>
          <WalletBalance profile={profile} isLoggedIn={isLoggedIn} />
        </div>
      </div>

      {/* Desktop nav — مختفي تحت md */}
      <div className='hidden md:flex'>
        <NavLinks isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      </div>

      <div className='hidden md:flex'>
        <ProfileSection isLoggedIn={isLoggedIn} profile={profile} />
      </div>

      {/* Mobile: همبرجر بس، شايل كل حاجة جواه */}
      <div className='md:hidden'>
        <MobileNav
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          profile={profile}
        />
      </div>
    </div>
  )
}