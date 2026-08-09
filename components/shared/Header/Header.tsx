import ProfileSection from "./components/ProfileSection";
import Logo from "./components/Logo";
import NavLinks from "./components/NavLinks";
import WalletBalance from "./components/WalletBalance";
import MobileNav from "./components/MobileNav";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, wallet_balance, role")
      .eq("id", user.id)
      .single();

    profile = data;
  }

  const isLoggedIn = !!user;
  const isAdmin = profile?.role === "admin";

  return (
    <>
      {/* Desktop */}
      <header className="hidden md:grid md:grid-cols-3 items-center py-3 px-10 max-w-355 mx-auto text-white bg-[#171D5B]">
        {/* Left */}
        <div className="flex items-center gap-7 justify-start">
          <Logo />
          <WalletBalance
            profile={profile}
            isLoggedIn={isLoggedIn}
            iconClassName="text-white"
          />
        </div>

        {/* Center */}
        <div className="flex justify-center">
          <NavLinks
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
          />
        </div>

        {/* Right */}
        <div className="flex justify-end">
          <ProfileSection
            isLoggedIn={isLoggedIn}
            profile={profile}
          />
        </div>
      </header>

      {/* Mobile */}
      <header className="flex md:hidden items-center justify-between py-3 pb-8 pt-6 px-4 text-[#171D5B] bg-white">
        <Logo />

        <MobileNav
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          profile={profile}
        />
      </header>
    </>
  );
}