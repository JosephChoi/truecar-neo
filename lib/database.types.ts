export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: number
          email: string
        }
        Insert: {
          id?: number
          email: string
        }
        Update: {
          id?: number
          email?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          title: string
          content: string
          rating: number
          created_at: string | null
          updated_at: string | null
          user_id: string | null
          status: string | null
          image_url: string | null
          metadata: Json | null
          author: string | null
          date: string | null
          vehicle_type: string | null
          budget: string | null
          mileage: string | null
          preferred_color: string | null
          repair_history: string | null
          reference_site: string | null
          views: number | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          rating: number
          created_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          status?: string | null
          image_url?: string | null
          metadata?: Json | null
          author?: string | null
          date?: string | null
          vehicle_type?: string | null
          budget?: string | null
          mileage?: string | null
          preferred_color?: string | null
          repair_history?: string | null
          reference_site?: string | null
          views?: number | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          rating?: number
          created_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          status?: string | null
          image_url?: string | null
          metadata?: Json | null
          author?: string | null
          date?: string | null
          vehicle_type?: string | null
          budget?: string | null
          mileage?: string | null
          preferred_color?: string | null
          repair_history?: string | null
          reference_site?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 