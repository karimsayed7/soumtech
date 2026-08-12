import { getMyCompanies } from '@/lib/api/getMyCompanies'
import AddCompanyDialog from './components/AddCompanyDialog'
import CompanyCard from './components/CompanyCard'

export default async function MyAuctions() {
  const companies = await getMyCompanies()

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-lg text-blue-950 underline max-w-md">
            لإضافة أصل يمكن المزايدة عليه، لازم يكون الأصل تابع لمزاد، والمزاد تابع لشركة.
            ابدأ بإضافة شركتك الأولى.
          </p>
        </div>
        <AddCompanyDialog mode="create" />
      </div>

      {companies.length === 0 ? (
        <p className="text-center text-lg text-muted-foreground py-25">
          لا يوجد شركات بعد
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,300px))] gap-6 mt-16">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  )
}