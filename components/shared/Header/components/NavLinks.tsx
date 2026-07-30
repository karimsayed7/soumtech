"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavLinksProps {
  isLoggedIn: boolean
  isAdmin: boolean
}

const baseLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/auctions", label: "المزادات" },
]

export default function NavLinks({ isLoggedIn, isAdmin }: NavLinksProps) {
  const pathname = usePathname()

  const links = [
    ...baseLinks,
    ...(isLoggedIn
      ? [
          isAdmin
            ? { href: "/admin/dashboard", label: "داشبورد الأدمن" }
            : { href: "/dashboard", label: "الداشبورد" },
        ]
      : []),
  ]

  return (
    <div className='flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8 text-[18px] md:text-[17px]'>
      {links.map((link) => {
        const isActive = pathname === link.href

        return (
          <Link key={link.href} href={link.href} className="relative py-1">
            <p className={cn(isActive ? "text-[#171D5B] md:text-white" : "text-gray-400 ")}>
              {link.label}
            </p>
            {isActive && (
              <span className="absolute mt-[2px] right-0 h-[1px] w-1/2 bg-yellow-500 animate-underline-grow" />
            )}
          </Link>
        )
      })}
    </div>
  )
}