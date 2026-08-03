import Image from 'next/image'
import React from 'react'

export default function AuctionAssetsPanner({
  auctionName,
  assetsCount,
}: {
  auctionName: string | null
  assetsCount: number | null
}) {
  return (
    <div>
          <div className="relative w-fit mx-10 mt-10">
            <p className="text-[27px] font-extrabold text-[#171D5B]">المزادات</p>
            <span className="absolute mt-[2px] right-0 h-[4px] w-1/2 bg-yellow-500 animate-underline-grow" />
          </div>
          <div className="relative left-1/2 right-1/2 -mx-[51vw] w-screen bg-[#F3F4F6] mt-2">
            <div className="max-w-[1300px] mx-auto py-5 flex items-center justify-between px-18 sm:px-22">
              <div>
                <p className="text-[20px] font-extrabold text-[#171D5B]">
                  {auctionName}
                </p>
                <div className="flex items-center gap-2 text-[#171D5B]">
                  <Image
                    src="/assets/assetsLogo.svg"
                    className="-mt-1"
                    alt="assetsLogo"
                    width={16}
                    height={20}
                  />
                  <span className="text-lg ">عدد الأصول </span>
                  <span className="text-red-500 font-semibold ">
                    ({assetsCount})
                  </span>
                </div>
              </div>
    
              <div className="md:flex items-center gap-5 hidden">
                <Image
                  src="/assets/infath-dark.svg"
                  alt="logo1"
                  width={80}
                  height={20}
                />
                <Image
                  src="/assets/jenan.svg"
                  alt="logo2"
                  width={90}
                  height={20}
                />
              </div>
            </div>
          </div>
    </div>
  )
}