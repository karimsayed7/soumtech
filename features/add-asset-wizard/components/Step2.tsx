'use client'

import { Control } from 'react-hook-form'
// import FormInput from '@/components/shared/Form/FormInput'
import FormInput from '@/components/shared/Fields/InputField'
import type { WizardFormValues } from '@/schema/auctionWizard'

export default function Step2({ control }: { control: Control<WizardFormValues> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
      <FormInput control={control} name="boundary_north" label="شمالاً" placeholder="ادخل الحد الشمالي" />
      <FormInput control={control} name="boundary_south" label="جنوباً" placeholder="ادخل الحد الجنوبي" />
      <FormInput control={control} name="boundary_east" label="شرقاً" placeholder="ادخل الحد الشرقي" />
      <FormInput control={control} name="boundary_west" label="غرباً" placeholder="ادخل الحد الغربي" />
      <FormInput control={control} name="area_sqm" label="مساحة العقار م²" placeholder="ادخل المساحة" type="number" />
      <FormInput control={control} name="deed_number" label="رقم الصك" placeholder="ادخل رقم الصك" />
    </div>
  )
}