// features/bidding-page/components/BidSection.tsx
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Plus, Minus, Dot } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface BidSectionProps {
  currentPrice: number
}

export default function BidSection({ currentPrice }: BidSectionProps) {
  return (
    <div className='p-4 rounded-xl bg-gray-50'>
      <div className='flex items-center mb-5 gap-5 pb-4 border-b-2 border-dashed border-gray-200'>
        <div className='text-[24px] bg-white rounded-md flex-1 font-extrabold shadow-[0_0_8px_rgba(0,0,0,0.12)] flex items-center px-3 py-2 justify-between'>
          <Plus className='cursor-pointer' />
          <p className='text-yellow-600'>{formatCurrency(currentPrice)}</p>
          <Minus className='cursor-pointer' />
        </div>

        <Button className="text-white bg-[#171D5B] flex-1 h-13 cursor-pointer hover:bg-[#171D5B] rounded-md text-2xl flex items-center gap-3">
          <Image 
            src={"/assets/soums white.svg"} 
            alt='soums logo' 
            width={20} 
            height={20} 
            className='-mt-1'
          />
          <p>اضف سومتك</p>
        </Button>
      </div>

      <div>
        <div className='flex items-center gap-1 mb-2'>
          <Dot />
          <p>بالضغط على زر أضف سومتك ,فانك توافق على الشروط وأحكام المزاد</p>
        </div>
        <div className='flex items-center gap-1 mb-2'>
          <Dot />
          <p>السعر الإجمالي لا يشمل ضريبة التصرفات العقارية ويتحملها المشترى</p>
        </div>
      </div>
    </div>
  )
}