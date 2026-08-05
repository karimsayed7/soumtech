// features/bidding-page/components/AssetPricingCard.tsx
import { formatCurrency } from '@/lib/utils'

interface PricingDetail {
  label: string
  value: number
}

interface AssetPricingCardProps {
  currentPrice: number
  pricingDetails: PricingDetail[]
}

export default function AssetPricingCard({ 
  currentPrice, 
  pricingDetails 
}: AssetPricingCardProps) {
  return (
    <div className='p-3 border-y-2 border-gray-100 flex items-center justify-between'>
      <div className='flex-1'>
        <p className='text-[22px] text-[#171D5B] font-bold mb-4'>سعر السوم الحالى</p>
        <p className='text-[22px] text-yellow-600 font-bold'>
          {formatCurrency(currentPrice)} ر.س
        </p>
      </div>

      <div className="flex-1">
        {pricingDetails.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-lg">{label}</p>
            <p className="text-[#171D5B] font-bold text-lg">
              {formatCurrency(value)} ريال
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}