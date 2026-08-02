import React from 'react'
import { AuctionStatus, getAuctions } from './api/getAuctions';
import { AuctionTabsNav } from '@/components/shared/Auction/AuctionTabsNav';
import { Paginations } from '@/components/shared/Paginations';
import { AuctionCard } from '@/components/shared/Auction/AuctionCard';
import Image from 'next/image';

const STATUS_LABELS: Record<AuctionStatus, string> = {
  ongoing: "عدد المزادات القائمة",
  upcoming: "عدد المزادات القادمة",
  ended: "عدد المزادات المنتهية",
};

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
            <div className="relative w-fit mx-10 mt-10">
                <p className="text-[27px] font-extrabold text-[#171D5B]">المزادات</p>
                <span className="absolute mt-[2px] right-0 h-[4px] w-1/2 bg-yellow-500 animate-underline-grow" />
            </div>
            <div className="relative left-1/2 right-1/2 -mx-[51vw] w-screen bg-[#F3F4F6] mt-2">
                <div className="max-w-[1300px] mx-auto py-5 flex items-center justify-between px-18 sm:px-22">
                    <div>
                        <p className='text-[20px] font-extrabold text-[#171D5B]'>كل المزادات</p>
                        <div className="flex items-center gap-2 text-[#171D5B]">
                            <Image src="/assets/auctionLogo.svg" className='-mt-1' alt="auctionLogo" width={18} height={20} />
                            <span className='text-lg '>{STATUS_LABELS[status]}</span>
                            <span className='text-red-500 font-semibold -mt-1'>({totalCount})</span>
                        </div>
                    </div>

                    <div className="md:flex items-center gap-5 hidden">
                        <Image src="/assets/الهيئة العامة للعقار دارك.svg" alt="logo2" width={140} height={20} />
                        <Image src="/assets/infath-dark.svg" alt="logo1" width={80} height={20} />
                    </div>
                </div>
            </div>

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