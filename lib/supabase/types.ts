
import { Database } from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type WalletTransaction = Database['public']['Tables']['wallet_transactions']['Row'];

export type HeaderProfile = Pick<Profile, 'full_name' | 'avatar_url' | 'wallet_balance' | 'role'>

type Asset = Database['public']['Tables']['assets']['Row']
type AuctionLive = Database['public']['Views']['auctions_live']['Row']

export type AssetWithAuction = Asset & {
  auction: AuctionLive | null
}