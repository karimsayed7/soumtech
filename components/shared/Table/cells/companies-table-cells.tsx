import type { CompanyRow } from '@/lib/api/getCompanies'

export const COMPANIES_TABLE_HEADERS = ['اسم الشركة', 'اسم صاحب الشركة', 'رقم الجوال', 'البريد الإلكتروني', 'السجل التجاري']

export function renderCompanyCell(header: string, company: CompanyRow) {
  switch (header) {
    case 'اسم الشركة':
      return <span className="font-semibold">{company.name}</span>
    case 'اسم صاحب الشركة':
      return <span>{company.owner_name ?? '—'}</span>
    case 'رقم الجوال':
      return <span dir="ltr" className="block text-right">{company.phone ?? '—'}</span>
    case 'البريد الإلكتروني':
      return <span dir="ltr" className="block text-right text-muted-foreground">{company.email ?? '—'}</span>
    case 'السجل التجاري':
      return <span dir="ltr" className="block text-right">{company.commercial_registry ?? '—'}</span>
    default:
      return null
  }
}