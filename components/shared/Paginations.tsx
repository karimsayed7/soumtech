"use client";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { usePathname, useRouter } from "next/navigation";

export function Paginations({
  status,
  currentPage,
  totalPages,
}: {
  status?: string; // مش محتاجة تعرف القيم بالظبط، هي بس بتحطها في الـ URL
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
                const query = status ? `status=${status}&page=${p}` : `page=${p}`;
                router.push(`${pathname}?${query}`, { scroll: false });
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