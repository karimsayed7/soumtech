import AllAuctions from '@/features/all auctions/AllAuctions'

interface Props {
  searchParams: Promise<{
    search?: string
    status?: string
    page?: string
  }>
}

export default function Page({ searchParams }: Props) {
  return (
    <div>
      <AllAuctions searchParams={searchParams} />
    </div>
  )
}