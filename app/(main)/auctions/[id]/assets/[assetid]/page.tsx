import BiddingPage from "@/features/bidding page/BiddingPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; assetid: string }>;
}) {
  const { assetid } = await params;

  return (
    <div>
      <BiddingPage assetId={assetid} />
    </div>
  );
}