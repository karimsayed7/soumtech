'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Search } from 'lucide-react'
import { AUCTION_STATUS_LABELS } from '../types'

export default function AuctionsFilters({
  defaultSearch,
  defaultStatus,
}: {
  defaultSearch?: string
  defaultStatus: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(defaultSearch ?? '')
  const [isPending, startTransition] = useTransition()

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    params.delete('page') // reset pagination on any filter change
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    const timeout = setTimeout(() => updateParams({ search: value }), 400)
    return () => clearTimeout(timeout)
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="ابحث باسم المزاد"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pr-9"
        />
      </div>

      <Select defaultValue={defaultStatus} onValueChange={(v) => updateParams({ status: v })}>
        <SelectTrigger className="w-48 text-lg">
          <SelectValue placeholder="حالة المزاد" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all"  className="text-lg">الكل</SelectItem>
          {Object.entries(AUCTION_STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value}  className="text-lg" value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
    </div>
  )
}