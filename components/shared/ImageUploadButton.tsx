'use client'

import { useRef, useState } from 'react'
import { uploadProfileImage } from '@/features/settings/profile'

interface ImageUploadButtonProps {
  kind: 'avatar' | 'banner'
  onUploaded: (url: string) => void
  children: React.ReactNode
}

export default function ImageUploadButton({ kind, onUploaded, children }: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    const result = await uploadProfileImage(file, kind)

    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    if (result.url) onUploaded(result.url)
    e.target.value = ''
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="disabled:opacity-50"
      >
        {children}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </>
  )
}