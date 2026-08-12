import { createClient } from "@/lib/supabase/server"; 

import type { Tables } from "@/lib/supabase/database.types";

export type AuctionStatus = "ongoing" | "upcoming" | "ended";

export type AuctionListItem = Omit<Tables<"auctions_live">, "status"> & {
  status: AuctionStatus;
  companies: Pick<Tables<"companies">, "name" | "logo_url"> | null;
};

const PAGE_SIZE = 8;

export async function getAuctions(status: AuctionStatus, page: number) {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("auctions_live")
    .select("*, companies(name, logo_url)", { count: "exact" })
    .eq("status", status)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    auctions: (data ?? []) as AuctionListItem[],
    totalCount: count ?? 0,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
  };
}

export async function getAuctionById(auctionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("auctions_live")
    .select("*, companies(name, logo_url)")
    .eq("id", auctionId)
    .single();

  if (error) throw error;

  return data as AuctionListItem;
}