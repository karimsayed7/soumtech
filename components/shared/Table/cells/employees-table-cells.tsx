'use client'

import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { MessageSquare, Mail } from 'lucide-react'
// import type { Employee } from '@/constants/employees'
import type { Employee } from '@/features/employees list/constants/employees'

export const EMPLOYEES_TABLE_HEADERS = ['اسم الموظف', 'رقم الجوال', 'البريد الإلكتروني', 'تاريخ التسجيل', 'إجراءات']

interface RenderEmployeeCellProps {
  onSendSMS: (employee: Employee) => void
  onSendEmail: (employee: Employee) => void
}

export function renderEmployeeCell(
  header: string,
  employee: Employee,
  { onSendSMS, onSendEmail }: RenderEmployeeCellProps
) {
  switch (header) {
    case 'اسم الموظف':
      return <span className="font-semibold">{employee.name}</span>
    case 'رقم الجوال':
      return <span dir="ltr" className="block text-right">{employee.phone}</span>
    case 'البريد الإلكتروني':
      return <span dir="ltr" className="block text-right text-muted-foreground">{employee.email}</span>
    case 'تاريخ التسجيل':
      return <span>{format(new Date(employee.registeredAt), 'd MMMM yyyy', { locale: ar })}</span>
    case 'إجراءات':
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onSendSMS(employee)}>
            <MessageSquare className="size-4 ml-1" />
            رسالة نصية
          </Button>
          <Button size="sm" variant="outline" onClick={() => onSendEmail(employee)}>
            <Mail className="size-4 ml-1" />
            بريد إلكتروني
          </Button>
        </div>
      )
    default:
      return null
  }
}