import React from 'react'
import Auctions from '@/features/auctions/Auctions'

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  return (
    <div>
      <Auctions searchParams={searchParams}/>
    </div>
  )
}
