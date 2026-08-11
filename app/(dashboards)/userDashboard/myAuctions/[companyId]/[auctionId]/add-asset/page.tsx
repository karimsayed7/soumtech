import AddAssetWizard from "@/features/add-asset-wizard/AddAssetWizard"

export default async function Page({
  params,
}: {
  params: Promise<{ companyId: string; auctionId: string }>
}) {
  const { companyId, auctionId } = await params
  return <AddAssetWizard companyId={companyId} auctionId={auctionId} />
}