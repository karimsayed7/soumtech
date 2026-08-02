export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          area_sqm: number
          auction_id: string
          bid_increment: number
          bids_count: number
          boundary_east: string | null
          boundary_north: string | null
          boundary_south: string | null
          boundary_west: string | null
          contact_number: string | null
          created_at: string
          current_bid_price: number
          deed_number: string
          description: string | null
          district: string
          entry_deposit: number
          id: string
          images: string[]
          lat: number
          lng: number
          opening_price: number
          price_per_meter: number
          property_name: string
          property_type: string
          saay_amount: number
          saay_tax: number
          street: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          area_sqm: number
          auction_id: string
          bid_increment: number
          bids_count?: number
          boundary_east?: string | null
          boundary_north?: string | null
          boundary_south?: string | null
          boundary_west?: string | null
          contact_number?: string | null
          created_at?: string
          current_bid_price: number
          deed_number: string
          description?: string | null
          district: string
          entry_deposit: number
          id?: string
          images?: string[]
          lat: number
          lng: number
          opening_price: number
          price_per_meter: number
          property_name: string
          property_type: string
          saay_amount: number
          saay_tax: number
          street: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          area_sqm?: number
          auction_id?: string
          bid_increment?: number
          bids_count?: number
          boundary_east?: string | null
          boundary_north?: string | null
          boundary_south?: string | null
          boundary_west?: string | null
          contact_number?: string | null
          created_at?: string
          current_bid_price?: number
          deed_number?: string
          description?: string | null
          district?: string
          entry_deposit?: number
          id?: string
          images?: string[]
          lat?: number
          lng?: number
          opening_price?: number
          price_per_meter?: number
          property_name?: string
          property_type?: string
          saay_amount?: number
          saay_tax?: number
          street?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions_live"
            referencedColumns: ["id"]
          },
        ]
      }
      auctions: {
        Row: {
          assets_count: number
          banner_image: string | null
          city: string
          company_id: string | null
          created_at: string
          cycle_anchor: string | null
          cycle_length_seconds: number | null
          deal_number: number
          id: string
          name: string
          static_close_at: string | null
          static_open_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assets_count?: number
          banner_image?: string | null
          city: string
          company_id?: string | null
          created_at?: string
          cycle_anchor?: string | null
          cycle_length_seconds?: number | null
          deal_number: number
          id?: string
          name: string
          static_close_at?: string | null
          static_open_at?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          assets_count?: number
          banner_image?: string | null
          city?: string
          company_id?: string | null
          created_at?: string
          cycle_anchor?: string | null
          cycle_length_seconds?: number | null
          deal_number?: number
          id?: string
          name?: string
          static_close_at?: string | null
          static_open_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "auctions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          commercial_registry: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          commercial_registry?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          commercial_registry?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bank_account: string
          birth_date: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          wallet_balance: number
        }
        Insert: {
          avatar_url?: string | null
          bank_account?: string
          birth_date?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          wallet_balance?: number
        }
        Update: {
          avatar_url?: string | null
          bank_account?: string
          birth_date?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          wallet_balance?: number
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          id: string
          reference: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          id?: string
          reference?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          id?: string
          reference?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      auctions_live: {
        Row: {
          assets_count: number | null
          banner_image: string | null
          city: string | null
          company_id: string | null
          created_at: string | null
          current_close_at: string | null
          current_open_at: string | null
          cycle_anchor: string | null
          cycle_length_seconds: number | null
          deal_number: number | null
          id: string | null
          name: string | null
          remaining_seconds: number | null
          static_close_at: string | null
          static_open_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assets_count?: number | null
          banner_image?: string | null
          city?: string | null
          company_id?: string | null
          created_at?: string | null
          current_close_at?: never
          current_open_at?: never
          cycle_anchor?: string | null
          cycle_length_seconds?: number | null
          deal_number?: number | null
          id?: string | null
          name?: string | null
          remaining_seconds?: never
          static_close_at?: string | null
          static_open_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assets_count?: number | null
          banner_image?: string | null
          city?: string | null
          company_id?: string | null
          created_at?: string | null
          current_close_at?: never
          current_open_at?: never
          cycle_anchor?: string | null
          cycle_length_seconds?: number | null
          deal_number?: number | null
          id?: string | null
          name?: string | null
          remaining_seconds?: never
          static_close_at?: string | null
          static_open_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auctions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      adjust_wallet_balance: {
        Args: {
          p_amount: number
          p_reference?: string
          p_type: string
          p_user_id: string
        }
        Returns: number
      }
      deposit_to_wallet: {
        Args: { p_amount: number; p_reference?: string }
        Returns: number
      }
      pay_from_wallet: {
        Args: { p_amount: number; p_reference?: string; p_type: string }
        Returns: number
      }
      withdraw_from_wallet: {
        Args: { p_amount: number; p_reference?: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const