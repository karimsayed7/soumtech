"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { SignInSchema, signInSchema } from "@/schema/Auth"
import Image from "next/image"
import FormInput from "@/components/shared/Fields/InputField"
import Link from "next/link"
import { useState, useTransition } from "react"
import { signInAction, adminDemoSignInAction } from "./action"

export default function SignIn() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(data: SignInSchema) {
    startTransition(async () => {
      const result = await signInAction(data)
      if (result?.error) setError(result.error)
    })
  }

  function handleAdminDemo() {
    startTransition(async () => {
      const result = await adminDemoSignInAction()
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center py-10 px-4">
      <Image src={"/assets/SignIn.png"} alt="sign in panner" fill className="object-cover -z-1"/>
      <Image src={"/assets/logo.svg"} alt="sign in panner" width={110} height={120} />

      <Card className="py-6 px-2 flex items-center justify-center mt-5 w-full max-w-md">
        <CardTitle className="text-[25px] font-extrabold mb-5">تسجيل الدخول</CardTitle>
        <CardContent className="w-full">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormInput control={form.control} name="email" label="الإيميل" />
            <FormInput control={form.control} name="password" label="كلمة المرور" type="password" />

            <Link href={"/ForgetPassword"}>
              <Button type="button" className="text-blue-800 px-0 hover:underline hover:cursor-pointer">
                نسيت كلمة المرور
              </Button>
            </Link>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 mt-10">
              <Button type="submit" disabled={isPending} className="py-6 px-6 sm:px-9 text-white hover:bg-yellow-600 hover:cursor-pointer bg-yellow-500">
                {isPending ? "جاري الدخول..." : "تسجيل الدخول"}
              </Button>
              <Button type="button" onClick={handleAdminDemo} disabled={isPending} className="py-6 px-4 sm:px-8 text-white hover:bg-yellow-600 hover:cursor-pointer bg-yellow-500">
                تسجيل دخول تجريبى كأدمن
              </Button>
            </div>

            <Link href={"/SignUp"} className="flex items-center justify-center">
              <Button type="button" className="py-6 mt-5 px-8 text-yellow-500 border-yellow-500 hover:bg-gray-50 hover:cursor-pointer bg-white">
                تسجيل حساب جديد من انفاذ
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-5 px-4">
        <Image src={"/assets/الهيئة العامة للعقار.svg"} alt="img" width={180} height={150} className="w-32 sm:w-[180px] h-auto"/>
        <Image src={"/assets/infath.svg"} alt="img" width={100} height={150} className="w-20 sm:w-[100px] h-auto"/>
      </div>
    </div>
  )
}