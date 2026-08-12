import type { AuctionCounts } from '../types'

export default function AuctionsBanner({
  counts,
}: {
  counts: AuctionCounts
}) {
  const stats = [
    { label: 'مزادات جارية', value: counts.ongoing },
    { label: 'مزادات مغلقة', value: counts.ended },
    { label: 'مزادات قادمة', value: counts.upcoming },
    {
      label: 'مزادات بانتظار الموافقة',
      value: counts.waiting_approval,
    },
    { label: 'اجمالي عدد المزادات', value: counts.total },
  ]

  return (
    <div className="relative mb-15 pb-16">
      {/* Banner */}
      <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden rounded-2xl bg-gradient-to-l from-[#0b2447] to-[#0f3460]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'repeating-radial-gradient(circle at 20% 50%, transparent 0, transparent 20px, rgba(255,255,255,0.06) 21px)',
          }}
        />

        <div className="relative flex h-full items-center justify-start px-5 sm:px-6 md:px-8">
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">
            اهلاً وسهلاً
          </h2>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute left-3 right-3 -bottom-2 grid grid-cols-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md sm:left-5 sm:right-5 sm:grid-cols-3 md:left-6 md:right-6 md:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex min-h-20 flex-col items-center justify-center border-b border-gray-100 px-2 py-3 text-center last:border-b-0 sm:min-h-24 sm:py-4 md:border-b-0 md:border-r md:border-gray-100 md:py-5 md:first:border-r-0"
          >
            <span className="text-xs text-gray-500 sm:text-sm md:text-base">
              {s.label}
            </span>

            <span className="mt-1 text-lg font-extrabold text-[#0b2447] sm:text-xl">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}