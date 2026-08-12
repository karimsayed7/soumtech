export type AuctionStatus =
  | "waiting_approval"
  | "upcoming"
  | "ongoing"
  | "ended"
  | "rejected";

export type LiveAuctionStatus = "ongoing" | "upcoming" | "ended";

export const AUCTION_STATUS_LABELS: Record<AuctionStatus, string> = {
  waiting_approval: "بانتظار الموافقة",
  upcoming: "قادم",
  ongoing: "قائم",
  ended: "منتهى",
  rejected: "مرفوض",
};

export interface AuctionRow {
  id: string;
  name: string;
  city: string;
  status: AuctionStatus;
  assets_count: number;
  company_name: string | null;
  remaining_seconds: number | null;
  current_open_at: string | null;
}

export interface AuctionsQueryParams {
  search?: string;
  status?: AuctionStatus | "all";
  page?: number;
}

export interface AuctionCounts {
  total: number;
  ongoing: number;
  upcoming: number;
  waiting_approval: number;
  ended: number;
}