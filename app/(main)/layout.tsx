import Header from "@/components/shared/Header/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-white md:bg-[#171D5B]">
        <Header />
      </div>

      <main className=" max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}