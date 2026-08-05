import { notFound } from 'next/navigation'
import { getAssetWithAuction } from '@/api/getAssetWithAuction'
import Image from 'next/image'
import AssetDetails from '@/components/shared/Asset/AssetDetails'
import MapPage from '@/components/shared/map/MapPage'
// import AssetImageSlider from '@/components/shared/Asset/AssetImageSlider'
import AssetImageSlider from '@/components/shared/Asset/AssetImageSlider.tsx'
import { Button } from '@/components/ui/button'
import { AuctionStatusCard } from '@/components/shared/Auction/timer/AuctionStatusCard'
import { formatOpenDateTime } from '@/lib/FormatComingDate'
import AssetPricingCard from './components/AssetPricingCard'
import AssetStatsCard from './components/AssetStatsCard'
import BidSection from './components/BidSection'
import type { AuctionStatus } from '@/api/getAuctions'


export default async function BiddingPage({ assetId }: { assetId: string }) {
  const asset = await getAssetWithAuction(assetId)

  if (!asset || !asset.auction) notFound()

  const { auction, ...assetData } = asset
  const { date: openDate, time: openTime } = formatOpenDateTime(auction.current_open_at);

  const pricingDetails = [
    { label: "سعر المتر", value: asset.price_per_meter },
    { label: "السعى", value: asset.saay_amount },
    { label: "ضريبة السعى", value: asset.saay_tax },
    { label: "الإجمالى", value: asset.total_amount },
  ];

  const statsDetails = [
    { label: "عربون الدخول", value: asset.entry_deposit, withCurrency: true },
    { label: "فرق السوم", value: asset.bid_increment, withCurrency: true },
    { label: "عدد السومات", value: asset.bids_count, withCurrency: false },
  ];

  return (
    <div className='flex lg:flex-row flex-col-reverse gap-10 my-20 mx-0 sm:mx-10 lg:mx-0'>
      <div className='flex-1 order-2 lg:order-1 h-fit rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.12)] p-3 pb-5'>
        <div className='flex pt-2 pb-4 border-b-2 border-gray-100 items-center justify-between'>
          <div className='text-2xl font-bold flex items-center gap-2'>
            {asset.property_type} <div className='h-1 w-2 bg-black'></div> {auction.name}
          </div>
          <Button className="text-white bg-[#171D5B] px-6 py-5 cursor-pointer hover:bg-[#171D5B] rounded-md text-lg flex items-center gap-3">
            <p className='text-2xl'>+</p>
            <p>سجل فى المزاد</p>
          </Button>
        </div>

        <div className='flex py-3 items-center justify-between'>
          <div className="relative w-fit mr-2 mb-3">
            <p className="text-[20px] font-extrabold">معرض الصور</p>
            <span className="absolute mt-[2px] right-0 h-[4px] w-1/2 bg-orange-600 animate-underline-grow" />
          </div>
          <p className='text-[20px] font-extrabold'>رقم التواصل: {asset.contact_number}</p>
        </div>
        
        <AssetImageSlider images={assetData.images} />

        <div className='my-5'>
          <AuctionStatusCard 
            status={(auction.status as AuctionStatus) ?? "upcoming"} 
            remainingSeconds={auction.remaining_seconds} 
            startDate={openDate} 
            startTime={openTime} 
            size='lg'
          />
        </div>

        <AssetPricingCard 
          currentPrice={asset.current_bid_price}
          pricingDetails={pricingDetails}
        />

        <AssetStatsCard stats={statsDetails} />

        <BidSection currentPrice={asset.current_bid_price} />
      </div>

      <div className='flex-1 order-1 lg:order-2 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.12)] p-4'>
        <div className='shadow-[0_0_10px_rgba(0,0,0,0.12)] rounded-lg'>
          <div className='relative lg:block md:hidden block w-full h-30 xl:h-40 overflow-hidden'>
            <Image 
              src={"/assets/bidding page top image.svg"} 
              alt='bidding img' 
              fill 
              className='object-cover'
            />
          </div>
          <div className="relative w-fit mx-4 mt-5 pb-3">
            <p className="text-[20px] font-extrabold">أعلى المزايدين</p>
            <span className="absolute mt-[2px] right-0 h-[4px] w-1/2 bg-orange-600 animate-underline-grow" />
          </div>
        </div>

        <div className='shadow-[0_0_10px_rgba(0,0,0,0.12)] rounded-lg pb-5'>
          <AssetDetails asset={asset} auction={auction} />
        </div>

        <div className='h-80 w-full py-4 pt-8'>
          <MapPage assets={asset ? [asset] : []} />
        </div>
      </div>
    </div>
  )
}