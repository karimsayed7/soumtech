type UpcomingAuctionCardProps = {
  startDate: string;
  startTime: string;
};

export function UpcomingAuctionCard({
  startDate,
  startTime,
}: UpcomingAuctionCardProps) {
  return (
    <div className="mt-5 h-12 p-2 py-1 overflow-hidden rounded-lg border-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col justify-center">
          <p className="text-sm text-muted-foreground">
            تاريخ فتح المزاد
          </p>

          <p className="text-base font-bold text-[#171D5B]">
            {startDate}
          </p>
        </div>

        <span className="h-8 w-[1px] -mt-1 bg-gray-200"></span>

        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">
            وقت فتح المزاد
          </p>

          <p className="text-base font-bold text-[#171D5B]">
            {startTime}
          </p>
        </div>
      </div>
    </div>
  );
}