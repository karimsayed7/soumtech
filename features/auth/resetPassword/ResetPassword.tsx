"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ResetPasswordSchema, resetPasswordSchema } from "@/schema/Auth"
import Image from "next/image"
import FormInput from "@/components/shared/Fields/InputField"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function ResetPassword() {
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  function onSubmit(data: ResetPasswordSchema) {
    setError(null)
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: data.password })
      if (error) {
        setError("تعذر تحديث كلمة المرور، حاول مرة أخرى")
      } else {
        router.push("/")
      }
    })
  }

  if (!ready) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-500">جاري التحقق من الرابط...</p>
      </div>
    )
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