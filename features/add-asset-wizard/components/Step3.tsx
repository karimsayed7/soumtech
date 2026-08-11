'use client'

import { Control, useWatch } from 'react-hook-form'
import FormInput from '@/components/shared/Fields/InputField'
import type { WizardFormValues } from '@/schema/auctionWizard'

function getNowLocalString() {
  const now = new Date()
  // نطرح فرق التايم زون عشان toISOString ميرجعش UTC غلط بالنسبة للمستخدم
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return localTime.toISOString().slice(0, 16)
}

export default function Step3({ control }: { control: Control<WizardFormValues> }) {
  const openAt = useWatch({ control, name: 'open_at' })
  const minDateTime = getNowLocalString()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
      <FormInput
        control={control}
        name="open_at"
        label="موعد بداية المزاد"
        type="datetime-local"
        min={minDateTime}
      />
      <FormInput
        control={control}
        name="close_at"
        label="موعد نهاية المزاد"
        type="datetime-local"
        min={openAt || minDateTime}
      />
      <FormInput control={control} name="bid_increment" label="سعر فرق السوم" placeholder="ادخل فرق السوم" type="number" />
      <FormInput control={control} name="opening_price" label="سعر الافتتاح" placeholder="ادخل سعر الافتتاح" type="number" />
      <FormInput control={control} name="entry_deposit" label="العربون (عربون دخول محدد)" placeholder="ادخل العربون" type="number" />
    </div>
  )
}