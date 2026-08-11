'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createAuction } from '../auctionAssets'

export default function AddAuctionDialog({ companyId }: { companyId: string }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('الملف لازم يكون صورة')
      return
    }

    setError(null)
    setSelectedFile(file)

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setPreviewUrl(URL.createObjectURL(file))
  }

  function handleRemoveImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setSelectedFile(null)
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      // تفريغ البيانات عند الإغلاق لمنع التسريب في الذاكرة
      setName('')
      setCity('')
      setError(null)
      handleRemoveImage()
    }
  }

  async function handleConfirm() {
    setLoading(true)
    setError(null)

    const result = await createAuction(companyId, name, city, selectedFile)
    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    handleOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button className="bg-yellow-500 text-lg cursor-pointer hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg">
          + اضافة مزاد
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">اضافة مزاد جديد</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-base text-muted-foreground">
            لازم تضيف أصل واحد على الأقل داخل المزاد بعد إنشائه، وسيتم مراجعة المزاد
            والموافقة عليه من قِبل الإدارة قبل نشره للعامة.
          </p>

          <div>
            <label className="text-lg font-semibold block mb-1">
              اسم المزاد
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ادخل اسم المزاد"
            />
          </div>

          <div>
            <label className="text-lg font-semibold block mb-1">
              المدينة
            </label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="ادخل مدينة المزاد"
            />
          </div>

          <div>
            <label className="text-lg font-semibold block mb-1">
              صورة المزاد
            </label>

            {!previewUrl ? (
              <Button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-base my-2 cursor-pointer"
              >
                تحميل الملف
              </Button>
            ) : (
              <div className="relative w-fit">
                <img
                  src={previewUrl}
                  alt="صورة المزاد"
                  className="w-40 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-6 cursor-pointer h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button
            onClick={handleConfirm}
            disabled={loading || !name.trim() || !city.trim()}
            className="bg-blue-950 hover:bg-blue-900 text-white text-lg cursor-pointer rounded-lg py-3 disabled:opacity-50"
          >
            {loading ? 'جاري الإنشاء...' : 'تأكيد الإنشاء'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}