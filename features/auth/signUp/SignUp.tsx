"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { SignUpSchema, signUpSchema } from "@/schema/Auth"
import Image from "next/image"
import FormInput from "@/components/shared/Fields/InputField"
import Link from "next/link"
// import { signUpAction } from "/actions"
import { signUpAction } from "./action"

export default function SignUp() {
  const [error, setError] = useState<string | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", phone: "", email: "", password: "" },
  })

  function onSubmit(data: SignUpSchema) {
    setError(null)
    startTransition(async () => {
      const result = await signUpAction(data)
      if (result?.error) {
        setError(result.error)
      } else {
        setSubmittedEmail(data.email)
      }
    })
  }

  if (submittedEmail) {
    return (
      <div className="relative w-full h-screen flex flex-col items-center justify-center">
        <Image src={"/assets/SignIn.png"} alt="sign in panner" fill className="object-cover -z-1"/>
        <Card className="py-10 px-8 text-center max-w-md">
          <CardTitle className="text-[22px] font-extrabold mb-4">تحقق من إيميلك</CardTitle>
          <CardContent>
            <p className="text-gray-600 text-[18px] ">
              تم ارسال رابط تأكيد على <span className="font-semibold">{submittedEmail}</span>.
              تحقق من الإيميل واضغط على <span className="font-semibold">confirm</span>  لتفعيل حسابك.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      <Image src={"/assets/SignIn.png"} alt="sign in panner" fill className="object-cover -z-1"/>
      <Image src={"/assets/logo.svg"} alt="sign in panner" width={110} height={120} />
      <Card className="py-6 px-2 flex items-center justify-center mt-5">
        <CardTitle className="text-[25px] font-extrabold mb-5">تسجيل حساب جديد</CardTitle>
        <CardContent>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FormInput control={form.control} name="name" label="الاسم" />
            <FormInput control={form.control} name="phone" label="رقم الهاتف" />
            <FormInput control={form.control} name="email" label="الإيميل" />
            <FormInput control={form.control} name="password" label="كلمة المرور" type="password"/>

            {error && (
              <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
            )}

            <Link href={"/SignIn"}>
              <Button type="button" className="text-blue-800 px-0 hover:underline hover:cursor-pointer">
                تسجيل الدخول
              </Button>
            </Link>

            <div className="mt-8 flex items-center justify-center">
              <Button
                type="submit"
                disabled={isPending}
                className="py-6 px-8 text-yellow-500 border-yellow-500 hover:bg-gray-50 hover:cursor-pointer bg-white"
              >
                {isPending ? "جاري إنشاء الحساب..." : "تسجيل حساب جديد"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}