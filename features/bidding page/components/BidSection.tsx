// features/bidding-page/components/BidSection.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { placeBid } from '../bidding'


interface BidSectionProps {
  assetId: string
  currentPrice: number
  bidIncrement: number
  auctionStatus: 'upcoming' | 'ongoing' | 'ended'
  isRegistered: boolean
  walletBalance: number
}

export default function BidSection({
  assetId,
  currentPrice,
  bidIncrement,
  auctionStatus,
  isRegistered,
  walletBalance,
}: BidSectionProps) {
  const [bidAmount, setBidAmount] = useState(currentPrice + bidIncrement)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [price, setPrice] = useState(currentPrice)

  // Edge cases: مفيش داعي نعرض زرار المساومة أصلًا في الحالات دي
  if (auctionStatus === 'ended') {
    return (
      <div className="p-4 rounded-xl bg-gray-50 text-center text-gray-500">
        انتهى هذا المزاد ولا يمكن المساومة عليه
      </div>
    )
  }

  if (auctionStatus === 'upcoming') {
    return (
      <div className="p-4 rounded-xl bg-gray-50 text-center text-gray-500">
        المزاد لم يبدأ بعد، سجل الآن وستتمكن من المساومة عند بدء المزاد
      </div>
    )
  }

  if (!isRegistered) {
    return (
      <div className="p-4 rounded-xl bg-gray-50 text-center text-gray-500">
        يجب التسجيل في المزاد أولاً قبل المساومة
      </div>
    )
  }

  const minBid = price + bidIncrement
  const insufficientBalance = bidAmount > walletBalance

  function increment() {
    setBidAmount((prev) => prev + bidIncrement)
  }

  function decrement() {
    setBidAmount((prev) => Math.max(prev - bidIncrement, minBid))
  }

  async function handleBid() {
    if (bidAmount < minBid || insufficientBalance) return
    setLoading(true)
    setError(null)

    const result = await placeBid(assetId, bidAmount)

    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    setPrice(bidAmount)
    setBidAmount(bidAmount + bidIncrement)
  }

  return (
    <div className='p-4 rounded-xl bg-gray-50'>
      <div className='flex items-center mb-5 gap-5 pb-4 border-b-2 border-dashed border-gray-200'>
        <div className='text-[23px] bg-white rounded-md flex-1 font-extrabold shadow-[0_0_8px_rgba(0,0,0,0.12)] flex items-center px-3 py-2 justify-between'>
          <button onClick={increment} type="button" className="cursor-pointer text-2xl leading-none">+</button>
          <p className='text-yellow-600'>{formatCurrency(bidAmount)}</p>
          <button onClick={decrement} type="button" className="cursor-pointer text-2xl leading-none">-</button>
        </div>

        <Button
          onClick={handleBid}
          disabled={loading || insufficientBalance || bidAmount < minBid}
          className="text-white bg-[#171D5B] flex-1 h-13 cursor-pointer hover:bg-[#171D5B] rounded-md text-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image src="/assets/soums white.svg" alt="soums logo" width={20} height={20} className="-mt-1" />
          <p>{loading ? 'جاري الإرسال...' : 'اضف سومتك'}</p>
        </Button>
      </div>

      {insufficientBalance && (
        <p className="text-red-600 text-sm mb-2">رصيد محفظتك لا يكفي لتقديم هذا السوم</p>
      )}
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <div>
        <div className='flex items-center gap-1 mb-2'>
          <span className="w-1 h-1 rounded-full bg-black inline-block" />
          <p>بالضغط على زر أضف سومتك ,فانك توافق على الشروط وأحكام المزاد</p>
        </div>
        <div className='flex items-center gap-1 mb-2'>
          <span className="w-1 h-1 rounded-full bg-black inline-block" />
          <p>السعر الإجمالي لا يشمل ضريبة التصرفات العقارية ويتحملها المشترى</p>
        </div>
      </div>
    </div>
  )
}