import React from 'react'
import Image from 'next/image'

export default function HomePanner() {
  return (
    <div className="relative w-full max-w-[1150px] h-[300px] mx-auto overflow-hidden rounded-xl">
        <Image
          src="/assets/SignIn.png"
          alt="Sign in banner"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            أضف سومتك وين ما كنت!
          </h1>

          <p className="mt-4 text-base md:text-lg text-white/90 max-w-2xl mb-10">
            منصة سومتك تجمع لك بين عرض العقارات أو المشاركة في المزاد اتسهلة وسريعة في بيئة إلكترونية موثوقة! 
          </p>

          <Image src="/assets/panner logos.png" alt="panner logos" width={400} height={500}/>
        </div>
    </div>
  )
}
