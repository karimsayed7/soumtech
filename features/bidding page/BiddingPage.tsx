import { notFound } from 'next/navigation'
import { getAssetWithAuction } from '@/api/getAssetWithAuction'
import Image from 'next/image'
import AssetDetails from '@/components/shared/Asset/AssetDetails'
import MapPage from '@/components/shared/map/MapPage'
import AssetImageSlider from '@/components/shared/Asset/AssetImageSlider.tsx'
import { AuctionStatusCard } from '@/components/shared/Auction/timer/AuctionStatusCard'
import { formatOpenDateTime } from '@/lib/FormatComingDate'
import AssetPricingCard from './components/AssetPricingCard'
import AssetStatsCard from './components/AssetStatsCard'
import BidSection from './components/BidSection'
import type { AuctionStatus } from '@/api/getAuctions'
import DynamicBreadcrumb from '@/components/shared/DynamicBreadCrump'
import { getAssetBidders } from '@/api/getAssetBidders'
import ReusableTable from '@/components/shared/Table/ReusableTable'
import { BIDDERS_TABLE_HEADERS, renderBidderCell } from '@/components/shared/Table/cells/bidders-cells'
import { getBiddingContext } from '@/api/getBiddingContext'
import RegisterDialog from './components/RegisterDialog'

export default async function BiddingPage({ assetId }: { assetId: string }) {
  const asset = await getAssetWithAuction(assetId)
  const bidders = await getAssetBidders(assetId)
  if (!asset || !asset.auction) notFound()
  const biddingContext = await getBiddingContext(assetId)
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
    { label: "عدد السومات", value: bidders.length, withCurrency: false },
  ];

  return (
    <>
      <DynamicBreadcrumb
        items={[
          {
            href: "/",
            label: "الرئيسية",
          },
          {
            href: "/auctions",
            label: "المزادات",
          },
          {
            href: `/auctions/${auction.id}?shownAs=table`,
            label: `${auction.name}`,
          },
          {
            href: ``,
            label: `${asset.property_name}`,
          }
        ]}
      />
      <div className='flex lg:flex-row flex-col-reverse gap-10 mb-20 mx-0 sm:mx-10 lg:mx-0'>
        <div className='flex-1 order-2 lg:order-1 h-fit rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.12)] p-3 pb-5'>
          <div className='flex pt-2 pb-2 border-b-2 border-gray-100 items-center justify-between'>
            <div className='text-[21px] font-bold flex items-center gap-2'>
              {asset.property_type} <div className='h-1 w-2 bg-black'></div> {auction.name}
            </div>
            <RegisterDialog
              assetId={assetId}
              propertyName={asset.property_name}
              entryDeposit={asset.entry_deposit}
              walletBalance={biddingContext.walletBalance}
              auctionStatus={(auction.status as 'upcoming' | 'ongoing' | 'ended') ?? 'upcoming'}
              initiallyRegistered={biddingContext.isRegistered}
              isLoggedIn={biddingContext.userId !== null}
            />
          </div>

          <div className='flex py-3 items-center justify-between'>
            <div className="relative w-fit mr-2 mb-3">
              <p className="text-[20px] font-extrabold">معرض الصور</p>
              <span className="absolute mt-[2px] right-0 h-[4px] w-1/2 bg-orange-600 animate-underline-grow" />
            </div>
            <p className='text-[18px] font-extrabold'>رقم التواصل: {asset.contact_number}</p>
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

          <BidSection
            assetId={assetId}
            currentPrice={asset.current_bid_price}
            bidIncrement={asset.bid_increment}
            auctionStatus={(auction.status as 'upcoming' | 'ongoing' | 'ended') ?? 'upcoming'}
            isRegistered={biddingContext.isRegistered}
            walletBalance={biddingContext.walletBalance}
          />
        </div>

        <div className='flex-1 order-1 lg:order-2 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.12)] p-4'>
          <div className='shadow-[0_0_5px_rgba(0,0,0,0.12)] rounded-lg pb-5'>
            <div className='relative lg:block md:hidden block w-full h-30 xl:h-35 overflow-hidden'>
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
            <div className='mx-4 rounded-lg'>
              {bidders.length > 0 ? (
                <ReusableTable
                  th={BIDDERS_TABLE_HEADERS}
                  rows={bidders}
                  getRowKey={(bid) => bid.id}
                  renderCell={renderBidderCell}
                  getRowClassName={(bid) => (bid.id === bidders[0].id ? 'bg-[#F5C518]' : '')}
                />
              ) : (
                <p className="text-center text-xl text-muted-foreground py-6">لم يبدأ المزاد بعد</p>
              )}
            </div>
          </div>

          <div className='shadow-[0_0_5px_rgba(0,0,0,0.12)] rounded-lg pb-5'>
            <AssetDetails asset={asset} auction={auction} />
          </div>

          <div className='h-80 w-full py-4 pt-8'>
            <MapPage assets={asset ? [asset] : []} />
          </div>
        </div>
      </div>
    </>
  )
}