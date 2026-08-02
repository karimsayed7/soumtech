import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AuctionStatusCard } from "./timer/AuctionStatusCard";
import type { AuctionListItem } from "@/features/auctions/api/getAuctions";
import { MapPin } from "lucide-react";

function formatOpenDateTime(iso: string | null) {
  if (!iso) return { date: "-", time: "-" };
  const d = new Date(iso);
  return {
    date: new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Riyadh",
    }).format(d),
    time: new Intl.DateTimeFormat("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Riyadh",
    }).format(d),
  };
}

export function AuctionCard({ auction }: { auction: AuctionListItem }) {
  const { date: openDate, time: openTime } = formatOpenDateTime(auction.current_open_at);

  return (
    <Card className="overflow-hidden shadow-xl p-2">
      <div className="relative h-40 w-full overflow-hidden rounded-lg border-2 border-gray-200">
        {auction.banner_image && (
          <Image src={auction.banner_image} alt={auction.name ?? "شعار الشركة"} fill className="object-cover" />
        )}
      </div>

      <CardContent className="space-y-2 px-2">
        <div className="flex items-center justify-between h-7 gap-2">
          <div>
            <p className="font-bold text-[17px] text-[#171D5B]">{auction.name}</p>
            <div className="flex items-start gap-2 mt-1 text-yellow-600">
              <MapPin size={14} />
              <span>{auction.city}</span>
            </div>
          </div>
          <div className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {auction.companies?.logo_url && (
              <Image
                src={auction.companies.logo_url}
                alt={auction.companies.name ?? "شعار الشركة"}
                fill
                className="object-contain p-0.5"
              />
            )}
          </div>
        </div>

        <AuctionStatusCard
          status={(auction.status) ?? "ended"}
          remainingSeconds={auction.remaining_seconds}
          startDate={openDate}
          startTime={openTime}
        />

        <div className="flex items-center justify-between text-base">
          <div>
            <p className="font-extrabold text-lg text-[#171D5B]">عدد الاصول:</p>
            <p className="text-yellow-600 font-extrabold text-lg">{auction.assets_count}</p>
          </div>
          <Link
            href={`/auctions/${auction.id}`}
            className="text-white transition hover:bg-yellow-600 bg-yellow-500 rounded-lg px-3 py-2"
          >
            تفاصيل المزاد
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}