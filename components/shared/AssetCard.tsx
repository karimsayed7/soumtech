import React from 'react'
import Link from 'next/link'
import { AuctionStatusCard } from '@/components/shared/Auction/timer/AuctionStatusCard'
import { Button } from '@/components/ui/button'
import { formatOpenDateTime } from '@/lib/FormatComingDate'
import { ImageWithFallback } from './Imagewithfallback'
import type { Database } from '@/lib/supabase/database.types'
import type { AuctionListItem } from '@/api/getAuctions'
import { MapPin } from 'lucide-react';
import Image from 'next/image'

interface AssetCardProps {
    asset : Database['public']['Tables']['assets']['Row']
    auction : AuctionListItem
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function AssetCard({asset, auction} : AssetCardProps) {
    const { date: openDate, time: openTime } = formatOpenDateTime(auction.current_open_at);

  return (
    <div className='py-2 px-3 rounded-lg shadow-xl flex gap-3 border-2 border-gray-100'>
      <div className='overflow-hidden rounded-xl h-auto w-30 relative border-2 border-gray-100'>
        <ImageWithFallback src={asset.images[0]} alt='asset' fill className='object-cover'/>
        <p className='absolute bottom-0 text-base font-bold flex gap-2 text-white w-full h-7 backdrop-blur-2xl items-center justify-center'><MapPin size={17} className='-mt-1'/>{auction.city} </p>
      </div>

      <div className='flex-2'>
        <div className='flex justify-between gap-5'>
            {/* اسم الاصل والمساحة */}
            <div>
                <h1 className='font-bold text-[#171D5B] text-nowrap'>{asset.property_name}</h1>
                <div className='flex items-center gap-1'>
                    <Image src={"/assets/area.svg"} alt='area' width={16} height={16} className='-mt-1'/>
                    <p className='text-[#171D5B]'>{asset.area_sqm} م<sup>2</sup></p>
                </div>
            </div>

            {/* سعر السوم الحالى */}
            <div>
                <h1 className='font-bold text-[#171D5B] text-nowrap'>سعر السوم الحالى</h1>
                <div className='flex gap-1 items-center'>
                    <p className="text-yellow-600 text-[17px] font-extrabold">{formatCurrency(asset.current_bid_price)}</p>
                    <span className='font-medium text-[#171D5B]'>ر.س</span>
                </div>
                <p className="text-xs text-gray-500 text-nowrap">({formatCurrency(asset.price_per_meter)} ر.س) للمتر</p>
            </div>
        </div>

        <div className='mt-5 mb-3'>
            <AuctionStatusCard status={auction.status} remainingSeconds={auction.remaining_seconds} startDate={openDate} startTime={openTime} />
        </div>

        <div className='flex items-center justify-between'>
            <div className='flex-2'>
                <div className='flex items-center gap-1 font-bold text-[#171D5B] text-[18px] -mb-1'>
                    <Image src={"/assets/soums.svg"} alt='area' width={16} height={16} className='-mt-2'/>
                    <p>عدد السومات</p>
                </div>

                <div className='flex items-center gap-1'>
                    <p className='text-yellow-600 font-bold text-lg'>{asset.bids_count}</p>
                    <p className='text-gray-500'>مزايد</p>
                </div>
            </div>

            <Link href={`/auctions/${auction.id}/assets/${asset.id}`} className="text-white transition hover:bg-yellow-600 bg-yellow-500 rounded-lg px-3 py-2 flex-2 block text-center">
            تفاصيل المزاد   
            </Link>
        </div>
      </div>
    </div>
  )
}
