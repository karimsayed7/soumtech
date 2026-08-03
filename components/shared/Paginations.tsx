"use client";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { AuctionStatus } from "@/api/getAuctions";
import { usePathname, useRouter } from "next/navigation";

export function Paginations({
  status,
  currentPage,
  totalPages,
}: {
  status?: AuctionStatus;
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push(`${pathname}?status=${status}&page=${p}`, {
                  scroll: false,
                });
              }}
              isActive={p === currentPage}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
}