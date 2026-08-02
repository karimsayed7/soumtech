import { AuctionCountdown } from "./components/AuctionCountdown";
import { UpcomingAuctionCard } from "./components/UpcomingAuctionCard";
import { EndedAuctionCard } from "./components/EndedAuctionCard";
import type { AuctionStatus } from "@/features/auctions/api/getAuctions";

type Props = {
  status: AuctionStatus;
  remainingSeconds?: number | null;
  startDate: string;
  startTime: string;
};

export function AuctionStatusCard({
  status,
  remainingSeconds,
  startDate,
  startTime,
}: Props) {
  switch (status) {
    case "ongoing":
      return (
        <AuctionCountdown
          initialSeconds={remainingSeconds ?? 0}
        />
      );

    case "upcoming":
      return (
        <UpcomingAuctionCard
          startDate={startDate}
          startTime={startTime}
        />
      );

    case "ended":
      return <EndedAuctionCard />;
  }
}