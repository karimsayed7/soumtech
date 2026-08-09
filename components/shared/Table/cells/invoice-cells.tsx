// features/wallet/invoice-cells.tsx
import type { Database } from '@/lib/supabase/database.types'

type Invoice = Database['public']['Tables']['invoices']['Row']

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(value)
}

function formatInvoiceDate(value: string) {
  return new Date(value).toLocaleString('ar-SA', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export const INVOICE_TABLE_HEADERS = ['رقم الفاتورة', 'التاريخ', 'نوع العملية', 'المبلغ']

export function renderInvoiceCell(header: string, invoice: Invoice) {
  switch (header) {
    case 'رقم الفاتورة':
      return <span className="font-semibold">{invoice.invoice_number}</span>
    case 'التاريخ':
      return <span className="text-lg font-bold">{formatInvoiceDate(invoice.invoice_date)}</span>
    case 'نوع العملية':
      return (
        <span
          className={
            invoice.transaction_type === 'شحن رصيد' ? 'text-green-600 font-bold text-lg' : 'text-lg text-red-600 font-bold'
          }
        >
          {invoice.transaction_type}
        </span>
      )
    case 'المبلغ':
      return <span className="font-extrabold text-base">{formatCurrency(invoice.amount)} ر.س</span>
    default:
      return null
  }
}