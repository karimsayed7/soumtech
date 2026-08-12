// features/add-asset-wizard/AddAssetWizard.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import { step1Schema, step2Schema, step3Schema } from '@/schema/auctionWizard'
import type { WizardFormValues } from '@/schema/auctionWizard'
import { addAssetToAuction } from '../my company/auctionAssets'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import type { Resolver } from 'react-hook-form'

const STEPS = [
  { number: 1, title: 'نوع العقار', description: 'ادخل بيانات نوع العقار', schema: step1Schema },
  { number: 2, title: 'تفاصيل العقار', description: 'ادخل تفاصيل نوع العقار', schema: step2Schema },
  { number: 3, title: 'تفاصيل المزاد', description: 'ادخل تفاصيل المزاد', schema: step3Schema },
]

// بيانات تجريبية لكل الحقول عبر الخطوات الثلاث — تُستخدم لملء الخطوة الحالية فقط
const DUMMY_DATA: Record<string, unknown> = {
  property_name: 'فيلا الواحة',
  district: 'حي النرجس',
  city: 'الرياض',
  street: 'شارع الأمير سلطان',
  property_type: 'فيلا',
  description: 'فيلا حديثة التشطيب على شارعين، تصميم عصري وموقع مميز',
  lat: 24.7136,
  lng: 46.6753,
  boundary_north: 'شارع عام 15م',
  boundary_south: 'قطعة رقم 42',
  boundary_east: 'قطعة رقم 44',
  boundary_west: 'شارع فرعي 10م',
  area_sqm: 450,
  deed_number: '410120003456',
  open_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  close_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  bid_increment: 5000,
  opening_price: 850000,
  entry_deposit: 20000,
}

export default function AddAssetWizard({ companyId, auctionId }: { companyId: string; auctionId: string }) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [formData, setFormData] = useState<Partial<WizardFormValues>>({})
  const [images, setImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const currentStepConfig = STEPS[step - 1]
  const currentSchema = currentStepConfig.schema

  const { control, handleSubmit, setValue, getValues } = useForm<WizardFormValues>({
    resolver: zodResolver(currentSchema) as unknown as Resolver<WizardFormValues>,
    defaultValues: formData as WizardFormValues,
  })

  function goBack() {
    if (step === 1) return
    setDirection('backward')
    // نحفظ اللي اتملى في الخطوة الحالية قبل الرجوع، عشان لو المستخدم قدّم تاني يرجعله
    setFormData((prev) => ({ ...prev, ...getValues() }))
    setStep((prev) => prev - 1)
  }

  const STEP_FIELDS: Record<number, (keyof WizardFormValues)[]> = {
    1: ['property_name', 'district', 'city', 'street', 'property_type', 'description', 'lat', 'lng'],
    2: ['boundary_north', 'boundary_south', 'boundary_east', 'boundary_west', 'area_sqm', 'deed_number'],
    3: ['open_at', 'close_at', 'bid_increment', 'opening_price', 'entry_deposit'],
  }
  function fillDummyData() {
    const fieldNames = STEP_FIELDS[step] ?? []
    fieldNames.forEach((field) => {
      if (field in DUMMY_DATA) {
        setValue(field as keyof WizardFormValues, DUMMY_DATA[field] as never, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
    })
  }

  async function onStepSubmit(values: Record<string, unknown>) {
     if (step === 1 && images.length === 0) {
      setError('يجب رفع صورة واحدة على الأقل للعقار')
      return
    }
    const merged = { ...formData, ...values }
    setFormData(merged)

    if (step < 3) {
      setDirection('forward')
      setStep((prev) => prev + 1)
      return
    }

    setLoading(true)
    setError(null)

    const result = await addAssetToAuction(companyId, auctionId, merged as WizardFormValues, images)

    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    router.push(`/userDashboard/myAuctions/${companyId}`)
  }

  return (
    <div className='h-full flex flex-col justify-between'>
      {/* ===== Stepper ===== */}
      <div className="flex items-center mb-10 border-b-2 border-gray-100 pb-5" dir="rtl">
        {STEPS.map((s, idx) => {
          const isDone = s.number < step
          const isActive = s.number === step

          return (
            <div key={s.number} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-end text-right gap-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-base font-bold transition-colors duration-300 ${
                      isActive || isDone ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {s.title}
                  </span>
                  <div
                    className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${
                      isDone
                        ? 'bg-orange-600 border-orange-600 text-white'
                        : isActive
                        ? 'border-orange-500 text-orange-500'
                        : 'border-gray-300 text-gray-400'
                    }`}
                  >
                    {isDone ? <Check size={14} /> : s.number}
                  </div>
                </div>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    isActive ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  {s.description}
                </p>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="flex-1 h-[2px] mx-3 mb-5 bg-gray-200 relative overflow-hidden">
                  <div
                    className={`absolute inset-y-0 right-0 bg-orange-500 transition-all duration-500 ease-out ${
                      s.number < step ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ===== محتوى الخطوة مع ترانزيشن ===== */}
      <form onSubmit={handleSubmit(onStepSubmit)} className=''>
        <div
          key={step}
          className={
            direction === 'forward'
              ? 'animate-in fade-in slide-in-from-left-6 duration-300'
              : 'animate-in fade-in slide-in-from-right-6 duration-300'
          }
        >
          {step === 1 && <Step1 control={control} images={images} setImages={setImages} imagesError={step === 1 ? error ?? undefined : undefined}/>}
          {step === 2 && <Step2 control={control} />}
          {step === 3 && <Step3 control={control} />}
        </div>

        {/* {error && <p className="text-red-600 text-sm mt-3">{error}</p>} */}

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="border rounded-lg px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                رجوع
              </button>
            )}

            <button
              type="button"
              onClick={fillDummyData}
              className="border border-dashed border-orange-400 cursor-pointer text-orange-600 rounded-lg px-4 py-3 text-base hover:bg-orange-50 transition-colors"
            >
              ملء بيانات تجريبية
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-white rounded-lg px-6 py-3 disabled:opacity-50 transition-colors"
          >
            {loading ? 'جاري الحفظ...' : step < 3 ? 'التالي' : 'اضافة العقار'}
          </button>
        </div>
      </form>
    </div>
  )
}