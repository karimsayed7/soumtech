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
  return (
    <div className='p-2 rounded-lg shadow-xl flex gap-2 border-2 border-gray-100'>
      <div className='overflow-hidden rounded-xl h-40 w-30 relative'>
        <ImageWithFallback src={asset.images[0]} alt='asset' fill className='object-cover'/>
        <p className='absolute bottom-0 text-base font-bold flex gap-2 text-white w-full h-7 backdrop-blur-2xl items-center justify-center'><MapPin size={17} className='-mt-1'/>{auction.city} </p>
      </div>

      <div>
        <div className='flex items-center justify-between'>
            {/* اسم الاصل والمساحة */}
            <div>
                <h1 className='font-bold text-[#171D5B]'>{asset.property_name}</h1>
                <div className='flex items-center gap-1'>
                    <Image src={"/assets/area.svg"} alt='area' width={16} height={16} className='-mt-1'/>
                    <p>{asset.area_sqm} م<sup>2</sup></p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
