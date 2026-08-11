// features/my company/components/AuctionCard.tsx
'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ChevronDown, Plus } from 'lucide-react'
import { deleteAuction } from '../auctionAssets'

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  waiting_approval: { label: 'بانتظار موافقة الإدارة', className: 'bg-yellow-100 text-yellow-700' },
  upcoming: { label: 'قادم', className: 'bg-blue-100 text-blue-700' },
  ongoing: { label: 'جاري الآن', className: 'bg-green-100 text-green-700' },
  ended: { label: 'منتهي', className: 'bg-gray-100 text-gray-600' },
}

interface AuctionCardProps {
  companyId: string
  auction: {
    id: string
    name: string
    city: string
    status: string
    bannerImage: string | null
    assetsCount: number
  }
  children: React.ReactNode // <-- AuctionAssets هيتبعت من هنا
}

export default function AuctionCard({ companyId, auction, children }: AuctionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()

  const statusInfo = STATUS_MAP[auction.status] ?? STATUS_MAP.waiting_approval

  function handleDelete() {
    if (!confirm('هل أنت متأكد من حذف هذا المزاد؟')) return
    startTransition(async () => {
      await deleteAuction(companyId, auction.id)
    })
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            {auction.bannerImage && (
              <Image src={auction.bannerImage} alt={auction.name} fill className="object-cover" />
            )}
          </div>

          <div >
            <p className="font-bold">{auction.name}</p>
            <p className="text-base text-gray-500">{auction.city} • {auction.assetsCount} أصل</p>
          </div>

          <span className={`text-base px-3 py-1 rounded-full ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/userDashboard/myAuctions/${companyId}/${auction.id}/add-asset`}
            className="flex items-center gap-1  bg-yellow-500 hover:bg-yellow-600 text-white text-base rounded-lg px-3 py-2"
          >
            <Plus size={16} /> إضافة أصل
          </Link>

          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-600 cursor-pointer hover:bg-red-50 rounded-lg p-2 disabled:opacity-50"
          >
            <Trash2 size={18} />
          </button>

          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <ChevronDown className={`transition-transform ${expanded ? 'rotate-180' : ''}`} size={18} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t bg-gray-50 p-4">
          {children}
        </div>
      )}
    </div>
  )
}