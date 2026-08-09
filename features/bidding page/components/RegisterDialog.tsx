'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { registerForAsset } from '../bidding'

interface RegisterDialogProps {
  assetId: string
  propertyName: string
  entryDeposit: number
  walletBalance: number
  auctionStatus: 'upcoming' | 'ongoing' | 'ended'
  initiallyRegistered: boolean
  isLoggedIn: boolean
}

export default function RegisterDialog({
  assetId,
  propertyName,
  entryDeposit,
  walletBalance,
  auctionStatus,
  initiallyRegistered,
  isLoggedIn,
}: RegisterDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registered, setRegistered] = useState(initiallyRegistered)

  if (auctionStatus === 'ended') {
    return (
      <span className="text-sm text-gray-400 bg-gray-100 rounded-lg px-3 py-2 w-fit block">
        انتهى المزاد
      </span>
    )
  }

  if (registered) {
    return (
      <span className="flex items-center gap-2 bg-green-600 text-white rounded-lg px-3 py-2 w-fit">
        <Check className="w-5 h-5" />
        تم التسجيل
      </span>
    )
  }

  const insufficientBalance = walletBalance < entryDeposit
  const remainingAfter = walletBalance - entryDeposit

  async function handleConfirm() {
    setLoading(true)
    setError(null)

    const result = await registerForAsset(assetId)

    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    setRegistered(true)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="flex items-center gap-1 bg-blue-950 text-white cursor-pointer hover:bg-blue-950 rounded-lg px-3 py-3 w-fit">
          <span>+</span>
          سجل في المزاد
        </Button>
      </DialogTrigger>

      <DialogContent>
        {!isLoggedIn ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg">سجل دخول أولا</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <p className="text-lg text-muted-foreground">
                 للتسجيل في المزاد والمساومة على <span className="font-bold text-black">{propertyName}</span>،
                لازم يكون عندك حساب مسجل دخول فيه في المنصة أولاً.
              </p>
              <Link href="/SignIn" className="w-full">
                <Button className="w-full bg-blue-950 cursor-pointer text-lg hover:bg-blue-950 text-white rounded-lg py-3">
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>تأكيد التسجيل في المزاد</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <p className="text-base text-muted-foreground">
                أنت على وشك التسجيل للمزايدة على <span className="font-bold text-black">{propertyName}</span>.
                سيتم خصم عربون الدخول من رصيد محفظتك فورًا، وهو مبلغ مسترد في حال عدم فوزك بالمزاد
                بحسب شروط وأحكام المنصة.
              </p>

              <div className="flex justify-between text-base bg-gray-50 rounded-lg p-3">
                <span className="text-muted-foreground">عربون الدخول</span>
                <span className="font-bold text-orange-600">{formatCurrency(entryDeposit)} ر.س</span>
              </div>

              <div className="flex justify-between text-base bg-gray-50 rounded-lg p-3">
                <span className="text-muted-foreground">رصيد محفظتك الحالي</span>
                <span className="font-bold">{formatCurrency(walletBalance)} ر.س</span>
              </div>

              <div className="flex justify-between text-base bg-gray-50 rounded-lg p-3">
                <span className="text-muted-foreground">رصيدك بعد التسجيل</span>
                <span className={`font-bold ${insufficientBalance ? 'text-red-600' : ''}`}>
                  {formatCurrency(Math.max(remainingAfter, 0))} ر.س
                </span>
              </div>

              {insufficientBalance && (
                <p className="text-red-600 text-base">
                  رصيد محفظتك لا يكفي لدفع عربون الدخول، الرجاء شحن المحفظة أولاً
                </p>
              )}
              {error && <p className="text-red-600 text-base">{error}</p>}

              <Button
                onClick={handleConfirm}
                disabled={insufficientBalance || loading}
                className="bg-blue-950 hover:bg-blue-950 text-white rounded-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-lg"
              >
                {loading ? 'جاري التسجيل...' : 'تأكيد التسجيل'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}