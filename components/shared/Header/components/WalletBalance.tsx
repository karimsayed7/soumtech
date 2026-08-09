import { Wallet } from "lucide-react";
import { HeaderProfile } from "@/lib/supabase/types";

interface WalletBalanceProps {
  profile: HeaderProfile | null;
  isLoggedIn: boolean;
  iconClassName?: string;
}
function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(value)
}

export default function WalletBalance({
  profile,
  isLoggedIn,
  iconClassName = "text-[#171D5B] md:text-white",
}: WalletBalanceProps) {
  return (
    <div>
      {isLoggedIn && (
        <div>
          <div className="flex items-start gap-3">
            <Wallet size={19} className={iconClassName} />
            <p className="text-[20px] md:text-[18px]">رصيد المحفظة</p>
          </div>

          <div className="flex items-center gap-2 text-[18px]">
            <p className="text-yellow-500">{formatCurrency(profile?.wallet_balance ?? 0)}</p>
            <p>ر.س</p>
          </div>
        </div>
      )}
    </div>
  );
}