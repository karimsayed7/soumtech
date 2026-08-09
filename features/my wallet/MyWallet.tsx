import React from 'react'
import AnalystCard from '@/components/shared/AnalystCard'
import ReusableTable from '@/components/shared/Table/ReusableTable'
import WalletActionDialog from './WalletActionDialog'
import { topUpWallet, withdrawWallet } from './wallet'
import { renderInvoiceCell, INVOICE_TABLE_HEADERS } from '@/components/shared/Table/cells/invoice-cells'
import { createClient } from '@/lib/supabase/server'

export default async function MyWallet() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('wallet_balance, bank_account')
    .eq('id', userData.user?.id ?? '')
    .single()

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userData.user?.id ?? '')
    .order('invoice_date', { ascending: false })

  const walletBalance = Number(profile?.wallet_balance ?? 0)
  const bankAccount = Number(profile?.bank_account ?? 0)

  return (
    <div>
      <AnalystCard
        imgSrc="/assets/money.svg"
        label="اجمالى الرصيد المتاح"
        value={walletBalance}
        color="oklch(62.7% 0.194 149.214)"
      />

      <div className="flex items-center gap-5 my-10">
        <WalletActionDialog
          mode="topup"
          triggerLabel="شحن رصيد"
          walletBalance={walletBalance}
          bankBalance={bankAccount}
          action={topUpWallet}
        />
        <WalletActionDialog
          mode="withdraw"
          triggerLabel="سحب رصيد"
          walletBalance={walletBalance}
          bankBalance={bankAccount}
          action={withdrawWallet}
        />
      </div>

      <p className="mb-5 text-xl font-bold">الفواتير</p>

      {invoices && invoices.length > 0 ? (
        <ReusableTable
          th={INVOICE_TABLE_HEADERS}
          rows={invoices}
          getRowKey={(invoice) => invoice.id}
          renderCell={renderInvoiceCell}
        />
      ) : (
        <p className="text-center text-sm text-muted-foreground py-10">لا يوجد فواتير حتى الآن</p>
      )}
    </div>
  )
}