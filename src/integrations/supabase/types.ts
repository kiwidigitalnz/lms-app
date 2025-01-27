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
      contacts: {
        Row: {
          company: string | null
          contact_type: Database["public"]["Enums"]["contact_type"]
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string | null
          mobile: string | null
          notes: string | null
          phone: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          contact_type: Database["public"]["Enums"]["contact_type"]
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name?: string | null
          mobile?: string | null
          notes?: string | null
          phone?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          contact_type?: Database["public"]["Enums"]["contact_type"]
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          mobile?: string | null
          notes?: string | null
          phone?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lease_contacts: {
        Row: {
          contact_id: string
          created_at: string | null
          id: string
          lease_id: string
          role: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          id?: string
          lease_id: string
          role: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          id?: string
          lease_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "lease_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lease_contacts_lease_id_fkey"
            columns: ["lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["id"]
          },
        ]
      }
      lease_documents: {
        Row: {
          file_path: string
          id: string
          lease_id: string
          name: string
          uploaded_at: string | null
        }
        Insert: {
          file_path: string
          id?: string
          lease_id: string
          name: string
          uploaded_at?: string | null
        }
        Update: {
          file_path?: string
          id?: string
          lease_id?: string
          name?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_lease"
            columns: ["lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lease_documents_lease_id_fkey"
            columns: ["lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["id"]
          },
        ]
      }
      lease_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          lease_id: string | null
          notification_date: string
          notification_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          lease_id?: string | null
          notification_date: string
          notification_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          lease_id?: string | null
          notification_date?: string
          notification_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lease_notifications_lease_id_fkey"
            columns: ["lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["id"]
          },
        ]
      }
      leases: {
        Row: {
          business_unit: string | null
          capitalised_improvements_rent: number | null
          created_at: string | null
          current_annual_rental: number | null
          current_cpi_percentage: number | null
          division: string | null
          end_date: string
          final_expiry_date: string | null
          fixed_rent_review_percentage: number | null
          future_rent_review_dates: string | null
          general_notes: string | null
          id: string
          lease_purpose: string | null
          lease_renewal_notice_date: string | null
          lease_type: Database["public"]["Enums"]["lease_type"]
          market_rent_review_cap: number | null
          market_rent_review_collar: number | null
          market_rent_review_estimate: number | null
          next_rent_review_date: string | null
          payment_frequency: Database["public"]["Enums"]["payment_frequency"]
          property_name: string
          rent_amount: number
          rent_review_notes: string | null
          rent_review_type: string | null
          rights_of_renewal: string | null
          security_deposit: number | null
          start_date: string
          tenant_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          business_unit?: string | null
          capitalised_improvements_rent?: number | null
          created_at?: string | null
          current_annual_rental?: number | null
          current_cpi_percentage?: number | null
          division?: string | null
          end_date: string
          final_expiry_date?: string | null
          fixed_rent_review_percentage?: number | null
          future_rent_review_dates?: string | null
          general_notes?: string | null
          id?: string
          lease_purpose?: string | null
          lease_renewal_notice_date?: string | null
          lease_type: Database["public"]["Enums"]["lease_type"]
          market_rent_review_cap?: number | null
          market_rent_review_collar?: number | null
          market_rent_review_estimate?: number | null
          next_rent_review_date?: string | null
          payment_frequency: Database["public"]["Enums"]["payment_frequency"]
          property_name: string
          rent_amount: number
          rent_review_notes?: string | null
          rent_review_type?: string | null
          rights_of_renewal?: string | null
          security_deposit?: number | null
          start_date: string
          tenant_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          business_unit?: string | null
          capitalised_improvements_rent?: number | null
          created_at?: string | null
          current_annual_rental?: number | null
          current_cpi_percentage?: number | null
          division?: string | null
          end_date?: string
          final_expiry_date?: string | null
          fixed_rent_review_percentage?: number | null
          future_rent_review_dates?: string | null
          general_notes?: string | null
          id?: string
          lease_purpose?: string | null
          lease_renewal_notice_date?: string | null
          lease_type?: Database["public"]["Enums"]["lease_type"]
          market_rent_review_cap?: number | null
          market_rent_review_collar?: number | null
          market_rent_review_estimate?: number | null
          next_rent_review_date?: string | null
          payment_frequency?: Database["public"]["Enums"]["payment_frequency"]
          property_name?: string
          rent_amount?: number
          rent_review_notes?: string | null
          rent_review_type?: string | null
          rights_of_renewal?: string | null
          security_deposit?: number | null
          start_date?: string
          tenant_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          created_at: string | null
          floor_area: number | null
          id: string
          name: string
          property_type: Database["public"]["Enums"]["property_type"]
          tenant_id: string
          updated_at: string | null
          year_built: number | null
        }
        Insert: {
          address: string
          created_at?: string | null
          floor_area?: number | null
          id?: string
          name: string
          property_type: Database["public"]["Enums"]["property_type"]
          tenant_id: string
          updated_at?: string | null
          year_built?: number | null
        }
        Update: {
          address?: string
          created_at?: string | null
          floor_area?: number | null
          id?: string
          name?: string
          property_type?: Database["public"]["Enums"]["property_type"]
          tenant_id?: string
          updated_at?: string | null
          year_built?: number | null
        }
        Relationships: []
      }
      property_compliance: {
        Row: {
          compliance_type: string
          created_at: string | null
          due_date: string
          id: string
          notes: string | null
          property_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          compliance_type: string
          created_at?: string | null
          due_date: string
          id?: string
          notes?: string | null
          property_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          compliance_type?: string
          created_at?: string | null
          due_date?: string
          id?: string
          notes?: string | null
          property_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_compliance_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_contacts: {
        Row: {
          contact_id: string
          created_at: string | null
          id: string
          property_id: string
          role: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          id?: string
          property_id: string
          role: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          id?: string
          property_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_contacts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_documents: {
        Row: {
          document_type: string
          file_path: string
          id: string
          name: string
          property_id: string
          uploaded_at: string | null
        }
        Insert: {
          document_type: string
          file_path: string
          id?: string
          name: string
          property_id: string
          uploaded_at?: string | null
        }
        Update: {
          document_type?: string
          file_path?: string
          id?: string
          name?: string
          property_id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_reviews: {
        Row: {
          cpi_adjustment_percentage: number | null
          created_at: string | null
          id: string
          lease_id: string | null
          new_amount: number
          notes: string | null
          previous_amount: number
          review_date: string
        }
        Insert: {
          cpi_adjustment_percentage?: number | null
          created_at?: string | null
          id?: string
          lease_id?: string | null
          new_amount: number
          notes?: string | null
          previous_amount: number
          review_date: string
        }
        Update: {
          cpi_adjustment_percentage?: number | null
          created_at?: string | null
          id?: string
          lease_id?: string | null
          new_amount?: number
          notes?: string | null
          previous_amount?: number
          review_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_reviews_lease_id_fkey"
            columns: ["lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_user" | "client_admin" | "tenant_user"
      contact_type:
        | "landlord"
        | "property_manager"
        | "supplier"
        | "tenant"
        | "other"
      lease_type: "commercial" | "residential" | "industrial"
      payment_frequency:
        | "weekly"
        | "fortnightly"
        | "monthly"
        | "quarterly"
        | "annually"
      property_type: "commercial" | "industrial"
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
