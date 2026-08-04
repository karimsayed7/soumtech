"use client"
import React from 'react'
import type { AuctionListItem } from '@/api/getAuctions'
import type { Database } from '@/lib/supabase/database.types'
import AssetDetailsLabel from './AssetDetailsLabel'

interface AssetCardProps {
    asset : Database['public']['Tables']['assets']['Row']
    auction : AuctionListItem
}

export default function AssetDetails({asset, auction} : AssetCardProps) {
  return (
    <div className='mx-3'>
      <div className='w-full  bg-gray-50 rounded-md'>
        <div className="relative w-fit mx-4 mt-5 pb-3">
            <p className="text-[20px] font-extrabold text-[#171D5B]">التفاصيل</p>
            <span className="absolute mt-[2px] right-0 h-[3px] w-1/2 bg-orange-600 animate-underline-grow" />
        </div>
      </div>

      <div>
        <h1 className='py-5'>{asset.description}</h1>
        
        <AssetDetailsLabel label='نوع العقار' value={asset.property_type}/>
        <AssetDetailsLabel label='المدينة' value={auction.city}/>
        <AssetDetailsLabel label='الحى' value={auction.name}/>
        <AssetDetailsLabel label='شمالا' value={asset.boundary_north}/>
        <AssetDetailsLabel label='جنوبا' value={asset.boundary_south}/>
        <AssetDetailsLabel label='شرقا' value={asset.boundary_east}/>
        <AssetDetailsLabel label='غربا' value={asset.boundary_west}/>
        <AssetDetailsLabel label='اسم الشارع' value={asset.street}/>
        <AssetDetailsLabel label='رقم الصك' value={asset.deed_number}/>
      </div>

      
    </div>
  )
}
