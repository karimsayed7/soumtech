"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ForgetPasswordSchema, forgetPasswordSchema } from "@/schema/Auth"
import Image from "next/image"
import FormInput from "@/components/shared/Fields/InputField"
import Link from "next/link"
import { forgetPasswordAction } from "./action"

export default function ForgetPassword() {
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<ForgetPasswordSchema>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: { email: "" },
  })

  function onSubmit(data: ForgetPasswordSchema) {
    setError(null)
    startTransition(async () => {
      const result = await forgetPasswordAction(data)
      if (result?.error) setError(result.error)
      else setSent(true)
    })
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center py-10 px-4">
      <Image src={"/assets/SignIn.png"} alt="sign in panner" fill className="object-cover -z-1"/>
      <Image src={"/assets/logo.svg"} alt="sign in panner" width={110} height={120} />

      <Card className="py-6 px-2 flex items-center justify-center mt-5 w-full max-w-md">
        <CardTitle className="text-[25px] font-extrabold mb-5">استعادة كلمة المرور</CardTitle>
        <CardContent className="w-full">
          {sent ? (
            <p className="text-gray-600 text-center max-w-xs mx-auto text-[18px]">
              اذا كان الايميل مسجل لدينا ستصلك رسالة بها رابط لاستعادة كلمة المرور
            </p>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormInput control={form.control} name="email" label="الإيميل" />

              {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

              <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-5 mt-10">
                <Button type="submit" disabled={isPending} className="py-6 text-lg flex-1 text-white hover:bg-yellow-600 hover:cursor-pointer bg-yellow-500">
                  {isPending ? "جاري الإرسال..." : "استمرار"}
                </Button>
                <Link href={"/SignIn"} className="flex-1">
                  <Button type="button" className="py-6 w-full text-yellow-500 text-lg border-yellow-500 hover:bg-gray-50 hover:cursor-pointer bg-white">
                    رجوع
                  </Button>
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-5 px-4">
        <Image src={"/assets/الهيئة العامة للعقار.svg"} alt="img" width={180} height={150} className="w-32 sm:w-[180px] h-auto"/>
        <Image src={"/assets/infath.svg"} alt="img" width={100} height={150} className="w-20 sm:w-[100px] h-auto"/>
      </div>
    </div>
  )
}