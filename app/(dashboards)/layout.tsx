import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import DashboardHeader from "@/components/shared/Header/DashboardHeader";
import Sidebar from "@/components/shared/Sidebar/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="bg-[#171D5B] p-4 pr-0 w-full">
        <div className="bg-white rounded-2xl h-full px-5 sm:px-10">
          <DashboardHeader />
          <div className="py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}