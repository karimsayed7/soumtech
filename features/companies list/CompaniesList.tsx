'use client'

import { useState, useMemo } from 'react'
import ReusableTable from '@/components/shared/Table/ReusableTable'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { CompanyRow } from '@/api/getCompanies'
// import { COMPANIES_TABLE_HEADERS, renderCompanyCell } from './companies-table-cells'
import { COMPANIES_TABLE_HEADERS, renderCompanyCell } from '@/components/shared/Table/cells/companies-table-cells'

interface CompaniesTableProps {
  companies: CompanyRow[]
}

export default function CompaniesList({ companies }: CompaniesTableProps) {
  const [search, setSearch] = useState('')

  const filteredCompanies = useMemo(() => {
    if (!search.trim()) return companies
    return companies.filter((c) => c.name.includes(search.trim()))
  }, [companies, search])

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">قائمة الشركات</h2>
        <div className="relative w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="ابحث باسم الشركة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
        </div>
      </div>

      <ReusableTable
        th={COMPANIES_TABLE_HEADERS}
        rows={filteredCompanies}
        getRowKey={(row) => row.id}
        renderCell={renderCompanyCell}
      />
    </div>
  )
}