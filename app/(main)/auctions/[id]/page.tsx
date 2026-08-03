import React from 'react'
// import AuctionAssets from '@/features/auction-assets/AuctionAssets'
import AuctionAssets  from '@/features/auction assets/AuctionAssets'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ shownAs?: string }>;
}) {
  const { id } = await params;
  const { shownAs } = await searchParams;

  return (
    <div>
      <AuctionAssets auctionId={id} shownAs={shownAs} />
    </div>
  )
}