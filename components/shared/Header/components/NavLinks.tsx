"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavLinksProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

const baseLinks = [
  {
    href: "/",
    label: "الرئيسية",
  },
  {
    href: "/auctions",
    label: "المزادات",
  },
];

export default function NavLinks({
  isLoggedIn,
  isAdmin,
}: NavLinksProps) {
  const pathname = usePathname();

  const links = [
    ...baseLinks,

    ...(isLoggedIn
      ? [
          {
            href: "/userDashboard/registeredAuctions",
            label: "لوحة المستخدم",
          },

          ...(isAdmin
            ? [
                {
                  href: "/adminDashboard/allAuctions",
                  label: "لوحة الإدارة",
                },
              ]
            : []),
        ]
      : []),
  ];

  return (
    <nav className="flex items-center gap-6">
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href ||
              pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className="relative py-1 text-lg md:text-base"
          >
            <p
              className={cn(
                isActive
                  ? "text-[#171D5B] md:text-white"
                  : "text-gray-400"
              )}
            >
              {link.label}
            </p>

            {isActive && (
              <span className="absolute right-0 mt-[2px] h-[2px] w-1/2 animate-underline-grow bg-yellow-500" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}