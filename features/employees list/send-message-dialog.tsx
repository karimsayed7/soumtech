'use client'

import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import {
  Field,
  FieldError,
} from '@/components/ui/field'

import { toast } from 'sonner'
import {
  messageSchema,
  type MessageFormValues,
} from '@/schema/message'

import type { Employee } from './constants/employees'

interface SendMessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee | null
  type: 'sms' | 'email'
}

export function SendMessageDialog({
  open,
  onOpenChange,
  employee,
  type,
}: SendMessageDialogProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: '',
    },
  })

  function onSubmit(values: MessageFormValues) {
    startTransition(async () => {
      // mock فقط — مفيش استدعاء فعلي
      await new Promise((resolve) => setTimeout(resolve, 600))

      toast.success(
        type === 'sms'
          ? `تم إرسال الرسالة النصية إلى ${employee?.name}`
          : `تم إرسال البريد الإلكتروني إلى ${employee?.name}`
      )

      form.reset()
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle>
            {type === 'sms'
              ? 'إرسال رسالة نصية'
              : 'إرسال بريد إلكتروني'}

            {employee && (
              <span className="mt-1 block text-sm text-muted-foreground">
                إلى: {employee.name}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Controller
            name="message"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="اكتب رسالتك هنا..."
                  rows={5}
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? 'جارٍ الإرسال...' : 'إرسال'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}