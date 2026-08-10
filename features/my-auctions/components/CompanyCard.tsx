'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import AddCompanyDialog from './AddCompanyDialog'
import { deleteCompany } from '../company'
import type { Tables } from '@/lib/supabase/database.types'

export default function CompanyCard({
  company,
}: {
  company: Tables<'companies'>
}) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)

    const result = await deleteCompany(company.id)

    setDeleting(false)

    if (!result.success) {
      console.error(result.error)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      {/* Company details */}
      <Link href={`/userDashboard/myAuctions/${company.id}`}>
        <div className="relative h-30 w-full">
          <Image
            src="/assets/company.svg"
            alt={company.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="px-4 py-3">
          <h3 className="text-lg font-semibold">
            {company.name}
          </h3>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center justify-between border-t px-4 py-2">
        {/* Delete */}
        <AlertDialog>
          <AlertDialogTrigger>
            <button
              type="button"
              disabled={deleting}
              className="flex items-center gap-1 text-lg text-red-500 cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={14} />
              حذف
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg">
                هل أنت متأكد من حذف الشركة؟
              </AlertDialogTitle>

              <AlertDialogDescription className="text-base text-right">
                سيتم حذف شركة{' '}
                <span className="font-semibold text-gray-900">
                  {company.name}
                </span>
                {' '}نهائيًا، ولا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className='flex items-center justify-between'>
              <AlertDialogCancel className="text-lg cursor-pointer">
                إلغاء
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-500 text-lg cursor-pointer hover:bg-red-600 text-white"
              >
                {deleting ? 'جاري الحذف...' : 'تأكيد الحذف'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit */}
        <AddCompanyDialog
          mode="edit"
          company={company}
          trigger={
            <button
              type="button"
              className="flex items-center gap-1 text-lg text-blue-600 cursor-pointer"
            >
              <Pencil size={14} />
              تعديل
            </button>
          }
        />
      </div>
    </div>
  )
}