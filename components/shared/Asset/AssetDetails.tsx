"use client"
import React from 'react'
import type { Tables } from '@/lib/supabase/database.types'
import AssetDetailsLabel from './AssetDetailsLabel'

interface AssetCardProps {
    asset : Tables<'assets'>
    auction : Tables<'auctions_live'>
}

export default function AssetDetails({asset, auction} : AssetCardProps) {
  return (
    <div className=''>
      <div className='w-full  bg-gray-50'>
        <div className="relative w-fit mx-4 mt-5 pb-3 pt-2">
            <p className="text-[20px] font-extrabold text-[#171D5B]">التفاصيل</p>
            <span className="absolute mt-[2px] right-0 h-[4px] w-1/2 bg-orange-600 animate-underline-grow" />
        </div>
      </div>

      <div className='mx-3'>
        <h1 className='py-5'>{asset.description}</h1>
        
        <AssetDetailsLabel label='نوع العقار' value={asset.property_type}/>
        <AssetDetailsLabel label='المدينة' value={auction.city}/>
        <AssetDetailsLabel label='الحى' value={auction.name}/>
        <AssetDetailsLabel label='اسم الشارع' value={asset.street}/>
        <AssetDetailsLabel label='شمالا' value={asset.boundary_north}/>
        <AssetDetailsLabel label='جنوبا' value={asset.boundary_south}/>
        <AssetDetailsLabel label='شرقا' value={asset.boundary_east}/>
        <AssetDetailsLabel label='غربا' value={asset.boundary_west}/>
        <AssetDetailsLabel label='رقم الصك' value={asset.deed_number}/>
      </div>

      
    </div>
  )
}
