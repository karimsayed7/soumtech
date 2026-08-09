import Image from "next/image";
import HomePanner from "./HomePanner";
import { AuctionCard } from "@/components/shared/Auction/AuctionCard";
import { AuctionTabsNav } from "@/components/shared/Auction/AuctionTabsNav";
import { getAuctions, type AuctionStatus } from "@/api/getAuctions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "@/components/shared/Footer";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status = (params.status as AuctionStatus) || "ongoing";
  const page = Number(params.page) || 1;

  const { auctions } = await getAuctions(status, page);

  return (
    <section className="py-8">
      <HomePanner />

      <div>
        <h1 className="text-xl font-bold text-center mb-5 px-10 pt-10 text-[#171D5B]">شركات المزادات</h1>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center pb-10">
          <Image src="/assets/org1.svg" alt="org1" width={160} height={80} />
          <Image src="/assets/org2.svg" alt="org2" width={160} height={80} />
          <Image src="/assets/org3.svg" alt="org3" width={160} height={80} />
          <Image src="/assets/org4.svg" alt="org4" width={160} height={80} />
          <Image src="/assets/org5.svg" alt="org5" width={160} height={80} />
        </div>
      </div>

      <div className="relative py-1 w-fit mx-10">
        <p className="text-[27px] font-extrabold text-[#171D5B]">المزادات</p>
        <span className="absolute mt-[2px] right-0 h-[4px] w-1/2 bg-yellow-500 animate-underline-grow" />
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

        {/* <Paginations status={status} currentPage={page} totalPages={totalPages} /> */}
      </div>

      <div className="flex items-center justify-center mb-10">
        <Link href={`/auctions`}>
          <Button className="rounded-full px-6 py-2 text-yellow-600 bg-white cursor-pointer border-2 border-yellow-600 text-lg hover:bg-yellow-50">عرض المزيد</Button> 
        </Link>
      </div>
      {/* <Footer /> */}
    </section>
  );
}