// app/(whatever-path)/[companyId]/page.tsx
import React from 'react'
import MyCompany from '@/features/my company/MyCompany'

export default async function Page({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params

  return (
    <div>
      <MyCompany companyId={companyId} />
    </div>
  )
}