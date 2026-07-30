import { Button } from '@/components/ui/button'
import { CircleUser } from 'lucide-react';
import Link from 'next/link';
import { HeaderProfile } from "@/lib/supabase/types";
import { signOutAction } from '@/features/auth/signOutAction';

interface ProfileSectionProps {
  isLoggedIn: boolean
  profile: HeaderProfile | null
}

export default function ProfileSection({ isLoggedIn, profile }: ProfileSectionProps) {
  if (!isLoggedIn) {
    return (
      <div className='flex items-start'>
        <CircleUser size={25} className='text-[#171D5B] md:text-white'/>
        <Link href={"/SignIn"}>
          <Button className="bg-white md:bg-[#171D5B] hover:cursor-pointer text-white hover:text-yellow-500 md:text-white text-[#171D5B]  md:hover:bg-[#171D5B] text-[17px]">تسجيل الدخول</Button>
        </Link>
      </div>
    )
  }

  const firstLetter = profile?.full_name?.trim()?.charAt(0)?.toUpperCase() || '؟'

  return (
    <div className='flex items-center gap-4'>
      <div className='w-9 h-9 rounded-full bg-yellow-500 text-[#171D5B] flex items-center justify-center font-bold text-[20px]'>
        {firstLetter}
      </div>
      <div className='text-[18px] md:text-base'>
        <p className='text-yellow-500 font-semibold'>مرحبا</p>
        <p>{profile?.full_name}</p>
      </div>

      <form action={signOutAction}>
        <Button type="submit" variant="ghost" className="text-white hover:text-yellow-500 hover:bg-transparent hover:cursor-pointer">
          تسجيل الخروج
        </Button>
      </form>
    </div>
  )
}