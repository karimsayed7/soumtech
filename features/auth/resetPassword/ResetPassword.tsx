"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ResetPasswordSchema, resetPasswordSchema } from "@/schema/Auth"
import Image from "next/image"
import FormInput from "@/components/shared/Fields/InputField"
import { resetPasswordAction } from "./action"

export default function ResetPassword() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  function onSubmit(data: ResetPasswordSchema) {
    setError(null)
    startTransition(async () => {
      const result = await resetPasswordAction(data)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      <Image src={"/assets/SignIn.png"} alt="sign in panner" fill className="object-cover -z-1"/>
      <Image src={"/assets/logo.svg"} alt="sign in panner" width={110} height={120} />
      <Card className="py-6 px-2 flex items-center justify-center mt-5">
        <CardTitle className="text-[25px] font-extrabold mb-5">تعيين كلمة مرور جديدة</CardTitle>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormInput control={form.control} name="password" label="كلمة المرور الجديدة" />
            <FormInput control={form.control} name="confirmPassword" label="تأكيد كلمة المرور" />

            {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

            <div className="flex items-center justify-center mt-10">
              <Button type="submit" disabled={isPending} className="py-6 px-10 text-white hover:bg-yellow-600 hover:cursor-pointer bg-yellow-500">
                {isPending ? "جاري الحفظ..." : "تأكيد"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}