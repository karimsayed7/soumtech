// app/actions/wallet.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type WalletActionResult =
  | { success: true; newWalletBalance: number; newBankAccount: number; invoiceNumber: string }
  | { success: false; error: string }

async function runWalletRpc(
  fn: 'wallet_topup' | 'wallet_withdraw',
  amount: number
): Promise<WalletActionResult> {
  const supabase = await createClient()

  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData.user) {
    return { success: false, error: 'لازم تسجل الدخول الأول' }
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: 'المبلغ لازم يكون رقم أكبر من صفر' }
  }

  const { data, error } = await supabase
    .rpc(fn, { p_user_id: userData.user.id, p_amount: amount })
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/wallet')

    return {
    success: true,
    newWalletBalance: Number(data.new_wallet_balance),
    newBankAccount: Number(data.new_bank_account),
    invoiceNumber: data.invoice_number,
    }
}

export async function topUpWallet(amount: number) {
  return runWalletRpc('wallet_topup', amount)
}

export async function withdrawWallet(amount: number) {
  return runWalletRpc('wallet_withdraw', amount)
}