"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import SidebarContent from "./SidebarContent";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 bg-[#171D5B] md:block">
        <div className="h-full pr-3 pt-4">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="flex h-screen shrink-0 items-start bg-[#171D5B] px-3 pt-12 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <button
                type="button"
                className="cursor-pointer text-white"
                aria-label="فتح القائمة"
              >
                <Menu size={24} />
              </button>
            }
          />

          <SheetContent
            side="right"
            className="w-70 border-none bg-[#171D5B] pt-4 pr-3 text-white [&>button]:text-white"
          >
            <SidebarContent
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}