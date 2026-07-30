
import { Database } from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type WalletTransaction = Database['public']['Tables']['wallet_transactions']['Row'];

export type HeaderProfile = Pick<Profile, 'full_name' | 'avatar_url' | 'wallet_balance' | 'role'>