type Props = {
  startDate: string | null;
  startTime: string | null;
  size?: "sm" | "lg";
};

export function UpcomingAuctionCard({
  startDate,
  startTime,
  size = "sm",
}: Props) {
  const styles = {
    sm: {
      container: "h-12 p-2 py-1",
      label: "text-sm",
      value: "text-base",
      divider: "h-8",
    },
    lg: {
      container: "h-20 px-5 py-4",
      label: "text-base",
      value: "text-xl",
      divider: "h-12",
    },
  };

  const ui = styles[size];

  return (
    <div
      className={`overflow-hidden rounded-lg border-2 ${ui.container}`}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex flex-col justify-center">
          <p className={`${ui.label} text-muted-foreground`}>
            تاريخ فتح المزاد
          </p>

          <p className={`${ui.value} font-bold text-[#171D5B]`}>
            {startDate}
          </p>
        </div>

        <span className={`w-px bg-gray-200 ${ui.divider}`} />

        <div className="flex flex-col items-center justify-center">
          <p className={`${ui.label} text-muted-foreground`}>
            وقت فتح المزاد
          </p>

          <p className={`${ui.value} font-bold text-[#171D5B]`}>
            {startTime}
          </p>
        </div>
      </div>
    </div>
  );
}