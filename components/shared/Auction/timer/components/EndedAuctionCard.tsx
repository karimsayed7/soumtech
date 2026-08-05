type Props = {
  size?: "sm" | "lg";
};

export function EndedAuctionCard({
  size = "sm",
}: Props) {
  const styles = {
    sm: {
      container: "h-10",
      text: "text-base",
    },
    lg: {
      container: "h-14",
      text: "text-xl",
    },
  };

  const ui = styles[size];

  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-red-700 ${ui.container}`}
    >
      <span className={`${ui.text} font-bold text-white`}>
        تم إغلاق المزاد
      </span>
    </div>
  );
}