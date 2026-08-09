import React from 'react'
import { AuctionStatus, getAuctions } from '../../api/getAuctions';
import { AuctionTabsNav } from '@/components/shared/Auction/AuctionTabsNav';
import { Paginations } from '@/components/shared/Paginations';
import { AuctionCard } from '@/components/shared/Auction/AuctionCard';
import AuctionPanner from './AuctionPanner';
import DynamicBreadcrumb from '@/components/shared/DynamicBreadCrump';

export default async function Auctions({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {

    const params = await searchParams;
    const status = (params.status as AuctionStatus) || "ongoing";
    const page = Number(params.page) || 1;
    
    const { auctions, totalPages, totalCount } = await getAuctions(status, page);

    return (
        <div>       
            <div className='px-0 sm:px-10'>
                <DynamicBreadcrumb
                    items={[
                        {
                        href: "/",
                        label: "الرئيسية",
                        },
                        {
                        href: "",
                        label: "المزادات",}
                    ]}
                />     
            </div>
            <AuctionPanner totalCount={totalCount} status={status} />

            <div className="p-10 space-y-6">
                <div className="mb-10 flex items-center justify-center">
                    <AuctionTabsNav current={status} />
                </div>
            
                {auctions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-40">لا توجد مزادات حاليًا</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {auctions.map((auction) => (
                            <AuctionCard key={auction.id} auction={auction} />
                        ))}
                    </div>
                    )}
            
                <Paginations status={status} currentPage={page} totalPages={totalPages} />
            </div>
        </div>
    )
}