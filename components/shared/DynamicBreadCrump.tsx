"use client";

import Link from "next/link";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface DynamicBreadcrumbProps {
  items: BreadcrumbItemType[];
}

export default function DynamicBreadcrumb({
  items,
}: DynamicBreadcrumbProps) {
  return (
    <Breadcrumb className="py-5 md:py-8">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              {index > 0 && <BreadcrumbSeparator />}

              <BreadcrumbItem className="text-lg font-bold">
                {isLast || !item.href ? (
                  <BreadcrumbPage className="font-bold underline text-[#1E66F2]">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink>
                    <Link href={item.href} className="text-[#171D5B]">{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}