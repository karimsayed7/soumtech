'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/database.types'
import {
  Loader2,
  ChevronDown,
  MapPin,
  Ruler,
  Phone,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type AuctionDetail = Tables<'auctions'> & {
  assets: Tables<'assets'>[]
}

const STATUS_LABELS: Record<
  string,
  { label: string; className: string }
> = {
  waiting_approval: {
    label: 'بانتظار الموافقة',
    className: 'bg-amber-100 text-amber-700',
  },
  upcoming: {
    label: 'قادم',
    className: 'bg-blue-100 text-blue-700',
  },
  ongoing: {
    label: 'جارٍ الآن',
    className: 'bg-green-100 text-green-700',
  },
  ended: {
    label: 'منتهي',
    className: 'bg-gray-100 text-gray-600',
  },
  rejected: {
    label: 'مرفوض',
    className: 'bg-red-100 text-red-700',
  },
}

const currency = new Intl.NumberFormat('ar-EG', {
  style: 'currency',
  currency: 'EGP',
  maximumFractionDigits: 0,
})

const dateFmt = new Intl.DateTimeFormat('ar-EG', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export default function AuctionDetailsDialog({
  auctionId,
  open,
  onOpenChange,
}: {
  auctionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [data, setData] = useState<AuctionDetail | null>(null)
  const [error, setError] = useState(false)
  const [openAssetId, setOpenAssetId] = useState<string | null>(null)

  const loading = open && !data && !error

  useEffect(() => {
    if (!open || data) return

    let ignore = false
    const supabase = createClient()

    supabase
      .from('auctions')
      .select('*, assets(*)')
      .eq('id', auctionId)
      .single()
      .then(({ data: result, error: err }) => {
        if (ignore) return

        if (err) {
          setError(true)
        } else {
          setData(result as AuctionDetail)

          const first = (result as AuctionDetail)?.assets?.[0]

          if (first) {
            setOpenAssetId(first.id)
          }
        }
      })

    return () => {
      ignore = true
    }
  }, [open, auctionId, data])

  const statusInfo = data ? STATUS_LABELS[data.status] : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          !w-[95vw]
          !max-w-[600px]
          max-h-[92vh]
          overflow-y-auto
          overflow-x-hidden
          p-0

          sm:!w-[92vw]
          md:!w-[90vw]
          lg:!w-[88vw]
          xl:!w-[85vw]
        "
      >
        <DialogHeader className="sticky top-0 z-10 border-b bg-white px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <DialogTitle className="text-lg sm:text-xl">
              {data?.name ?? 'تفاصيل المزاد'}
            </DialogTitle>

            {statusInfo && (
              <Badge
                className={cn(
                  'text-sm font-normal',
                  statusInfo.className
                )}
              >
                {statusInfo.label}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        )}

        {error && (
          <div className="py-16 text-center text-base text-red-600">
            حصل خطأ أثناء تحميل البيانات
          </div>
        )}

        {data && (
          <div className="space-y-6 px-4 pb-6 sm:px-6">
            {/* بانر المزاد */}
            {data.banner_image && (
              <div className="relative h-36 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-48">
                <Image
                  src={data.banner_image}
                  alt={data.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* معلومات عامة */}
            <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 text-base sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <InfoItem label="المدينة" value={data.city} />

              <InfoItem
                label="عدد الأصول"
                value={data.assets_count}
              />

              <InfoItem
                label="رقم الصفقة"
                value={data.deal_number}
              />

              <InfoItem
                label="نوع التوقيت"
                value={
                  data.status === 'ended' ||
                  data.status === 'waiting_approval'
                    ? 'وقت ثابت'
                    : 'دورة متكررة'
                }
              />

              {data.static_open_at && (
                <InfoItem
                  label="يبدأ"
                  value={dateFmt.format(
                    new Date(data.static_open_at)
                  )}
                />
              )}

              {data.static_close_at && (
                <InfoItem
                  label="ينتهي"
                  value={dateFmt.format(
                    new Date(data.static_close_at)
                  )}
                />
              )}

              {data.cycle_length_seconds != null && (
                <InfoItem
                  label="مدة الدورة"
                  value={`${Math.round(
                    data.cycle_length_seconds / 3600
                  )} ساعة`}
                />
              )}
            </div>

            {/* الأصول */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-gray-700">
                الأصول ({data.assets.length})
              </h4>

              {data.assets.length === 0 && (
                <p className="py-4 text-center text-base text-gray-400">
                  لا توجد أصول مضافة لهذا المزاد
                </p>
              )}

              <div className="space-y-2">
                {data.assets.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    isOpen={openAssetId === asset.id}
                    onToggle={() =>
                      setOpenAssetId((cur) =>
                        cur === asset.id ? null : asset.id
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function InfoItem({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) {
  return (
    <div className="min-w-0">
      <div className="mb-0.5 text-sm text-gray-400">
        {label}
      </div>

      <div className="break-words text-base font-medium text-gray-800">
        {value ?? '—'}
      </div>
    </div>
  )
}

function AssetCard({
  asset,
  isOpen,
  onToggle,
}: {
  asset: Tables<'assets'>
  isOpen: boolean
  onToggle: () => void
}) {
  const thumbnail = asset.images?.[0]

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* الهيدر */}
      <button
        type="button"
        onClick={onToggle}
        className="
          flex w-full flex-wrap items-center gap-3
          p-3 text-right
          transition-colors
          hover:bg-gray-50
        "
      >
        {/* الصورة */}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100 sm:h-16 sm:w-16">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={asset.property_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-300">
              لا صورة
            </div>
          )}
        </div>

        {/* الاسم والموقع */}
        <div className="min-w-0 flex-1 basis-[calc(100%-120px)]">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="max-w-full truncate text-base font-medium">
              {asset.property_name}
            </span>

            <Badge
              variant="secondary"
              className="shrink-0 text-sm font-normal"
            >
              {asset.property_type}
            </Badge>
          </div>

          <div className="mt-0.5 flex min-w-0 items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4 shrink-0" />

            <span className="truncate">
              {asset.district} - {asset.street}
            </span>
          </div>
        </div>

        {/* السعر */}
        <div className="w-full shrink-0 text-right sm:w-auto sm:text-left">
          <div className="text-sm text-gray-400">
            السعر الحالي
          </div>

          <div className="text-base font-semibold text-green-700">
            {currency.format(
              asset.current_bid_price ?? asset.opening_price
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* التفاصيل */}
      {isOpen && (
        <div className="space-y-3 border-t bg-gray-50/50 p-3 text-base">
          {/* الصور */}
          {asset.images && asset.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {asset.images.map((img, i) => (
                <div
                  key={i}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100 sm:h-24 sm:w-24"
                >
                  <Image
                    src={img}
                    alt={`${asset.property_name} ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* الأسعار */}
          <div className="grid grid-cols-1 gap-3 rounded-md border bg-white p-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="السعر الافتتاحي"
              value={currency.format(asset.opening_price)}
            />

            <InfoItem
              label="المزايدة الحالية"
              value={currency.format(asset.current_bid_price)}
            />

            <InfoItem
              label="سعر المتر"
              value={currency.format(asset.price_per_meter)}
            />

            <InfoItem
              label="حد الزيادة"
              value={currency.format(asset.bid_increment)}
            />

            <InfoItem
              label="وديعة الدخول"
              value={currency.format(asset.entry_deposit)}
            />

            <InfoItem
              label="الإجمالي"
              value={currency.format(asset.total_amount)}
            />
          </div>

          {/* المساحة والمزايدات */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Ruler className="h-4 w-4 shrink-0" />
              {asset.area_sqm} م²
            </span>

            <span>
              عدد المزايدات: {asset.bids_count}
            </span>

            {asset.contact_number && (
              <span className="flex items-center gap-1 break-all">
                <Phone className="h-4 w-4 shrink-0" />
                {asset.contact_number}
              </span>
            )}
          </div>

          {/* الوصف */}
          {asset.description && (
            <p className="break-words leading-relaxed text-gray-600">
              {asset.description}
            </p>
          )}

          {/* الحدود */}
          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <InfoItem
              label="حد شمالي"
              value={asset.boundary_north}
            />

            <InfoItem
              label="حد جنوبي"
              value={asset.boundary_south}
            />

            <InfoItem
              label="حد شرقي"
              value={asset.boundary_east}
            />

            <InfoItem
              label="حد غربي"
              value={asset.boundary_west}
            />
          </div>

          {/* رقم الصك */}
          <div className="flex items-center gap-1 break-all border-t pt-1 text-sm text-gray-500">
            <FileText className="h-4 w-4 shrink-0" />
            <span>رقم الصك: {asset.deed_number}</span>
          </div>
        </div>
      )}
    </div>
  )
}