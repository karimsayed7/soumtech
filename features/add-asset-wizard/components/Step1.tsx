'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { Control } from 'react-hook-form'
import FormInput from '@/components/shared/Fields/InputField'
import { Button } from '@/components/ui/button'
import type { WizardFormValues } from '@/schema/auctionWizard'

interface Step1Props {
  control: Control<WizardFormValues>
  images: File[]
  setImages: (files: File[]) => void
}

export default function Step1({ control, images, setImages }: Step1Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setImages([...images, ...files])
    e.target.value = ''
  }

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
      <FormInput control={control} name="property_name" label="اسم الاصل" placeholder="ادخل اسم الاصل" />
      <FormInput control={control} name="district" label="الحي" placeholder="ادخل الحي" />
      <FormInput control={control} name="city" label="المدينة" placeholder="ادخل المدينة" />
      <FormInput control={control} name="street" label="اسم الشارع" placeholder="ادخل اسم الشارع" />
      <FormInput control={control} name="property_type" label="نوع العقار" placeholder="ادخل نوع العقار" />

      <div className="mb-3">
        <label className="text-lg font-semibold block mb-1">رفع صور العقار</label>
        <Button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4 py-2"
        >
          تحميل الملف
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesChange}
        />

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((file, index) => (
              <div key={index} className="w-14 h-14 relative rounded-md overflow-hidden border">
                <Image src={URL.createObjectURL(file)} alt={`صورة ${index + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <FormInput control={control} name="description" label="وصف العقار" placeholder="ادخل وصف العقار" />

      <div className="mb-3">
        <label className="text-lg font-semibold block mb-1">ادخل الموقع</label>
        <div className="grid grid-cols-2 gap-2">
          <FormInput control={control} name="lat" label="خط العرض (Lat)" placeholder="مثال: 24.7136" />
          <FormInput control={control} name="lng" label="خط الطول (Lng)" placeholder="مثال: 46.6753" />
        </div>
      </div>
    </div>
  )
}