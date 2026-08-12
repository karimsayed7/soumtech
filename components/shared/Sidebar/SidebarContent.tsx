"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Heart,
  Wallet,
  Landmark,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  Building2,
} from "lucide-react";

import { signOutAction } from "@/features/auth/signOutAction";

const USER_NAVS = [
  {
    label: "المزادات المسجلة",
    icon: Heart,
    href: "/userDashboard/registeredAuctions",
  },
  {
    label: "محفظتى",
    icon: Wallet,
    href: "/userDashboard/myWallet",
  },
  {
    label: "مزاداتى",
    icon: Landmark,
    href: "/userDashboard/myAuctions",
  },
  {
    label: "الإعدادات",
    icon: Settings,
    href: "/userDashboard/settings",
  },
];

const ADMIN_NAVS = [
  {
    label: "كل المزادات",
    icon: LayoutDashboard,
    href: "/adminDashboard/allAuctions",
  },
  {
    label: "قائمة الموظفين",
    icon: Users,
    href: "/adminDashboard/employeesList",
  },
  {
    label: "الشركات",
    icon: Building2,
    href: "/adminDashboard/companies",
  },
  {
    label: "المستخدمين",
    icon: Users,
    href: "/adminDashboard/users",
  },
  {
    label: "الإعدادات",
    icon: Settings,
    href: "/adminDashboard/settings",
  },
];

type SidebarContentProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

export default function SidebarContent({
  collapsed = false,
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/adminDashboard");
  const navs = isAdminRoute ? ADMIN_NAVS : USER_NAVS;

  return (
    <div className="flex flex-col">
      {/* Logo */}
      <Link
        href="/"
        onClick={onNavigate}
        className="mb-15 mt-3 flex items-center justify-start md:justify-center mr-3 md:mr-0"
      >
        <Image
          src="/assets/Logo.svg"
          alt="logo"
          width={collapsed ? 40 : 80}
          height={collapsed ? 40 : 80}
          className="transition-all"
        />
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navs.map(({ label, icon: Icon, href }) => {
          const isActive =
            pathname === href ||
            pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center rounded-r-full py-3 transition-all ${
                isActive
                  ? "bg-white text-[#171D5B]"
                  : "text-white hover:bg-[#FFFFFF0F]"
              } ${
                collapsed
                  ? "justify-center px-0"
                  : "gap-3 pr-4 pl-2"
              }`}
            >
              <Icon
                size={22}
                className={isActive ? "text-red-500" : ""}
              />

              {!collapsed && (
                <span className="text-lg">
                  {label}
                </span>
              )}
            </Link>
          );
        })}

        {/* Logout */}
        <form action={signOutAction}>
          <button
            type="submit"
            onClick={onNavigate}
            className={`flex w-full cursor-pointer items-center rounded-r-full py-3 text-white transition hover:bg-[#FFFFFF0F] ${
              collapsed
                ? "justify-center px-0"
                : "gap-3 pr-4 pl-2"
            }`}
          >
            <LogOut size={22} />

            {!collapsed && (
              <span className="text-lg">
                تسجيل الخروج
              </span>
            )}
          </button>
        </form>
      </nav>
    </div>
  );
}