import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { UserRow } from '@/api/getUsers'

export const USERS_TABLE_HEADERS = ['اسم الحساب', 'رصيد المحفظة', 'البريد الإلكتروني', 'رقم الهاتف', 'تاريخ التسجيل', 'الحالة']

export function renderUserCell(header: string, user: UserRow) {
  switch (header) {
    case 'اسم الحساب':
      return <span className="font-semibold">{user.full_name ?? '—'}</span>
    case 'رصيد المحفظة':
      return user.wallet_balance !== null
        ? <span className="font-bold">{formatCurrency(user.wallet_balance)} ريال</span>
        : <span className="text-muted-foreground">—</span>
    case 'البريد الإلكتروني':
      return <span dir="ltr" className="block text-right text-muted-foreground">{user.email ?? '—'}</span>
    case 'رقم الهاتف':
      return <span dir="ltr" className="block text-right">{user.phone ?? '—'}</span>
    case 'تاريخ التسجيل':
      return <span>{format(new Date(user.created_at), 'd MMMM yyyy', { locale: ar })}</span>
    case 'الحالة':
      return user.source === 'registered'
        ? <Badge variant="default">مسجل دخول</Badge>
        : <Badge variant="secondary">سومر (بدون حساب)</Badge>
    default:
      return null
  }
}