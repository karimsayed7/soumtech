'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { MoreVertical } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import type { AuctionRow } from '../types'
import { approveAuction, rejectAuction } from '../auctionActions'
import AuctionDetailsDialog from './AuctionDetailsDialog'

type ConfirmAction = 'approve' | 'reject' | null

export default function AuctionActionsMenu({ auction }: { auction: AuctionRow }) {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleConfirm(e: React.MouseEvent) {
    e.preventDefault()
    if (!confirmAction) return
    const action = confirmAction === 'approve' ? approveAuction : rejectAuction

    startTransition(async () => {
      try {
        const result = await action(auction.id)
        if (result.success) {
          toast.success(confirmAction === 'approve' ? 'تمت الموافقة على المزاد' : 'تم رفض المزاد')
          router.refresh()
        } else {
          toast.error(result.error ?? 'حدث خطأ، حاول مرة أخرى')
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
      } finally {
        setConfirmAction(null)
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-1 rounded hover:bg-gray-100" aria-label="خيارات">
          <MoreVertical className="h-5 w-5 text-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-lg" onClick={() => setDetailsOpen(true)}>التفاصيل</DropdownMenuItem>
          {auction.status === 'waiting_approval' && (
            <>
              <DropdownMenuItem  className="text-lg" onClick={() => setConfirmAction('approve')}>
                الموافقة على المزاد
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 text-lg"
                onClick={() => setConfirmAction('reject')}
              >
                رفض المزاد
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AuctionDetailsDialog auctionId={auction.id} open={detailsOpen} onOpenChange={setDetailsOpen} />

      <AlertDialog open={confirmAction !== null} onOpenChange={(open) => !open && !isPending && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === 'approve' ? 'تأكيد الموافقة على المزاد' : 'تأكيد رفض المزاد'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === 'approve'
                ? `سيتم نقل "${auction.name}" إلى المزادات القادمة.`
                : `سيتم رفض "${auction.name}" ولن يظهر للمستخدمين.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
              {isPending ? 'جاري التنفيذ...' : 'تأكيد'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}