"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AuctionStatus } from "@/features/auctions/api/getAuctions";

const TABS: { value: AuctionStatus; label: string }[] = [
  { value: "ongoing", label: "القائمة" },
  { value: "upcoming", label: "القادمة" },
  { value: "ended", label: "المنتهية" },
];

export function AuctionTabsNav({ current }: { current: AuctionStatus }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <Tabs value={current} onValueChange={handleChange} dir="rtl">
      <TabsList variant="custom">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}