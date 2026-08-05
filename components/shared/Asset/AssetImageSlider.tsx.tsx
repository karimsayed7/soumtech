// features/bidding-page/components/AssetImageSlider.tsx
'use client'

import { useSyncExternalStore, useState, useCallback } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { ImageWithFallback } from '../Imagewithfallback'

function useCarouselCurrentSlide(api: CarouselApi | undefined) {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (!api) return () => {}
      api.on('select', callback)
      api.on('reInit', callback)
      return () => {
        api.off('select', callback)
        api.off('reInit', callback)
      }
    },
    [api]
  )

  const getSnapshot = useCallback(() => {
    return api?.selectedScrollSnap() ?? 0
  }, [api])

  return useSyncExternalStore(subscribe, getSnapshot, () => 0)
}

export default function AssetImageSlider({ images }: { images: string[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const current = useCarouselCurrentSlide(api)

  if (images.length === 0) {
    return (
      <div className='relative w-full h-full rounded-xl bg-gray-100 flex items-center justify-center'>
        <p className='text-gray-400'>لا توجد صور</p>
      </div>
    )
  }

  return (
    <div className='relative w-full'>
      <Carousel opts={{ loop: true }} setApi={setApi} className='w-full'>
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={src}>
              <div className='relative w-full h-70 rounded-xl overflow-hidden'>
                <ImageWithFallback
                  src={src}
                  alt={`صورة ${index + 1}`}
                  fill
                  className='object-cover'
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <button
          onClick={() => api?.scrollPrev()}
          className='absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition'
          aria-label='الصورة السابقة'
        >
          <ChevronLeft className='h-5 w-5 text-gray-700' />
        </button>
        <button
          onClick={() => api?.scrollNext()}
          className='absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition'
          aria-label='الصورة التالية'
        >
          <ChevronRight className='h-5 w-5 text-gray-700' />
        </button>
      </Carousel>

      <div className='mt-3 flex items-center justify-center gap-2'>
        {images.map((src, index) => (
          <button
            key={src}
            onClick={() => api?.scrollTo(index)}
            aria-label={`اذهب للصورة ${index + 1}`}
            className={`h-2 rounded-full transition-all ${
              index === current ? 'w-5 bg-orange-600' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}