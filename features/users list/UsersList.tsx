'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import ReusableTable from '@/components/shared/Table/ReusableTable'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
// import { Paginations } from '@/components/shared/Pagination/Paginations'
import { Paginations } from '@/components/shared/Paginations'
import type { UserRow } from '@/lib/api/getUsers'
// import { USERS_TABLE_HEADERS, renderUserCell } from './users-table-cells'
import { USERS_TABLE_HEADERS, renderUserCell } from '@/components/shared/Table/cells/users-table-cells'

interface UsersTableProps {
  users: UserRow[]
  totalPages: number
  currentPage: number
}

export default function UsersList({ users, totalPages, currentPage }: UsersTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('name') ?? '')
  const [isPending, startTransition] = useTransition()

  function handleSearchChange(value: string) {
    setSearch(value)
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set('name', value.trim())
      } else {
        params.delete('name')
      }
      params.set('page', '1') // البحث بيرجع دايماً للصفحة الأولى
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">المستخدمين</h2>
        <div className="relative w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pr-9"
          />
        </div>
      </div>

      <div className={isPending ? 'opacity-60 transition-opacity' : ''}>
        <ReusableTable
          th={USERS_TABLE_HEADERS}
          rows={users}
          getRowKey={(row) => row.id}
          renderCell={renderUserCell}
        />
      </div>

      <div className="flex justify-center mt-4">
        <Paginations currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  )
}