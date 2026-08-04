"use client"

interface AssetLabelProps {
    label: string 
    value: string | null
}

export default function AssetDetailsLabel({label, value} : AssetLabelProps) {
  return (
    <div className='flex items-center mb-3'>
        <p className='text-nowrap font-bold w-25'>{label}</p>
        <p className='p-2 rounded-md border-2 border-gray-200 w-full bg-gray-50'>{value}</p>
    </div>
  )
}
