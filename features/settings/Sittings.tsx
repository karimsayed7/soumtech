'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FormInput from '@/components/shared/Fields/InputField'
import ImageUploadButton from '@/components/shared/ImageUploadButton'
import { profileSchema, type ProfileFormValues } from '@/schema/profile'
import { updateProfile } from './profile'

interface SittingsProps {
  initialData: ProfileFormValues
  initialAvatarUrl: string | null
  initialBannerUrl: string | null
}

export default function Sittings({ initialData, initialAvatarUrl, initialBannerUrl }: SittingsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl)
  const [bannerUrl, setBannerUrl] = useState(initialBannerUrl)

  const { control, handleSubmit, reset, watch } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  })

  const currentName = watch('full_name')
  const firstLetter = currentName?.trim()?.charAt(0)?.toUpperCase() || '؟'

  async function onSubmit(values: ProfileFormValues) {
    setSaving(true)
    setServerError(null)

    const result = await updateProfile(values)

    setSaving(false)

    if (!result.success) {
      setServerError(result.error)
      return
    }

    setIsEditing(false)
  }

  function handleEditToggle() {
    if (isEditing) {
      reset(initialData)
    }
    setIsEditing((prev) => !prev)
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">الملف الشخصي</h1>

      <div className="relative">
        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gradient-to-l from-purple-500 via-pink-500 to-orange-400">
          {bannerUrl && <Image src={bannerUrl} alt="banner" fill className="object-cover" />}

          <div className="absolute top-4 right-4">
            <ImageUploadButton kind="banner" onUploaded={setBannerUrl}>
              <span className="flex items-center gap-2 cursor-pointer hover:bg-yellow-600 bg-yellow-500 text-white text-sm font-bold rounded-lg px-4 py-2">
                اختر صورة
                <Pencil size={16} />
              </span>
            </ImageUploadButton>
          </div>
        </div>

        
        <div className="absolute -bottom-10 left-8 w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-yellow-500 flex items-center justify-center">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="avatar" fill className="object-cover" />
          ) : (
            <span className="text-[#171D5B] font-bold text-3xl">{firstLetter}</span>
          )}
        </div>

        {/* زرار تعديل الأفاتار: تحت يمين الدايرة */}
        <div className="absolute -bottom-10 left-8 w-20 h-20">
          <div className="absolute bottom-0 right-0">
            <ImageUploadButton kind="avatar" onUploaded={setAvatarUrl}>
              <span className="flex items-center justify-center w-7 h-7 cursor-pointer hover:bg-yellow-600 rounded-full  bg-yellow-500 border-2 border-white text-white">
                <Pencil size={14} />
              </span>
            </ImageUploadButton>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-14 bg-white rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.08)] p-6">
        <div className="flex justify-end mb-4">
          <Button
            type="button"
            onClick={handleEditToggle}
            className="bg-gray-200 text-[#171D5B] text-lg hover:bg-gray-300 cursor-pointer shadow-none"
          >
            {isEditing ? 'إلغاء' : 'تعديل'}
            <Pencil size={16} className="ml-1" />
          </Button>
        </div>

        <fieldset disabled={!isEditing} className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <FormInput control={control} name="full_name" label="الاسم" />
          <FormInput control={control} name="email" label="البريد الإلكتروني" type="email" />
          <FormInput control={control} name="phone" label="رقم الجوال" />
          <FormInput control={control} name="birth_date" label="تاريخ الميلاد" type="date" />
        </fieldset>

        {serverError && <p className="text-red-600 text-lg mt-3">{serverError}</p>}

        {isEditing && (
          <Button
            type="submit"
            disabled={saving}
            className="mt-5 bg-yellow-500 cursor-pointer text-lg hover:bg-yellow-600 text-white rounded-lg px-8 py-3 disabled:opacity-50"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        )}
      </form>
    </div>
  )
}