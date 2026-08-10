'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import FormInput from '@/components/shared/Fields/InputField'

import {
  type CompanyFormValues,
  companySchema,
} from '@/schema/company'

import {
  createCompany,
  updateCompany,
} from '../company'

import type { Tables } from '@/lib/supabase/database.types'

interface AddCompanyDialogProps {
  mode?: 'create' | 'edit'
  company?: Tables<'companies'>
  trigger?: React.ReactNode
}

export default function AddCompanyDialog({
  mode = 'create',
  company,
  trigger,
}: AddCompanyDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [logoPreview, setLogoPreview] = useState<string | null>(
    company?.logo_url ?? null
  )

  const [logoFile, setLogoFile] = useState<File | null>(null)

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name ?? '',
      phone: company?.phone ?? '',
      email: company?.email ?? '',
      commercial_registry:
        company?.commercial_registry ?? '',
    },
  })

  function handleLogoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]

    if (!file) return

    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  function handleRemoveLogo() {
    setLogoFile(null)
    setLogoPreview(null)
  }

  async function onSubmit(values: CompanyFormValues) {
    setLoading(true)
    setError(null)

    const result =
      mode === 'edit' && company
        ? await updateCompany(
            company.id,
            values,
            logoFile
          )
        : await createCompany(
            values,
            logoFile
          )

    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    setOpen(false)

    if (mode === 'create') {
      reset()
      setLogoPreview(null)
      setLogoFile(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger >
          {trigger}
        </DialogTrigger>
      ) : (
        <DialogTrigger>
          <Button
            type="button"
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-lg rounded-lg px-4 py-2 cursor-pointer"
          >
            + إضافة شركة جديدة
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit'
              ? 'تعديل بيانات الشركة'
              : 'إضافة شركة جديدة'}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <FormInput
              control={control}
              name="name"
              label="الاسم"
              placeholder="ادخل الاسم"
            />

            <FormInput
              control={control}
              name="phone"
              label="رقم الجوال"
              placeholder="ادخل رقم الجوال"
            />

            <FormInput
              control={control}
              name="email"
              label="الايميل"
              placeholder="ادخل الايميل"
              type="email"
            />

            <FormInput
              control={control}
              name="commercial_registry"
              label="رقم السجل التجاري"
              placeholder="ادخل رقم السجل التجاري"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="text-lg font-semibold block mb-2">
              شعار الشركة
            </label>

            {logoPreview ? (
              <div className="relative w-fit">
                <div className="relative w-17 h-17 overflow-hidden rounded-full border-2 border-gray-300">
                  <Image
                    src={logoPreview}
                    alt="logo preview"
                    fill
                    className="object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <>
                <label
                  htmlFor="company-logo"
                  className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-lg text-white rounded-lg px-4 py-1 cursor-pointer"
                >
                  تحميل الملف
                </label>

                <input
                  id="company-logo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </>
            )}
          </div>

          {error && (
            <p className="text-red-600 text-base">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-lg text-gray-700 rounded-lg py-4 cursor-pointer"
            >
              إلغاء
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-lg rounded-lg py-4 cursor-pointer disabled:opacity-50"
            >
              {loading
                ? 'جاري الحفظ...'
                : 'تأكيد الحفظ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}