import { AuctionCountdown } from "./components/AuctionCountdown";
import { UpcomingAuctionCard } from "./components/UpcomingAuctionCard";
import { EndedAuctionCard } from "./components/EndedAuctionCard";
import type { AuctionStatus } from "@/api/getAuctions";

type Props = {
  status: AuctionStatus;
  remainingSeconds?: number | null;
  startDate: string | null;
  startTime: string | null;
  size?: "sm" | "lg";
};

export function AuctionStatusCard({
  status,
  remainingSeconds,
  startDate,
  startTime,
  size = "sm",
}: Props) {
  switch (status) {
    case "ongoing":
      return (
        <AuctionCountdown
          initialSeconds={remainingSeconds ?? 0}
          size={size}
        />
      );

    case "upcoming":
      return (
        <UpcomingAuctionCard
          startDate={startDate}
          startTime={startTime}
          size={size}
        />
      );

    case "ended":
      return <EndedAuctionCard size={size} />;
  }
}