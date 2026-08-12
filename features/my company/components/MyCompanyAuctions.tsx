// features/my company/components/MyCompanyAuctions.tsx
import { getAuctionsByCompany } from '@/lib/api/getAuctionsByCompany'
import AuctionCard from './AuctionCard'
import AuctionAssets from './AuctionAssets'

interface MyCompanyAuctionsProps {
  companyId: string
}

export default async function MyCompanyAuctions({ companyId }: MyCompanyAuctionsProps) {
  const auctions = await getAuctionsByCompany(companyId)

  if (auctions.length === 0) {
    return (
      <div className="text-center text-lg py-16 text-gray-400">
        <p>لا يوجد مزادات حتى الآن</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} companyId={companyId} auction={auction}>
          <AuctionAssets auctionId={auction.id} city={auction.city} />
        </AuctionCard>
      ))}
    </div>
  )
}