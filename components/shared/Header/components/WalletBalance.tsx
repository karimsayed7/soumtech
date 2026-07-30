import { Wallet } from 'lucide-react';
import { HeaderProfile } from "@/lib/supabase/types";

interface WalletBalanceProps {
  profile: HeaderProfile | null;
  isLoggedIn: boolean;
}

export default function WalletBalance({profile, isLoggedIn} : WalletBalanceProps) {
  return (
    <div>
      {
        isLoggedIn &&
        <div>
          <div className="flex items-start gap-3">
            <Wallet size={19} className='text-[#171D5B] md:text-white'/>
            <p className='text-[20px] md:text-[18px]'>رصيد المحفظة</p>
          </div>
          <div className="flex items-center gap-2 text-[18px]">
            <p className='text-yellow-500 '>{profile?.wallet_balance}</p>
            <p>ر.س</p>
          </div>
        </div>
      }
    </div>
  )
}
