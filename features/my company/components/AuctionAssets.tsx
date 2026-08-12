import { getAssetsByAuction } from '@/lib/api/getAssetsByAuction'
import Image from 'next/image'

export default async function AuctionAssets({ auctionId, city }: { auctionId: string; city: string }) {
  const assets = await getAssetsByAuction(auctionId)

  if (assets.length === 0) {
    return <p className="text-base text-gray-400 text-center py-6">لا يوجد أصول مضافة لهذا المزاد بعد</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.map((asset) => (
        <div key={asset.id} className="bg-white border rounded-lg overflow-hidden">
          <div className="relative h-32 bg-gray-100">
            {asset.coverImageUrl && (
              <Image src={asset.coverImageUrl} alt={asset.propertyName} fill className="object-cover" />
            )}
          </div>
          <div className="p-3 text-sm">
            <p className="font-bold">{asset.propertyName}</p>
            <p className="text-gray-500">{asset.propertyType} • {asset.district}, {city}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-400">{asset.areaSqm} م²</span>
              <span className="font-bold text-blue-950">{asset.currentBidPrice} ر.س</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}