// features/bidding-page/components/AssetStatsCard.tsx
import { formatCurrency } from '@/lib/utils'

interface Stat {
  label: string
  value: number
  withCurrency: boolean
}

interface AssetStatsCardProps {
  stats: Stat[]
}

export default function AssetStatsCard({ stats }: AssetStatsCardProps) {
  return (
    <div className='flex items-center my-5 rounded-lg py-3 border-2 border-gray-200'>
      {stats.map(({ label, value, withCurrency }, index) => (
        <div 
          key={label} 
          className={`flex-1 ${index < stats.length - 1 ? 'border-l-2 border-gray-100' : ''} flex flex-col items-center justify-center`}
        >
          <p className='text-lg font-bold text-[#171D5B]'>{label}</p>
          <p className='text-xl font-bold'>
            {formatCurrency(value)} {withCurrency && "ر.س"}
          </p>
        </div>
      ))}
    </div>
  )
}