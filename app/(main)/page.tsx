import HomePage from "@/features/home/Home";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  return <HomePage searchParams={searchParams} />;
}