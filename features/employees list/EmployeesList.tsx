'use client'

import { useState, useMemo } from 'react'
import ReusableTable from '@/components/shared/Table/ReusableTable'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
// import { EMPLOYEES, type Employee } from '@/constants/employees'
// import { EMPLOYEES, type Employee } from '../constants/employees'
import { EMPLOYEES, type Employee } from './constants/employees'
// import { EMPLOYEES_TABLE_HEADERS, renderEmployeeCell } from './employees-table-cells'
import { EMPLOYEES_TABLE_HEADERS, renderEmployeeCell } from '@/components/shared/Table/cells/employees-table-cells'
// import { SendMessageDialog } from './send-message-dialog'
import { SendMessageDialog } from './send-message-dialog'

export default function EmployeesList() {
  const [search, setSearch] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [dialogType, setDialogType] = useState<'sms' | 'email'>('sms')
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return EMPLOYEES
    return EMPLOYEES.filter((emp) => emp.name.includes(search.trim()))
  }, [search])

  function handleSendSMS(employee: Employee) {
    setSelectedEmployee(employee)
    setDialogType('sms')
    setDialogOpen(true)
  }

  function handleSendEmail(employee: Employee) {
    setSelectedEmployee(employee)
    setDialogType('email')
    setDialogOpen(true)
  }

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">الموظفين</h2>
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
        th={EMPLOYEES_TABLE_HEADERS}
        rows={filteredEmployees}
        getRowKey={(row) => row.id}
        renderCell={(header, row) =>
          renderEmployeeCell(header, row, { onSendSMS: handleSendSMS, onSendEmail: handleSendEmail })
        }
      />

      <SendMessageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={selectedEmployee}
        type={dialogType}
      />
    </div>
  )
}