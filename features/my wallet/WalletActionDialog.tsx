// components/shared/Wallet/WalletActionDialog.tsx
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

type Mode = 'topup' | 'withdraw'

interface WalletActionDialogProps {
  mode: Mode
  triggerLabel: string
  walletBalance: number
  bankBalance: number
  action: (amount: number) => Promise<
  | { success: true; newWalletBalance: number; newBankAccount: number; invoiceNumber: string }
  | { success: false; error: string }
>
}

export default function WalletActionDialog({
  mode,
  triggerLabel,
  walletBalance,
  bankBalance,
  action,
}: WalletActionDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const numericAmount = Number(amount)
  const isTopup = mode === 'topup'
  const limitLabel = isTopup ? 'رصيدك البنكي' : 'رصيد محفظتك'
  const limitValue = isTopup ? bankBalance : walletBalance

  // Edge cases بتتفحص أول بأول عشان الزرار يتعطل قبل حتى ما نبعت الطلب
  const isAmountEmpty = amount.trim() === ''
  const isAmountInvalid = !isAmountEmpty && (!Number.isFinite(numericAmount) || numericAmount <= 0)
  const exceedsLimit = !isAmountInvalid && !isAmountEmpty && numericAmount > limitValue
  const canSubmit = !isAmountEmpty && !isAmountInvalid && !exceedsLimit && !loading

  function resetAndClose() {
    setAmount('')
    setError(null)
    setOpen(false)
  }

  async function handleConfirm() {
    if (!canSubmit) return
    setLoading(true)
    setError(null)

    const result = await action(numericAmount)

    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    resetAndClose()
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : resetAndClose())}>
      <DialogTrigger>
        <Button className="text-white transition hover:bg-yellow-600 bg-yellow-500 rounded-lg flex items-center justify-center p-3 text-center cursor-pointer text-lg">
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#171D5B]">{isTopup ? 'شحن رصيد المحفظة' : 'سحب رصيد من المحفظة'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-5">
          <div className="flex justify-between text-base bg-gray-50 rounded-lg p-3">
            <span className="text-muted-foreground">رصيد المحفظة الحالي</span>
            <span className="font-bold">{formatCurrency(walletBalance)} ر.س</span>
          </div>

          <div className="flex justify-between text-base bg-gray-50 rounded-lg p-3">
            <span className="text-muted-foreground">{isTopup ? 'رصيدك البنكي' : 'الحساب البنكي المستقبِل'}</span>
            <span className="font-bold">{formatCurrency(bankBalance)} ر.س</span>
          </div>

          <div className="flex flex-col gap-1 mt-5">
            <label className="text-lg font-semibold">
              {isTopup ? 'المبلغ اللي عايز تشحنه' : 'المبلغ اللي عايز تسحبه'}
            </label>
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={loading}
            />
            {exceedsLimit && (
              <p className="text-red-600 text-base">
                المبلغ أكبر من {limitLabel} المتاح ({formatCurrency(limitValue)} ر.س)
              </p>
            )}
            {isAmountInvalid && (
              <p className="text-red-600 text-base">اكتب مبلغ صحيح أكبر من صفر</p>
            )}
            {error && <p className="text-red-600 text-base">{error}</p>}
          </div>

          <Button
            onClick={handleConfirm}
            disabled={!canSubmit}
            className="bg-blue-950 hover:bg-blue-950 text-white rounded-lg py-5 disabled:opacity-50 disabled:cursor-not-allowed text-lg cursor-pointer"
          >
            {loading ? 'جاري التنفيذ...' : 'تأكيد'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}