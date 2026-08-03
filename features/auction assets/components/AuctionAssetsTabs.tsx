"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, LayoutGrid, Map } from "lucide-react";

type ShownAs = "table" | "cards" | "map";

const TABS: { value: ShownAs; label: string; icon: React.ElementType }[] = [
  { value: "table", label: "القائمة", icon: List },
  { value: "cards", label: "البطاقات", icon: LayoutGrid },
  { value: "map", label: "الخريطة", icon: Map },
];

export default function AuctionAssetsTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const shownAs = (searchParams.get("shownAs") as ShownAs) ?? "table";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("shownAs", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={shownAs} onValueChange={handleChange} className="my-10">
      <TabsList className="h-auto gap-2 rounded-full bg-transparent p-0">
        {TABS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="flex items-center gap-2 text-black data-active:text-white bg-gray-100 data-active:bg-[#171D5B] p-3 rounded-lg cursor-pointer text-base [&:not([data-active])]:hover:bg-gray-200 data-active:hover:bg-[#171D5B]"
          >
            <Icon size={16} />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}