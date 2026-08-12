'use client'

import { useState, useMemo } from 'react'
import ReusableTable from '@/components/shared/Table/ReusableTable'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { UserRow } from '@/api/getUsers'
// import { USERS_TABLE_HEADERS, renderUserCell } from './users-table-cells'
import { USERS_TABLE_HEADERS, renderUserCell } from '@/components/shared/Table/cells/users-table-cells'

interface UsersTableProps {
  users: UserRow[]
}

export default function UsersList({ users }: UsersTableProps) {
  const [search, setSearch] = useState('')

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users
    return users.filter((u) => (u.full_name ?? '').includes(search.trim()))
  }, [users, search])

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">المستخدمين</h2>
        <div className="relative w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
        </div>
      </div>

      <ReusableTable
        th={USERS_TABLE_HEADERS}
        rows={filteredUsers}
        getRowKey={(row) => row.id}
        renderCell={renderUserCell}
      />
    </div>
  )
}