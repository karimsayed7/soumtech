import { getCompanies } from '@/lib/api/getCompanies'
import CompaniesList from '@/features/companies list/CompaniesList'

export default async function CompaniesPage() {
  const companies = await getCompanies()

  return <CompaniesList companies={companies} />
}