"use client"

import { useEffect, useState } from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import NavLinks from "./NavLinks"
import WalletBalance from "./WalletBalance"
import ProfileSection from "./ProfileSection"

import { HeaderProfile } from "@/lib/supabase/types"

interface MobileNavProps {
  isLoggedIn: boolean
  isAdmin: boolean
  profile: HeaderProfile | null
}

export default function MobileNav({
  isLoggedIn,
  isAdmin,
  profile,
}: MobileNavProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
  const mediaQuery = window.matchMedia("(min-width: 768px)")

  const handleChange = (event: MediaQueryListEvent) => {
    if (event.matches && open) {
      setOpen(false)
    }
  }

  mediaQuery.addEventListener("change", handleChange)

  return () => {
    mediaQuery.removeEventListener("change", handleChange)
  }
}, [open])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            className="h-12 w-12 text-[#171D5B] hover:bg-transparent hover:text-yellow-600 scale-170 cursor-pointer"
          >
            <Menu className="h-8 w-8" />
          </Button>
        }
      />

      <SheetContent
        side="top"
        className="bg-white text-[#171D5B] border-none py-8"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>القائمة</SheetTitle>
        </SheetHeader>

        <div
          className="mt-6 flex flex-col gap-8 px-4"
          onClick={() => setOpen(false)}
        >
          <div className="border-b-2 border-gray-200 pb-5">
            <ProfileSection
              isLoggedIn={isLoggedIn}
              profile={profile}
            />
          </div>

          <NavLinks
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
          />

          <WalletBalance
            profile={profile}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}