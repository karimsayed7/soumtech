import { getRegisteredAssets } from '@/lib/api/getRegisteredAssets'
import AssetCard from '@/components/shared/Asset/AssetCard'

export default async function RegisteredAuctions() {
  const registeredAssets = await getRegisteredAssets()

  if (registeredAssets.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground py-10">
        لم تسجل في أي مزاد حتى الآن
      </p>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,450px))] gap-8">
      {registeredAssets.map((asset) => (
        <div key={asset.id}>
          <AssetCard asset={asset} auction={asset.auction} showBadges />
        </div>
      ))}
    </div>
  )
}