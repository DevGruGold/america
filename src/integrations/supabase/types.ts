export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artworks: {
        Row: {
          created_at: string
          creator_id: string | null
          description: string | null
          id: string
          image_url: string
          title: string
          token_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          image_url: string
          title: string
          token_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          image_url?: string
          title?: string
          token_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          car_id: string
          created_at: string
          end_date: string
          id: string
          renter_id: string
          start_date: string
          status: string
          total_price: number
          updated_at: string
        }
        Insert: {
          car_id: string
          created_at?: string
          end_date: string
          id?: string
          renter_id: string
          start_date: string
          status?: string
          total_price: number
          updated_at?: string
        }
        Update: {
          car_id?: string
          created_at?: string
          end_date?: string
          id?: string
          renter_id?: string
          start_date?: string
          status?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      cars: {
        Row: {
          contact_preference: string | null
          contact_value: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string
          name: string
          owner_id: string
          price_per_day: number
          rating: number | null
          updated_at: string
        }
        Insert: {
          contact_preference?: string | null
          contact_value?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location: string
          name: string
          owner_id: string
          price_per_day: number
          rating?: number | null
          updated_at?: string
        }
        Update: {
          contact_preference?: string | null
          contact_value?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          owner_id?: string
          price_per_day?: number
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      fleet_insights: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          location: string
          predicted_demand: number | null
          prediction_time: string | null
          prediction_type: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          location: string
          predicted_demand?: number | null
          prediction_time?: string | null
          prediction_type: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          location?: string
          predicted_demand?: number | null
          prediction_time?: string | null
          prediction_type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          preferred_language: Database["public"]["Enums"]["supported_language"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          preferred_language?: Database["public"]["Enums"]["supported_language"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_language?: Database["public"]["Enums"]["supported_language"]
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewer_id: string
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewer_id: string
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          points: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          points?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          points?: number | null
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          key_name: string
          key_value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_name: string
          key_value: string
        }
        Update: {
          created_at?: string
          id?: string
          key_name?: string
          key_value?: string
        }
        Relationships: []
      }
      tokens: {
        Row: {
          artwork_id: string
          blockchain_status: string | null
          contract_address: string | null
          created_at: string
          id: string
          owner_id: string
          token_metadata: Json | null
          token_uri: string
          transaction_hash: string | null
        }
        Insert: {
          artwork_id: string
          blockchain_status?: string | null
          contract_address?: string | null
          created_at?: string
          id?: string
          owner_id: string
          token_metadata?: Json | null
          token_uri: string
          transaction_hash?: string | null
        }
        Update: {
          artwork_id?: string
          blockchain_status?: string | null
          contract_address?: string | null
          created_at?: string
          id?: string
          owner_id?: string
          token_metadata?: Json | null
          token_uri?: string
          transaction_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tokens_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rewards: {
        Row: {
          earned_at: string
          id: string
          points_earned: number | null
          reward_id: string | null
          user_id: string
        }
        Insert: {
          earned_at?: string
          id?: string
          points_earned?: number | null
          reward_id?: string | null
          user_id: string
        }
        Update: {
          earned_at?: string
          id?: string
          points_earned?: number | null
          reward_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_telemetry: {
        Row: {
          battery_level: number | null
          car_id: string | null
          created_at: string
          id: string
          last_maintenance: string | null
          location: string
          mileage: number | null
          status: string | null
        }
        Insert: {
          battery_level?: number | null
          car_id?: string | null
          created_at?: string
          id?: string
          last_maintenance?: string | null
          location: string
          mileage?: number | null
          status?: string | null
        }
        Update: {
          battery_level?: number | null
          car_id?: string | null
          created_at?: string
          id?: string
          last_maintenance?: string | null
          location?: string
          mileage?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_telemetry_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      supported_language: "es" | "en"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never