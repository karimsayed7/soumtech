'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const auctionIdSchema = z.string().uuid()

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Forbidden')
  return supabase
}

export async function approveAuction(auctionId: string) {
  const id = auctionIdSchema.parse(auctionId)
  const supabase = await assertAdmin()

  // لازم نجيب الـ static window الأول عشان نحسب منه الـ cycle
  const { data: current, error: fetchError } = await supabase
    .from('auctions')
    .select('static_open_at, static_close_at')
    .eq('id', id)
    .single()

  if (fetchError || !current?.static_open_at || !current?.static_close_at) {
    return { success: false, error: 'لا يمكن الموافقة: بيانات المزاد غير مكتملة (مواعيد البدء والانتهاء)' }
  }

  const cycleAnchor = current.static_open_at
  const cycleLengthSeconds = Math.floor(
    (new Date(current.static_close_at).getTime() - new Date(current.static_open_at).getTime()) / 1000
  )

  const { error } = await supabase
    .from('auctions')
    .update({
      status: 'upcoming',
      cycle_anchor: cycleAnchor,
      cycle_length_seconds: cycleLengthSeconds,
    })
    .eq('id', id)
    .eq('status', 'waiting_approval')

  if (error) return { success: false, error: error.message }

  revalidatePath('/auctions')
  revalidatePath('/adminDashboard/allAuctions')
  return { success: true }
}

export async function rejectAuction(auctionId: string) {
  const id = auctionIdSchema.parse(auctionId)
  const supabase = await assertAdmin()

  const { error } = await supabase
    .from('auctions')
    .update({ status: 'rejected' })
    .eq('id', id)
    .eq('status', 'waiting_approval')

  if (error) return { success: false, error: error.message }

  revalidatePath('/auctions')
  revalidatePath('/adminDashboard/allAuctions')
  return { success: true }
}