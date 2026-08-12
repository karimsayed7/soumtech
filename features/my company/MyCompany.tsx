
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getCompanyById } from '@/lib/api/getCompanyById'
import AddAuctionDialog from './components/AddAuctionDialog'
// import MyCompanyAuctions from './components/MyCompanyAuctions'
import MyCompanyAuctions from './components/MyCompanyAuctions'

interface MyCompanyProps {
  companyId: string
}

export default async function MyCompany({ companyId }: MyCompanyProps) {
  const company = await getCompanyById(companyId)

  if (!company) notFound()

  return (
    <div>
      <div className="relative w-full py-10 rounded-xl bg-gradient-to-l from-[#171D5B] to-[#2a3580] flex md:flex-row flex-col   items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="overflow-hidden relative h-20 w-30 rounded-lg">
            <Image src="/assets/company.svg" alt='company' fill className='object-cover'/>
          </div>
          <div className="text-white text-right">
            <p className="font-bold text-xl">{company.name}</p>
            <p className="text-base opacity-80">{company.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-white text-base md:mt-0 mt-7">
          <div className="text-center border-l-2 pl-5">
            <p className="opacity-70">السجل التجاري</p>
            <p className="font-bold">{company.commercial_registry}</p>
          </div>
          <div className="text-center">
            <p className="opacity-70">رقم الجوال</p>
            <p className="font-bold">{company.phone}</p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <AddAuctionDialog companyId={companyId} />
      </div>

      <div className="mt-8">
        <MyCompanyAuctions
          companyId={companyId}
        />
      </div>
    </div>
  )
}