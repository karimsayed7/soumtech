import BiddingPage from "@/features/bidding page/BiddingPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <BiddingPage assetId={id}/>
    </div>
  )
}