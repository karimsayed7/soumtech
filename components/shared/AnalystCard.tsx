import Image from 'next/image';
import React from 'react'
interface analystCardProp {
    color: string;
    label: string;
    value: number | null;
    imgSrc: string;
}
function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(value)
}

export default function AnalystCard({color, label, value, imgSrc}: analystCardProp) {
  return (
    <div className='shadow-md max-w-100 border-t-4 border-green-600 rounded-xl p-4 flex items-center justify-between' style={{borderColor: color}}>
      <div>
        <div className="relative w-fit mb-10">
            <p className="text-lg font-extrabold">{label}</p>
            <span className="absolute mt-[2px] right-0 h-[4px] w-1/2 animate-underline-grow" style={{backgroundColor: color}}/>
        </div>

        <p className='font-bold text-2xl'>{formatCurrency(value ?? 0)} ر.س</p>
      </div>

      <Image src={imgSrc} alt={"wallet"} width={70} height={70}/>
    </div>
  )
}
